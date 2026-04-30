let linkBoard = new Board(settings.boardGridWidth, settings.boardGridHeight, 0, 0, settings.boardVisualWidth)

let showWinScreen = false

function printDebugToScreen() {
    let debugString = ""
    for (const [k, v] of Object.entries(linkBoard.dragging)) {
        debugString = debugString + `${k}: ${v}\n`
    }

    push()
    textSize(20)
    textAlign(LEFT, TOP)
    text(debugString, 10, 10)
    pop()
}

function testTouching() {
    console.log("testing Board.areTouching() function...")

    noLoop()

    background(255)

    let pairs = []

    for (let i = 0; i < Math.max(settings.boardGridWidth * settings.boardGridWidth, settings.boardGridHeight * settings.boardGridHeight); i++) {
        pairs.push([
            floor(random(0, settings.boardGridWidth * settings.boardGridWidth)),
            floor(random(0, settings.boardGridWidth * settings.boardGridWidth))
        ])
    }

    linkBoard.showGrid()

    let index = 0

    let usedPoints = []

    for (let pair of pairs) {
        let touching = linkBoard.areTouching(pair[0], pair[1])
        console.log(pair, touching)

        let p1 = linkBoard.coordsAtIndex(pair[0])
        let p2 = linkBoard.coordsAtIndex(pair[1])

        for (let canvPair of usedPoints) {
            if (canvPair[0] === p1.x && canvPair[1] === p1.y) {
                p1.y += 10 / linkBoard.gridSpacing
            }
            if (canvPair[0] === p2.x && canvPair[1] === p2.y) {
                p2.y += 10 / linkBoard.gridSpacing
            }
        }

        let x1 = p1.x
        let x2 = p2.x
        let y1 = p1.y
        let y2 = p2.y

        let scaleUpConst = linkBoard.gridSpacing
        let arrayGap = 20

        if (touching) stroke(0, 0, 255)
        else stroke(255, 0, 0, 100)

        line((x1 + 0.5) * scaleUpConst, (y1 + 0.5) * scaleUpConst, (x2 + 0.5) * scaleUpConst, (y2 + 0.5) * scaleUpConst)
        ellipse((x1 + 0.5) * scaleUpConst, (y1 + 0.5) * scaleUpConst, 5, 5)
        ellipse((x2 + 0.5) * scaleUpConst, (y2 + 0.5) * scaleUpConst, 5, 5)

        index++
        usedPoints.push([p1.x, p1.y])
        usedPoints.push([p2.x, p2.y])
    }
}

let benchmarkIterations = 100
let benchmarkPuzzleSize = 4
let benchmarkMaxPuzzleSize = 10
function puzzleGeneratorBenchmark() {
    linkBoard.showBoard(mouseX, mouseY, false, { highlightDrag: true, highlightCompletedLinks: false })
    if (benchmarkPuzzleSize > benchmarkMaxPuzzleSize) {
        console.log("Benchmark completed.")
        noLoop()
    }

    linkBoard = new Board(benchmarkPuzzleSize, benchmarkPuzzleSize, 0, 0, settings.boardVisualWidth)

    let statsArray = []
    for (let i = 0; i < benchmarkIterations; i++) {
        statsArray.push(linkBoard.keepWandering(false))
        if (i % 10 === 0) console.log(`Completed ${i} iterations...`)
    }
    let numWandersAverage = 0
    let totalTimeAverage = 0
    for (let i = 0; i < benchmarkIterations; i++) {
        numWandersAverage += statsArray[i].numWanders
        totalTimeAverage += statsArray[i].totalTime
    }
    numWandersAverage /= benchmarkIterations
    totalTimeAverage /= benchmarkIterations
    console.log(`Completed puzzle benchmark at size ${benchmarkPuzzleSize} with average wanders ${numWandersAverage} and average time ${totalTimeAverage}ms`)
    benchmarkPuzzleSize++
}

let unitTest = puzzleGeneratorBenchmark

let isWandering = false
let numWanders = 0
let wanderStartTime = 0
let paused = false

function resetPuzzle(showSolution) {
    showWinScreen = false
    linkBoard = new Board(settings.boardGridWidth, settings.boardGridHeight, 0, 0, settings.boardVisualWidth)
    linkBoard.keepWandering()
    if (!showSolution) linkBoard.clearLinks()
}

function visualizeResetPuzzle() {
    showWinScreen = false
    isWandering = true
    wanderStartTime = millis()
    numWanders = 0
}

