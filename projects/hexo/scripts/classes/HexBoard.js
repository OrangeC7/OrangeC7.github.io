class HexBoard {
    constructor(hexRadius) {
        this.boardHexes = []
        this.playedHexes = []
        this.hexRadius = hexRadius
        this.addHex(0, 0)

        this.currentPlayer = PLAYER1
        this.currentPlayedTurns = 1

        this.gameover = false
        this.winningRow = []

        // let hexHeight = 2 * Math.sqrt(hexRadius * hexRadius * 3 / 4)
        // for (let i = -boardRadiusInHexes; i < boardRadiusInHexes + 1; i++) {
        //     let columnHeightInHexes = boardRadiusInHexes * 2 + 1 - Math.abs(i)
        //     for (let j = 0; j < columnHeightInHexes; j++) {
        //         this.boardHexes.push(new Hex(i * 3 * hexRadius / 2, -columnHeightInHexes * hexHeight / 2 + j * hexHeight, hexRadius))
        //     }
        // }
    }

    setHexRadius(r) {
        for (let hex of this.boardHexes) hex.setRadius(r)
    }

    updateHexFromNeighbors(hexBeingChecked) {
        let hexBeingCheckedCoordinates = hexBeingChecked.getBoardCoordinates()
        for (let hex of this.playedHexes) {
            let hexCoordinates = hex.getBoardCoordinates()
            if (hexBeingCheckedCoordinates.x === hexCoordinates.x && hexBeingCheckedCoordinates.y === hexCoordinates.y) continue
            for (const relativeCoordinates of HEX_NEIGHBORS) {
                if (hexBeingCheckedCoordinates.x + relativeCoordinates.x === hexCoordinates.x && hexBeingCheckedCoordinates.y + relativeCoordinates.y === hexCoordinates.y) {
                    hexBeingChecked.isNeighboringPlayedHex = true
                    return
                }
            }
        }
    }

    addHex(x, y) {
        let newHex = new Hex(x, y, this.hexRadius)
        this.updateHexFromNeighbors(newHex)
        this.boardHexes.push(newHex)
    }

    getHexAtBoardCoordinates(boardX, boardY) {
        function isInt(a) { return a === Math.floor(a) }
        if (!isInt(boardX) || !isInt(boardY)) console.error(`Hex.getHexAtCoordinates() is expecting an integer, but got ${boardX}, ${boardY} instead`)

        for (let hex of this.boardHexes) {
            if (hex.boardX === boardX && hex.boardY === boardY) return hex
        }
        return false
    }

    getHexAtScreenCoordinates(screenX, screenY) {
        for (let hex of this.boardHexes) if (hex.isPointIntersecting(screenX, screenY)) return hex
        return false
    }

    expandBoardAround(centerHex) {
        let relativeHexPositionsToAdd = HEX_REVEAL_MASK.slice()

        for (let hex of this.boardHexes) {
            let hexPosition = hex.getBoardCoordinates()
            for (let i = 0; i < relativeHexPositionsToAdd.length; i++) {
                if (hexPosition.x === centerHex.boardX + relativeHexPositionsToAdd[i].x && hexPosition.y === centerHex.boardY + relativeHexPositionsToAdd[i].y) {
                    relativeHexPositionsToAdd[i] = false
                }
            }
            this.updateHexFromNeighbors(hex)
        }
        for (let newRelativeHexPosition of relativeHexPositionsToAdd) {
            if (newRelativeHexPosition) this.addHex(newRelativeHexPosition.x + centerHex.boardX, newRelativeHexPosition.y + centerHex.boardY, this.hexRadius)
        }
    }

    findRowOutwardsFrom(hex, rowDirection) {
        let rowLength = 0
        let rowHexes = [hex]
        let currentHex = hex
        for (let j = 0; j < settings.winConditionLength; j++) {
            let nextHex = this.getHexAtBoardCoordinates(currentHex.boardX + HEX_NEIGHBORS[rowDirection].x, currentHex.boardY + HEX_NEIGHBORS[rowDirection].y)
            if (!nextHex || nextHex.playedState !== currentHex.playedState) break
            rowLength++
            rowHexes.push(nextHex)
            currentHex = nextHex
        }
        return { rowLength, rowHexes }
    }

    findWinCondition() {
        for (let hex of this.playedHexes) {
            for (let i = 0; i < 3; i++) {
                let results = this.findRowOutwardsFrom(hex, i)
                let rowHexes = [...results.rowHexes]
                let rowLength = 1 + results.rowLength
                if (rowLength >= settings.winConditionLength) return { exists: true, rowHexes, rowLength }

                results = this.findRowOutwardsFrom(hex, i + 3)
                rowHexes = rowHexes.concat(results.rowHexes)
                rowLength += results.rowLength
                if (rowLength >= settings.winConditionLength) return { exists: true, rowHexes, rowLength }
            }
        }
        return { exists: false }
    }

    detectWinCondition() {
        let results = this.findWinCondition()
        this.winningRow = results.rowHexes
        return this.gameover = results.exists
    }

    playMove(hex) {
        if (hex.playedState === UNPLAYED && !this.gameover) {
            hex.setPlayedState(this.currentPlayer)
            this.playedHexes.push(hex)

            if (this.currentPlayedTurns === 0) {
                this.currentPlayedTurns++
            } else {
                this.currentPlayedTurns = 0
                this.currentPlayer = this.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1
            }
            this.expandBoardAround(hex)
            console.log(this.detectWinCondition())
            return true
        } else {
            console.log("Could not play move, hex is either already played or game is over")
            return false
        }
    }

    click(cursorX, cursorY) {
        let clickedHex = this.getHexAtScreenCoordinates(cursorX, cursorY)
        if (!clickedHex) return

        this.playMove(clickedHex)
    }

    renderBoard(cursorX, cursorY, viewScale) {
        for (let hex of this.boardHexes) {
            hex.render(cursorX, cursorY, viewScale)
            if (settings.displayNeighborMoveHexes) hex.displayNeighborMoves()
            if (settings.displayHexCoordinates) hex.displayCoordinates()
        }
        if (this.gameover) for (let hex of this.winningRow) hex.renderWinningState()
    }
}

// these are helper functions for generating the relativeHexPositionsToAdd variable
function expandBoard(hexBoard) {
    let oldBoardHexes = hexBoard.boardHexes.slice()
    for (let hex of oldBoardHexes) {
        hexBoard.click(hex.screenX, hex.screenY)
    }
}

function logRelativeHexFormat(hexBoard) {
    let finalString = ""
    for (let hex of hexBoard.boardHexes) {
        finalString += `{ x: ${hex.boardX} , y: ${hex.boardY} },\n`
    }
    console.log(finalString)
}