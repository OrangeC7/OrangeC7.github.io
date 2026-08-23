class AIPlayer {
    constructor() {

    }

    getMoves(hexBoard) {
        let neighborMoves = []
        let otherMoves = []
        for (let hex of hexBoard.boardHexes) {
            if (hex.playedState === UNPLAYED) {
                if (hex.isValidNeighborMove()) neighborMoves.push(hex)
                else otherMoves.push(hex)
            }
        }
        return { neighborMoves, otherMoves }
    }

    playMove(hexBoard) {
        if (hexBoard.gameover) return
        function selectRandomElementFrom(arr) {
            return arr[Math.floor(Math.random() * arr.length)]
        }
        let availableMoves = this.getMoves(hexBoard)
        if (!availableMoves) return
        let selectedHex = Math.random() < 0.1 ? selectRandomElementFrom(availableMoves.otherMoves) : selectRandomElementFrom(availableMoves.neighborMoves)
        if (availableMoves.otherMoves.length === 0) selectedHex = selectRandomElementFrom(availableMoves.neighborMoves)
        if (availableMoves.neighborMoves.length === 0) selectedHex = selectRandomElementFrom(availableMoves.otherMoves)
        hexBoard.playMove(selectedHex)
    }
}