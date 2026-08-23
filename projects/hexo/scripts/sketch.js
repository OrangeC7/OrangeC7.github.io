let gameboard
let viewPosition
let viewScale = 1
let trueMouseX
let trueMouseY
let truePMouseX
let truePMousey
let mouseClickStartPosition
let lastClickWasDrag = false
let clickRegistrationRadius = 10 // setting

let aiP1 = new AIPlayer()
let ai = new AIPlayer()

function resetBoard() {
    gameboard = new HexBoard(50)
}

let isMouseOnScreen
function setup() {
    createCanvas(1000, 1000)

    isMouseOnScreen = function () {
        return mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0
    }

    settings.initialize()

    settings.handlers.resetGameBoard.setBehaviour(resetBoard)
    resetBoard()

    viewPosition = createVector(0, 0)
}

function draw() {
    if (mouseIsPressed && isMouseOnScreen()) viewPosition.add(mouseX - pmouseX, mouseY - pmouseY)
    trueMouseX = (mouseX - viewPosition.x - width / 2) / viewScale
    trueMouseY = (mouseY - viewPosition.y - height / 2) / viewScale
    translate(viewPosition.x + width / 2, viewPosition.y + height / 2)
    scale(viewScale)
    background("#7e7e7e") // setting

    if (gameboard.currentPlayer === PLAYER2) ai.playMove(gameboard)
    // else aiP1.playMove(gameboard)

    gameboard.renderBoard(trueMouseX, trueMouseY, viewScale)

    truePMouseX = trueMouseX
    truePMouseY = trueMouseY
}

function mousePressed() {
    mouseClickStartPosition = createVector(mouseX, mouseY)
}

function mouseReleased() {
    lastClickWasDrag = mouseClickStartPosition.dist(createVector(mouseX, mouseY)) > clickRegistrationRadius
}

function mouseClicked() {
    if (!lastClickWasDrag && isMouseOnScreen() && gameboard.currentPlayer === PLAYER1) {
        gameboard.click(trueMouseX, trueMouseY)
    }
}

function mouseWheel(event) {
    let minViewScale = 0.05
    let maxViewScale = 10
    if (isMouseOnScreen()) {
        let oldViewScale = viewScale
        viewScale -= viewScale * event.delta / 100
        if (viewScale < minViewScale) {
            viewScale = minViewScale
        } else if (viewScale > maxViewScale) {
            viewScale = maxViewScale
        }
        viewPosition.mult(viewScale / oldViewScale)
    }
}