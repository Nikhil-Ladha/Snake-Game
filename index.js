
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const btn = document.getElementById("btn")
const foodImg = document.getElementById("food")
const snakeSize = 15
const w = 600
const h = 600
var snake
var score = 0
var food, tail, snakeX, snakeY
btn.addEventListener("click", () => update() )

function snakeHead(x, y) {
    ctx.fillStyle="brown"
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize)
}

function snakeBody(x, y, nrw_mrgn) {
    ctx.fillStyle="green"
    ctx.fillRect(x*snakeSize,y*snakeSize,snakeSize - nrw_mrgn,snakeSize - nrw_mrgn)
    ctx.strokeStyle="orange";
    ctx.strokeRect(x*snakeSize,y*snakeSize,snakeSize - nrw_mrgn,snakeSize - nrw_mrgn)
}

function ratFood(x,y) {
    ctx.drawImage(foodImg, x*snakeSize, y*snakeSize, 15, 15)
}

function scoreText() {
    let score_text="Score: " + score
    ctx.fillStyle="black"
    ctx.font="20px Georgia"
    ctx.fillText(score_text, w-70, 20)
}

function drawSnake() {
    let len=4
    snake = []
    for(let i=len-1 ; i>=0 ; i--){
        snake.push({x:i,y:1})
    }
}

function paint() {
    btn.setAttribute('disabled',true)
    snakeX = snake[0].x
    snakeY = snake[0].y

    if (direction == 'right')
        snakeX++
    else if (direction == 'left')
        snakeX--
    else if (direction == 'up')
        snakeY--
    else if(direction == 'down')
        snakeY++

    if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
        //restart game
        btn.removeAttribute('disabled')
        score=0
        //ctx.clearRect(0,0,w,h);
        clearInterval(loop)
        return
    }

    if(snakeX == food.x && snakeY == food.y) {
        tail = {x: snakeX, y: snakeY} //Create a new head instead of moving the tail
        score ++
        ctx.clearRect(0,0,w,h)				
        createFood() //Create new food
    } else {
        tail = snake.pop() //pops out the last cell
        tail.x = snakeX
        tail.y = snakeY
        ctx.clearRect(0,0,w,h)
    }

    //The snake can now eat the food.
    snake.unshift(tail) //puts back the tail as the first cell

    for(let i = 0; i < snake.length; i++)
        i == 0 ? snakeHead(snake[i].x, snake[i].y) : snakeBody(snake[i].x, snake[i].y, i*0.035)

    ratFood(food.x, food.y)
    scoreText()
}

function createFood() {

    food = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1)
    }

    for (let i=0; i<snake.length; i++) {
        snakeX = snake[i].x
        snakeY = snake[i].y

        if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x=== snakeX) {
            food.x = Math.floor((Math.random() * 30) + 1)
            food.y = Math.floor((Math.random() * 30) + 1)
        }
    }
}

function checkCollision(x, y, array) {

    for(let i = 0; i < array.length; i++)
        if(array[i].x === x && array[i].y === y)
            return true

    return false
}

function update() {

    direction = 'down';
    drawSnake();
    createFood();
    loop=setInterval(paint,80);

    document.onkeydown = function(event) {
        keyCode = window.event.keyCode; 
        keyCode = event.keyCode;

        switch(keyCode) {
            case 37: 
                if (direction != 'right')
                    direction = 'left'
                break

            case 39:
                if (direction != 'left')
                    direction = 'right'
                break

            case 38:
                if (direction != 'down')
                    direction = 'up'
                break

            case 40:
                if (direction != 'up')
                    direction = 'down'
                break
        }
    }
}