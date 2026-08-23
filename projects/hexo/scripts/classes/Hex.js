class Hex {
    constructor(boardX, boardY, radius) {
        this.boardX = boardX
        this.boardY = boardY

        this.setRadius(radius)
        this.updateScreenPosition()

        this.vertices = []
        this.updateVertices()

        this.playedState = UNPLAYED
        this.isNeighboringPlayedHex = false
    }

    updateVertices() {
        this.vertices = [
            { x: this.screenX - this.radius, y: this.screenY }, // Leftmost vertex
            { x: this.screenX - this.radius / 2, y: this.screenY - Math.sqrt(this.radius * this.radius * 3 / 4) }, // Top left vertex
            { x: this.screenX + this.radius / 2, y: this.screenY - Math.sqrt(this.radius * this.radius * 3 / 4) }, // Top right vertex
            { x: this.screenX + this.radius, y: this.screenY }, // Rightmost vertex
            { x: this.screenX + this.radius / 2, y: this.screenY + Math.sqrt(this.radius * this.radius * 3 / 4) }, // Bottom right vertex
            { x: this.screenX - this.radius / 2, y: this.screenY + Math.sqrt(this.radius * this.radius * 3 / 4) }  // Bottom left vertex
        ]
    }

    updateScreenPosition() {
        this.screenX = this.boardX * this.radius * 3 / 2
        this.screenY = (this.boardY + this.boardX / 2) * this.height
        this.updateVertices()
    }

    // for reference: r is also equivalent to side length
    setRadius(r) {
        this.radius = r
        this.height = 2 * Math.sqrt(r * r * 3 / 4)
        this.updateScreenPosition()
    }

    setPosition(x, y) {
        this.boardX = x
        this.boardY = y
        this.updateScreenPosition()
    }

    isPointIntersecting(x, y) {
        function lineY(x, x1, y1, x2, y2) {
            let m = (y2 - y1) / (x2 - x1)
            let b = y1 - (m * x1)
            return m * x + b
        }
        return !(
            x < this.vertices[0].x || x > this.vertices[3].x || y < this.vertices[1].y || y > this.vertices[4].y ||
            y < lineY(x, this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y) ||
            y > lineY(x, this.vertices[0].x, this.vertices[0].y, this.vertices[5].x, this.vertices[5].y) ||
            y < lineY(x, this.vertices[3].x, this.vertices[3].y, this.vertices[2].x, this.vertices[2].y) ||
            y > lineY(x, this.vertices[3].x, this.vertices[3].y, this.vertices[4].x, this.vertices[4].y)
        )
    }

    isValidNeighborMove() {
        return this.isNeighboringPlayedHex && this.playedState === UNPLAYED
    }

    getBoardCoordinates() {
        return { x: this.boardX, y: this.boardY }
    }

    setPlayedState(playedState) {
        this.playedState = playedState
    }

    drawHexagon(sizeFactor = 1) {
        hexagon(this.screenX, this.screenY, this.radius * settings.relativeHexSize * sizeFactor)
    }

    setHighlightStroke(strokeColor) {
        stroke(strokeColor)
        let highlightWeight = settings.highlightThickness / viewScale
        let maxHighlightWeight = -175 * (settings.relativeHexSize - 1)
        strokeWeight(highlightWeight < maxHighlightWeight ? highlightWeight : maxHighlightWeight)
    }

    render(cursorX, cursorY, viewScale) {
        push()
        let player1color = "#ff6700" // setting
        let player2color = "#00ffff" // setting
        let blankcolor = "#5a5a5a" // setting
        let hexColor = this.playedState === PLAYER1 ? player1color : this.playedState === PLAYER2 ? player2color : blankcolor
        if (cursorX && cursorY && this.isPointIntersecting(cursorX, cursorY)) this.setHighlightStroke("#ffffff") // setting
        else noStroke()
        fill(hexColor)
        this.drawHexagon()
        pop()
    }

    renderWinningState() {
        const winColor = "#ffec98" // setting
        push()
        noFill()
        this.setHighlightStroke(winColor)
        this.drawHexagon()
        fill(winColor)
        noStroke()
        this.drawHexagon(0.4)
        pop()
    }

    displayCoordinates() {
        push()
        textAlign(CENTER, CENTER)
        text(`${this.boardX}, ${this.boardY}`, this.screenX, this.screenY)
        pop()
    }

    displayNeighborMoves() {
        push()
        fill(this.isValidNeighborMove() ? "#00ff00" : "#ff0000")
        noStroke()
        this.drawHexagon(0.4)
        pop()
    }
}

// function hexagon(x, y, r, rotation = 0) {
//     push()
//     translate(x, y)
//     rotate(rotation)

//     let leftCornerX = -(r / 2)
//     let rightCornerX = (r / 2)
//     let topY = -Math.sqrt(r * r * 3 / 4)
//     let bottomY = Math.sqrt(r * r * 3 / 4)

//     beginShape()
//     vertex(-r, 0)
//     vertex(leftCornerX, topY)
//     vertex(rightCornerX, topY)
//     vertex(r, 0)
//     vertex(rightCornerX, bottomY)
//     vertex(leftCornerX, bottomY)
//     endShape(CLOSE)

//     pop()
// }

// i am a bad person
function hexagon(x, y, r, rot = 0) {
    push(); translate(x, y); rotate(rot); let lx = -(r / 2); let rx = (r / 2); let ty = -Math.sqrt(r * r * 3 / 4); let by = Math.sqrt(r * r * 3 / 4)
    let v = vertex; beginShape(); v(-r, 0); v(lx, ty); v(rx, ty); v(r, 0); v(rx, by); v(lx, by); endShape(CLOSE); pop()
}