function setup() {
    initSettings()

    createCanvas(canvasSize, canvasSize)

    // linkBoard.addLink(linkBoard.getGridIndex(4, 2), linkBoard.getGridIndex(2, 5))
    // linkBoard.addLink(linkBoard.getGridIndex(4, 1), linkBoard.getGridIndex(0, 6))
    // linkBoard.addLink(linkBoard.getGridIndex(1, 1), linkBoard.getGridIndex(3, 2))
    // linkBoard.addLink(linkBoard.getGridIndex(3, 0), linkBoard.getGridIndex(4, 6))
    // linkBoard.addLink(linkBoard.getGridIndex(5, 1), linkBoard.getGridIndex(3, 3))

    // linkBoard = new WikipediaExample(0, 0, settings.boardVisualWidth)

    // linkBoard = new FlowExample(0, 0, settings.boardVisualWidth)

    // linkBoard = new Board(5, 5, 0, 0, settings.boardVisualWidth)
    // linkBoard.addLinkByCoords(0, 0, 2, 1)
    // linkBoard.addLinkByCoords(1, 1, 4, 2)
    // linkBoard.addLinkByCoords(4, 3, 3, 4)
    // linkBoard.addLinkByCoords(0, 3, 2, 4)
    // linkBoard.addLinkByCoords(3, 1, 1, 3)

    // linkBoard = new Board(7, 7, 0, 0, settings.boardVisualWidth)
    // linkBoard.keepWandering()
    // linkBoard.clearLinks()

    /**
    . . . . . . . .
    . . . . . . . .
    . A E . . . A .
    . . D . B . C .
    . E . . . . . .
    . C . . . . B D
    . . . . . . . .
    **/
    // https://forum.ukpuzzles.org/viewtopic.php?p=147#p147
    // linkBoard = new Board(8, 7, 0, 0, settings.boardVisualWidth)
    // linkBoard.addLinkByCoords(1, 2, 6, 2)
    // linkBoard.addLinkByCoords(4, 3, 6, 5)
    // linkBoard.addLinkByCoords(6, 3, 1, 5)
    // linkBoard.addLinkByCoords(2, 3, 7, 5)
    // linkBoard.addLinkByCoords(2, 2, 1, 4)

    // https://sysid.github.io/numberlink-puzzle/

    // linkBoard = new Board(11, 11, 0, 0, settings.boardVisualWidth)
    // linkBoard.addLinkByCoords(0, 0, 1, 5)
    // linkBoard.addLinkByCoords(10, 0, 3, 8)
    // linkBoard.addLinkByCoords(2, 1, 6, 4)
    // linkBoard.addLinkByCoords(4, 1, 1, 3)
    // linkBoard.addLinkByCoords(6, 1, 9, 9)
    // linkBoard.addLinkByCoords(8, 1, 5, 4)
    // linkBoard.addLinkByCoords(9, 3, 5, 8)
    // linkBoard.addLinkByCoords(4, 4, 1, 9)
    // linkBoard.addLinkByCoords(9, 5, 7, 8)

    // Fun board. Maybe solution is unique?
    linkBoard = new Board(9, 9, 0, 0, 550)
    linkBoard.addLink(8, 0)
    linkBoard.addLink(57, 26)
    linkBoard.addLink(36, 72)
    linkBoard.addLink(35, 80)
    linkBoard.addLink(69, 41)
    linkBoard.addLink(58, 76)
    linkBoard.addLink(65, 48)
    linkBoard.addLink(12, 30)
    linkBoard.addLink(1, 19)
    linkBoard.addLink(23, 7)

    document.getElementById("loadingPrompt").remove();
}

function draw() {
    background(0)

    linkBoard.changeVisualWidth(settings.boardVisualWidth)

    if (testing) {
        unitTest()
        return
    }

    if (linkBoard.allLinksComplete() && linkBoard.allSpacesFilled()) {
        showWinScreen = !settings.turnOffWinScreen
        if (settings.autoNextPuzzle) setTimeout(resetPuzzle, 1000)
    } else {
        showWinScreen = false
    }

    if (mouseIsPressed) {
        if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height) {
            // mouse is off-canvas, don't update until back on canvas
        } else {
            linkBoard.smoothUpdate(linkBoard.getGridIndexFromScreen(mouseX, mouseY))
        }
    } else {
        linkBoard.stopDragging()
        linkBoard.pruneUnfinishedLinks()
    }

    if (!paused) for (let i = 0; i < settings.wanderSpeedFactor; i++) if (isWandering) {
        isWandering = !linkBoard.wanderTest(4)
        numWanders++
        if (!isWandering) {
            linkBoard.clearLinks()
            let elapsedMillis = millis() - wanderStartTime
            console.log(`Attempted ${numWanders} wanders in ${elapsedMillis}ms (${Math.floor(elapsedMillis / 60000)}min ${elapsedMillis / 1000 - 60 * Math.floor(elapsedMillis / 60000)}sec)`)
        }
    } else break

    linkBoard.showBoard(mouseX, mouseY, showWinScreen, { highlightDrag: true, highlightCompletedLinks: false })

    if (debug) printDebugToScreen()
}

function keyReleased() {
    switch (key) {
        case " ":
        case "Enter":
            resetPuzzle()
            break
        case "s":
            resetPuzzle(true)
            break
        case "v":
            visualizeResetPuzzle()
            break
        case "c":
            linkBoard.clearLinks()
            break
        case "e":
            linkBoard.outputInitializer()
            break
    }
}