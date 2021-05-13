const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const lvlBtns = document.getElementsByClassName("lvlBtn")
const foodImg = document.getElementById("food")
const snakeSize = 15
const canvasWidth = 900
const canvasHeight = 600
var snake
var score = 0
var speed = 150
var food, tail, snakeX, snakeY
const levlDescrptn = [
    "Eat as many Rat's as possible and keep growing, but beware of eating the snake's body! You can go though the walls in this level, and we won't eliminate you :)",
    "Eat as many Rat's as possible and keep growing, but beware of eating the snake's body. Game over on hitting the wall, but you can pass through the holes!",
    "Eat as many Rat's as possible and keep growing, but beware of eating the snake's body. Game over on hitting the the wall!"
]

function snakeHead(x, y) {
    ctx.fillStyle="brown"
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize)
}

function snakeBody(x, y, nrwMrgn) {
    ctx.fillStyle="green"
    ctx.fillRect(x*snakeSize,y*snakeSize,snakeSize - nrwMrgn,snakeSize - nrwMrgn)
    ctx.strokeStyle="orange";
    ctx.strokeRect(x*snakeSize,y*snakeSize,snakeSize - nrwMrgn,snakeSize - nrwMrgn)
}

function ratFood(x,y) {
    ctx.drawImage(foodImg, x*snakeSize, y*snakeSize, 15, 15)
}

function scoreText() {
    let score_text="Rat's Eaten: " + score
    ctx.fillStyle="black"
    ctx.font="20px Georgia"
    ctx.fillText(score_text, canvasWidth - 132.5, 35)
}

function drawSnake() {
    let len=4
    snake = []
    for(let i=len-1 ; i>=0 ; i--){
        snake.push({x:i,y:1})
    }
}

// Make the canvas ready with snake, food and score

function paint(btnId) {

    snakeX = snake[0].x
    snakeY = snake[0].y
    console.log("SnakeX:",snakeX, "SnakeY:", snakeY)

    if (direction == 'right')
        snakeX++
    else if (direction == 'left')
        snakeX--
    else if (direction == 'up')
        snakeY--
    else if(direction == 'down')
        snakeY++

    switch(btnId) {
        case 'lvl1': //Through the walls 
                        if (checkCollision(snakeX, snakeY, snake)) {
                            clearScore()
                            gameOvr()
                            return
                        }

                        // Update snake on passing through wall
                        snakeXY_List = allowPassThroughWall(snakeX, snakeY)
                        snakeX = snakeXY_List[0]
                        snakeY = snakeXY_List[1]
                        break
        
        case 'lvl2': // Game over on hitting walls, but can pass through holes
                        if (checkCollision(snakeX, snakeY, snake) || secondLevelWallCheck(snakeX, snakeY)) {
                            clearScore()
                            gameOvr()
                            return
                        }

                        // Update snake on passing through wall
                        snakeXY_List = allowPassThroughWall(snakeX, snakeY)
                        snakeX = snakeXY_List[0]
                        snakeY = snakeXY_List[1]
                        break

        case 'lvl3': //Game over on hitting the walls
                        if ( hitBoundary(snakeX, snakeY) || checkCollision(snakeX, snakeY, snake)) {
                            clearScore()
                            gameOvr()
                            return
                        }
                        break
                    
    }

    if(snakeX == food.x && snakeY == food.y) {
        tail = {x: snakeX, y: snakeY} //Create a new head instead of moving the tail
        score ++
        ctx.clearRect(0,0,canvasWidth,canvasHeight)
        createFood() //Create new food
    } else {
        tail = snake.pop() //pops out the last cell
        tail.x = snakeX
        tail.y = snakeY
        ctx.clearRect(0,0,canvasWidth,canvasHeight)
    }

    // Design obstacles for different levels
    switch(btnId) {
        case 'lvl2': // Level with 4 holes in 4 wall
                        ctx.fillStyle = "#6b2800"                                     //-|
                        ctx.fillRect(0, 0, canvasWidth/2 - 30, 15)                    // |
                        ctx.fillStyle = "#6b2800"                                     // | Top Bar
                        ctx.fillRect(canvasWidth/2 + 15, 0, canvasWidth/2 - 15, 15)   //-|
                        ctx.fillStyle = "#6b2800"                                     //-|
                        ctx.fillRect(0, 0, 15, canvasHeight/2 - 30)                   // | Left Bar
                        ctx.fillStyle = "#6b2800"                                     // |
                        ctx.fillRect(0, canvasHeight/2 + 15, 15, canvasHeight/2 - 15) //-|
                        ctx.fillStyle = "#6b2800"                                     //-|
                        ctx.fillRect(0, canvasHeight - 15, canvasWidth/2 - 30, 15)    // |
                        ctx.fillStyle = "#6b2800"                                     // | Bottom Bar
                        ctx.fillRect(canvasWidth/2 + 15, canvasHeight - 15,           // |
                                     canvasWidth/2 - 15, 15)                          //-|
                        ctx.fillStyle = "#6b2800"                                     //-|
                        ctx.fillRect(canvasWidth - 15, 0, 15, canvasHeight/2 - 30)    // |
                        ctx.fillStyle = "#6b2800"                                     // | Right Bar
                        ctx.fillRect(canvasWidth - 15, canvasHeight/2 + 15, 15,       // |
                                     canvasHeight/2 - 15)                             //-|
                        break

        case 'lvl3': // Level with complete walls
                        ctx.fillStyle = "#6b2800"                                      //-|
                        ctx.fillRect(0, 0, canvasWidth, 15)                            //-| Top Bar
                        ctx.fillStyle = "#6b2800"                                      //-|
                        ctx.fillRect(0, 0, 15, canvasHeight)                           //-| Left Bar
                        ctx.fillStyle = "#6b2800"                                      //-|
                        ctx.fillRect(0, canvasHeight - 15, canvasWidth, 15)            //-| Bottom Bar
                        ctx.fillStyle = "#6b2800"                                      //-|
                        ctx.fillRect(canvasWidth - 15, 0, 15, canvasHeight)            //-| Right Bar
                        break
    }

    //The snake can now eat the food.
    snake.unshift(tail) //puts back the tail as the first cell

    for(let i = 0; i < snake.length; i++)
        i == 0 ? snakeHead(snake[i].x, snake[i].y)
               : snakeBody(snake[i].x, snake[i].y, i*0.035)

    ratFood(food.x, food.y)

    // Print score
    scoreText()

    // Controls speed, by changing the time in which the canvas is painted again
    setTimeout(paint, increaseSpeed(), btnId)
}

