let snakeStage = null
let score = document.querySelector('.score')
let restart = document.querySelector('.restart')
let stop = document.querySelector('.stop')
let conti = document.querySelector('.continue')
let mask = document.querySelector('.mask')

let upBtn = document.querySelector('.up-btn');
let leftBtn = document.querySelector('.left-btn');
let rightBtn = document.querySelector('.right-btn');
let downBtn = document.querySelector('.down-btn');

restart.onclick = () => {
  if (!snakeStage.isStart) return
  snakeStage.start()
}
stop.onclick = () => {
  if (snakeStage.isStop || !snakeStage.isStart) return
  snakeStage.stop()
}
conti.onclick = () => {
  if (!snakeStage.isStop || !snakeStage.isStart) return
  snakeStage.continue()
}
mask.onclick = () => {
  if (!snakeStage.isStart) {
    snakeStage.start()
  } else {
    snakeStage.continue()
  }
}

upBtn.onclick = () => {
	snakeStage.getDirection('up')
}
leftBtn.onclick = () => {
	snakeStage.getDirection('left')
}
rightBtn.onclick = () => {
	snakeStage.getDirection('right')
}
downBtn.onclick = () => {
	snakeStage.getDirection('down')
}

class SnakeStage {
  constructor() {
    this.canvas = document.querySelector('#snake')
    this.ctx = this.canvas.getContext('2d')
    this.gridMax = [34, 45]        // 最大列
    this.dotSize = 10     // 每个点的大小
    this.direction = 'right'// up down right left 方向
    this.speed = 100        // ms 速度
    this.isStop = false     // 是否暂停
    this.isOver = false     // 是否结束
    this.isStart = false    // 是否开始
    this.score = 0          // 分数
    this.timer = null       // 移动定时器
    this.canChange = true
    this.grid = new Array()
    for (let i = 0; i < this.gridMax[0]; i++) {
      for (let j = 0; j < this.gridMax[1]; j++) {
        this.grid.push([i, j])
      } 
    }
    this.getDirection()
  }

  start() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (!this.isStart) {
      this.isStart = true
    }
    this.score = 0
    this.speed = 150
    this.isStop = false
    this.isOver = false
    this.direction = 'right'
    this.createSnake()
    this.createFood()
    this.draw()
    this.move()
    mask.style.display = 'none'
  }

  createSnake() {
    this.snake = [
      [4, 25],
      [3, 25],
    ]
  }
  move() {
    if (this.isStop) return

    let [x, y] = this.snake[0]
    switch(this.direction) {
      case 'left':
        x--
        break
      case 'right':
        x++
        break
      case 'up':
        y--
        break
      case 'down':
        y++
        break
    }
    
    if (x !== this.food[0] || y !== this.food[1]) {
      this.snake.pop()
    } else {
      this.createFood()
    }

    if (this.over([x, y])) {
      this.isOver = true
      mask.style.display = 'block'
      mask.innerHTML = 'Game Over'
      return
    }
    if (this.completed()) {
      mask.style.display = 'block'
      mask.innerHTML = '恭喜您，游戏通关'
      return
    }

    this.snake.unshift([x, y])
    
    this.draw()
    this.canChange = true
    this.timer = setTimeout(() => this.move(), this.speed)
  }
  
  // 暂停游戏
  stop() {
    if (this.isOver) return
    this.isStop = true
    mask.style.display = 'block'
    mask.innerHTML = 'Pause'
  }

  // 继续游戏
  continue() {
    if (this.isOver) return
    this.isStop = false
    this.move()
    mask.style.display = 'none'
  }

  getDirection(direction) {

		switch(direction) {
			case 'right':
				if (this.direction !== 'left') {
					this.direction = 'right'
					this.canChange = false
				}
				break;
			case 'left':
				if (this.direction !== 'right') {
					this.direction = 'left'
					this.canChange = false
				}
				break
			case 'down':
				if (this.direction !== 'up') {
					this.direction = 'down'
					this.canChange = false
				}
				break
			case 'up':
				if (this.direction !== 'down') {
					this.direction = 'up'
					this.canChange = false
				}
				break
		}

    document.onkeydown = (e) => {
      if (!this.canChange) return
      switch(e.keyCode) {
        case 37:
          if (this.direction !== 'right') {
            this.direction = 'left'
            this.canChange = false
          }
          break
        case 38:
          if (this.direction !== 'down') {
            this.direction = 'up'
            this.canChange = false
          }
          break
        case 39:
          if (this.direction !== 'left') {
            this.direction = 'right'
            this.canChange = false
          }
          break
        case 40:
          if (this.direction !== 'up') {
            this.direction = 'down'
            this.canChange = false
          }
          break
        case 32:
          // 空格暂停与继续
          if (!this.isStop) {
            this.stop()
          } else {
            this.continue()
          }
          break
      }
    }
  }
  createPos() {
    let [x, y] = this.grid[(Math.random() * this.grid.length) | 0]

    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i][0] == x && this.snake[i][1] == y) {
        return this.createPos()
      }
    }

    return [x, y]
  }
  createFood() {
    this.food = this.createPos()
    score.innerHTML = this.score++
    if (this.speed > 50) {
      this.speed--
    }
  }
  over([x, y]) {
    if (x < 0 || x >= this.gridMax[0] || y < 0 || y >= this.gridMax[1]) {
      return true
    }
  
    if (this.snake.some(v => v[0] === x && v[1] === y)) {
      return true
    }
  }
  completed() {
    if (this.snake.length == this.gridMax[0] * this.gridMax[1]) {
      return true
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle="#fff"
    this.ctx.fillRect(
      this.food[0] * this.dotSize ,
      this.food[1] * this.dotSize,
      this.dotSize,
      this.dotSize
    )
    this.ctx.fillStyle="#faa"
    this.ctx.fillRect(
      this.snake[0][0] * this.dotSize + 0.5,
      this.snake[0][1] * this.dotSize + 0.5,
      this.dotSize - 1,
      this.dotSize - 1
    )
    this.ctx.fillStyle="#fff"
    for (let i = 1; i < this.snake.length; i++) {
      this.ctx.fillRect(
        this.snake[i][0] * this.dotSize + 0.5,
        this.snake[i][1] * this.dotSize + 0.5,
        this.dotSize - 1,
        this.dotSize - 1
      )
    }
  }
}
snakeStage = new SnakeStage()