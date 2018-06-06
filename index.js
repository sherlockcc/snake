//食物
(function(window) {
	//声明一个数组，用来保存食物.
	var foodArray = [];
	//1.创建食物构造函数
	function Food(x, y, width, height, color) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 20;
		this.height = height || 20;
		this.color = color || "green";
	}
	//2.因为每一个食物都要显示在地图上，所以这个显示食物的方法，就写成原型方法。
	Food.prototype.show = function(map) {
		//渲染新食物之前，应该把原来的食物给删掉。
		remove();
		//随机生成x和y
		this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
		this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
		//想要让食物显示在地图上，就可以创建一个div，让这个div拥有这个食物所有的属性样式。
		var divs = document.createElement("div");
		divs.style.position = "absolute";
		divs.style.top = this.y + "px";
		divs.style.left = this.x + "px";
		divs.style.width = this.width + "px";
		divs.style.height = this.height + "px";
		divs.style.backgroundColor = this.color;
		//把这个div装进那个map中.
		map.appendChild(divs);
		//把这个食物的div给保存进那个eles数组中.
		foodArray.push(divs);
	}
	//删掉食物的方法 - 私有方法
	function remove() {
		for(var i = foodArray.length - 1; i >= 0; i--) {
			foodArray[i].parentNode.removeChild(foodArray[i]);
			foodArray.pop();
		}
	}

	//因为这里是一个沙盒，要把这个构造函数暴露外面去。
	window.Food = Food;
}(window));

//蛇
(function(window) {
	//声明一个数组，用来保存蛇.
	var snakeArray = [];
	//声明一个数组，显示蛇的颜色.
	var snakeColor = ["skyblue", "green", "pink", "orange", "greenyellow"];
	//声明一个变量记录分数
	var num = 0;
	//1.创建蛇的构造函数
	function Snake(width, height, direction) {
		
		
		
		//保证食物和蛇一样大
		this.width = width || 20;
		this.height = height || 20;
		this.direction = direction || "→"; //蛇默认向右移动
		//假设蛇一开始是三节.
		//每一节应该是一个对象，因为每一节都有x，y和color
		//数组的第一个元素是蛇头
		this.body = [{
				x: 2,
				y: 0,
				color: "red"
			},
			{
				x: 1,
				y: 0,
				color: "greenyellow"
			},
			{
				x: 0,
				y: 0,
				color: "skyblue"
			}
		]
	}
	//2.让蛇显示在map.
	Snake.prototype.show = function(map) {
		//显示蛇之前，把之前的蛇给删掉
		remove();

		//蛇的每一节都要显示。找到蛇的每一节。
		for(var i = 0; i < this.body.length; i++) {
			//保存蛇的每一节.
			var childs = this.body[i];
			//创建div，让div拥有这个蛇的每一节的属性样式。
			var divs = document.createElement("div");
			divs.style.position = "absolute";
			divs.style.left = childs.x * this.width + "px";
			divs.style.top = childs.y * this.height + "px";
			divs.style.width = this.width + "px";
			divs.style.height = this.height + "px";
			divs.style.backgroundColor = childs.color;
			//要把div假如到map中
			map.appendChild(divs);

			//把这个div装进eles数组中
			snakeArray.push(divs);
		}
	}

	//4.删掉蛇的方法 - 私有方法
	function remove() {
		for(var i = snakeArray.length - 1; i >= 0; i--) {
			snakeArray[i].parentNode.removeChild(snakeArray[i]);
			snakeArray.pop();
		}
	}

	//3.蛇移动的方法
	Snake.prototype.move = function(food,map) {
		//移动蛇身体(不包含蛇头)
		//蛇中间部分可以给蛇尾巴，蛇头可以给蛇中间部分。
		for(var i = this.body.length - 1; i > 0; i--) {
			this.body[i].x = this.body[i - 1].x;
			this.body[i].y = this.body[i - 1].y;
		}
		//蛇头移动-蛇头是根据方向移动的。
		switch(this.direction) {
			case "→":
				this.body[0].x += 1;
				break;
			case "←":
				this.body[0].x -= 1;
				break;
			case "↑":
				this.body[0].y -= 1;
				break;
			case "↓":
				this.body[0].y += 1;
				break;
		}

		//蛇移动的时候，判断蛇有没有吃到食物.蛇头的坐标和食物的坐标重合了就表示蛇吃到了食物
		var foodX = food.x;
		var foodY = food.y;
		var headX = this.body[0].x * this.width;
		var headY = this.body[0].y * this.height;
		
		if(headX == foodX && headY == foodY) {
			//吃到食物了就应该长一节身体。
			var newSnakeHead = this.body[this.body.length - 1];
			this.body.push({
				x: newSnakeHead.x,
				y: newSnakeHead.y,
				color: snakeColor[Math.floor(Math.random() * (snakeColor.length - 1))]
			});
			//重新创建一个食物
			food.show(map);
			num++;
			//增加分数
			document.querySelector("span").innerHTML = num;
		}
	}

	//因为这里是一个沙盒，要把这个构造函数暴露外面去。
	window.Snake = Snake;
}(window));

//游戏对象
(function(window) {
	
//	var that = null;

	//1.游戏对象  构造函数
	function Game(map) {
		this.food = new Food();
		this.snake = new Snake();
		this.map = map;
		//在构造函数里面，this就是创建出来的那个game对象。
		that = this;
	}

	//2.游戏开始的方法
	Game.prototype.start = function() {
		//让食物和蛇显示出来
		this.food.show(this.map);
		this.snake.show(this.map);
		//让蛇自动移动起来。
		runSnake();
		//调用方法bindKey.获取按的键，从而改变蛇的移动方向
		getKey();
	}

	//3.写一个函数，让蛇自动移动-私有方法
	function runSnake() {
		//计时器是window调用的，setInterval里面的this指向window
		//但是我们目的是让蛇移动，蛇在Game对象里面，在window里面没有，所以调用setInterval的时候，改变setInterval里面this的指向.
		var timeId = setInterval(function() {
			//这里的this就是那个game对象。
			this.snake.move(this.food, this.map);
			this.snake.show(this.map);

			//判断蛇有没有撞到墙。
			var headX = this.snake.body[0].x;
			var headY = this.snake.body[0].y;
			var maxX = this.map.offsetWidth / this.snake.width;
			var maxY = this.map.offsetHeight / this.snake.height;
			if(headX >= maxX || headY >= maxY || headX <0 || headY <0) {
				//结束游戏
				alert("Game Over!");
				clearInterval(timerID);
			}
		}.bind(that), 100);
	}
	//4.写一个方法，获取按键，从而改变蛇的移动方向
	function getKey() {
		document.addEventListener("keydown", function(e) {
			e = e || window.event;
			switch(e.keyCode) {
				case 37:
					this.snake.direction = "←";
					break;
				case 38:
					this.snake.direction = "↑";
					break;
				case 39:
					this.snake.direction = "→";
					break;
				case 40:
					this.snake.direction = "↓";
					break;
			}
		}.bind(that), false);
	}

	//把Game构造函数给暴露出去
	window.Game = Game;
}(window));