// Create food at random location within the canvas

function createFood() {

    food = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1)
    }

    for (let i=0; i<snake.length; i++) {
        snakeX = snake[i].x
        snakeY = snake[i].y

        if (food.x === snakeX && food.y === snakeY ||
            food.y === snakeY && food.x === snakeX) {
            food.x = Math.floor((Math.random() * 30) + 1)
            food.y = Math.floor((Math.random() * 30) + 1)
        }
    }
}

// Update snake body after passing through wall

function allowPassThroughWall(snakeX, snakeY) {

    snakeXY_lst = []

    // Pass through horizontal wall
    if(snakeX >= canvasWidth/snakeSize)
        snakeX = snakeX - canvasWidth/snakeSize
    else if (snakeX < 0)
        snakeX = snakeX + canvasWidth/snakeSize

    // Pass through vertical wall
    if(snakeY >= canvasHeight/snakeSize)
        snakeY = snakeY - canvasHeight/snakeSize
    else if (snakeY < 0)
        snakeY = snakeY + canvasHeight/snakeSize

    snakeXY_lst.push(snakeX, snakeY)
    return snakeXY_lst
}

// Check if snake's head touches the boundary

function hitBoundary(snakeX, snakeY) {

    if( snakeX == 0 || snakeX == (canvasWidth/snakeSize - 1) ||
        snakeY == 0 || snakeY == (canvasHeight/snakeSize - 1) )
        return true

    return false
}

// Check if snake touches own body

function checkCollision(x, y, array) {

    for(let i = 0; i < array.length; i++)
        if(array[i].x === x && array[i].y === y)
            return true

    return false
}

// Second level wall check

function secondLevelWallCheck(snakeX, snakeY) {

    holePositionsX = canvasWidth/(snakeSize*2)
    holePositionsY = canvasHeight/(snakeSize*2)

    // Hole locations
    topBottomHoleX = [holePositionsX - 2, holePositionsX - 1, holePositionsX]
    topHoleY = 0
    bottomHoleY = canvasHeight/snakeSize - 1
    leftRightHoleY = [holePositionsY - 2, holePositionsY - 1, holePositionsY]
    rightHoleX = canvasWidth/snakeSize - 1
    leftHoleX = 0

    if ( (topBottomHoleX.indexOf(snakeX) !== -1 && (snakeY == topHoleY || snakeY == bottomHoleY)) ||
         (leftRightHoleY.indexOf(snakeY) !== -1 && (snakeX == leftHoleX || snakeX == rightHoleX)))
        return false
    else if(snakeX !== topBottomHoleX && snakeY !== leftRightHoleY &&
            hitBoundary(snakeX, snakeY))
        return true
    else
        return false
}

// Update speed with score

function increaseSpeed() {

    let newSpeed = speed - 3.5 * score
    if (newSpeed > 50)
        return newSpeed
    
    return 50
}

// Clear score when game ends

function clearScore() {

    // Hack: Clear the top-right corner score
    ctx.fillStyle = "#e6f7d3"
    ctx.fillRect(canvasWidth-132.5, 15, 117.5, 20)
}


// Start game function

function start(btnId) {

    direction = 'down'
    drawSnake()
    createFood()
    paint(btnId)

    document.onkeydown = function(event) {
        keyCode = event.code || event.key

        switch(keyCode) {
            case 'KeyA':
            case 'Numpad4':
            case 'ArrowLeft':
                if (direction != 'right')
                    direction = 'left'
                    event.preventDefault()
                break

            case 'KeyD':
            case 'Numpad6':
            case 'ArrowRight':
                if (direction != 'left')
                    direction = 'right'
                    event.preventDefault()
                break

            case 'KeyW':
            case 'Numpad8':
            case 'ArrowUp':
                if (direction != 'down')
                    direction = 'up'
                    event.preventDefault()
                break

            case 'KeyS':
            case 'Numpad2':
            case 'ArrowDown':
                if (direction != 'up')
                    direction = 'down'
                    event.preventDefault()
                break
        }
    }
}


// Game over

function gameOvr() {
    let ovrTxt = document.getElementById("gmeOvr")
    ovrTxt.style.display = "block"

    let scrTxt = document.getElementById("scoreTxt")
    scrTxt.style.display = "block"

    let scr = document.getElementById("score")
    scr.innerHTML = score

    // reset score
    score = 0

    let plyAgnBtn = document.getElementById("plyAgain")
    plyAgnBtn.style.display = "block"
}


// Reset values before replay

function resetGame() {

    // clear canvas
    ctx.clearRect(0,0,canvasWidth,canvasHeight)

    let chseLvl = document.getElementById("chooseLvl")
    chseLvl.style.display = "block"

    //restart game
    for(let x = 0; x < lvlBtns.length; x++)
        lvlBtns[x].removeAttribute('disabled')

    let ovrTxt = document.getElementById("gmeOvr")
    ovrTxt.style.display = "none"

    let scrTxt = document.getElementById("scoreTxt")
    scrTxt.style.display = "none"

    let plyAgnBtn = document.getElementById("plyAgain")
    plyAgnBtn.style.display = "none"

    let timer = document.getElementById("timer")
    timer.innerHTML = "00:10"
}


// Countdown before game starts

function countdownTimer(duration, contxt, aboutHead, about, timerTxt) {
    tmr = setInterval( function () {
            timeleft = duration < 10 ? "00:0" : "00:"
            contxt.innerHTML = timeleft + duration
            if (duration == 0) {
                about.style.display = "none"
                aboutHead.style.display = "none"
                timerTxt.style.display = "none"
                clearInterval(tmr)
                return
            }
            duration --
        }, 1000)
}


// Display instructions and timer, call start()

function beginGame(element) {

    // Disable the level buttons
    for(let x=0; x<lvlBtns.length; x++)
        lvlBtns[x].setAttribute('disabled', true)
    
    // let instrctnSection = document.getElementById("instrctn")
    let timerTxt = document.getElementById("timertxt")
    timerTxt.style.display = "block"

    let aboutHead = document.getElementById("instrctnHead")
    aboutHead.style.display = "block"

    let about = document.getElementById("aboutSection")
    about.style.display = "block"
    let levelId = element.id
    levelIdNum = parseInt((levelId.split('lvl'))[1])
    about.innerHTML = levlDescrptn[levelIdNum - 1]

    let chseLvl = document.getElementById("chooseLvl")
    chseLvl.style.display = "none"

    let timer = document.getElementById("timer")
    countdownTimer(9, timer, aboutHead, about, timerTxt)
    setTimeout(start, 10000, levelId)
}