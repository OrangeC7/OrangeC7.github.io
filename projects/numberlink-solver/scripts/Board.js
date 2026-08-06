class Link {
  constructor(a, b, parent) {
    this.endpoints = [a, b]
    this.path = []
    this.pathStart = a
    this.isComplete = false

    this.parent = parent
  }

  chop(index) {
    for (let i = 0; i < this.path.length; i++) {
      if (index === this.path[i]) {
        this.path.splice(i + 1)
        return
      }
    }
  }

  clear() {
    this.path = []
    this.isComplete = false
  }

  isIndexEndpoint(index) {
    for (let endpoint of this.endpoints) {
      if (index === endpoint) return true
    }
    return false
  }

  drawPath(index) {
    if (!this.isIndexEndpoint(index)) this.path.push(index)
  }

  isIndexPath(index) {
    for (let pathSquare of this.path) {
      if (index === pathSquare) return true
    }
    return false
  }

  isIndexAtOppositeEndpoint(index, endpointA) {
    if (!this.isIndexEndpoint(index)) return false
    if (index === endpointA) return false
    return true
  }

  // relativeIndex is 0 for the endpoint at the beginning of the "path" array, and 1 for the endpoint at the end of the "path" array
  getEndpoint(relativeIndex = 0) {
    return relativeIndex === 0 ? this.pathStart : this.endpoints[0] === this.pathStart ? this.endpoints[1] : this.endpoints[0]
  }
}

class Board {
  constructor(gridWidth, gridHeight, canvasX, canvasY, widthOnCanvas) {
    this.links = []
    this.gridWidth = gridWidth
    this.gridHeight = gridHeight
    this.canvasX = canvasX
    this.canvasY = canvasY
    this.widthOnCanvas = widthOnCanvas
    this.gridSpacing = this.widthOnCanvas / gridWidth
    this.heightOnCanvas = this.gridHeight * this.gridSpacing

    // This is for display purposes
    this.sizeFactor = mapRange(this.widthOnCanvas, 200, 425, 3, 5) / 5

    this.dragging = {
      lastIndex: null,
      startIndex: null,
      started: false,
      linkID: null,
      link: new Link(),
      isEndpoint: null,
      isLink: null,
    }
  }

  changeVisualWidth(newWidthOnCanvas) {
    this.widthOnCanvas = newWidthOnCanvas
    this.gridSpacing = this.widthOnCanvas / this.gridWidth
    this.heightOnCanvas = this.gridHeight * this.gridSpacing

    this.sizeFactor = mapRange(this.widthOnCanvas, 200, 425, 3, 5) / 5
  }

  getGridIndex(x, y) {
    return x + y * this.gridWidth
  }

  areTouching(i, j) {
    let a = min(i, j)
    let b = max(i, j)
    if (b - a === 1 && b % this.gridWidth !== 0) return true
    if (b - a === this.gridWidth && b >= this.gridWidth) return true
    return false
  }

  static areTouching(i, j, board) {
    let a = min(i, j)
    let b = max(i, j)
    if (b - a === 1 && b % board.gridWidth !== 0) return true
    if (b - a === board.gridWidth && b >= board.gridWidth) return true
    return false
  }

  coordsAtIndex(gridIndex) {
    let y = floor(gridIndex / this.gridWidth)
    let x = gridIndex - y * this.gridWidth
    return { x, y }
  }

  static coordsAtIndex(gridIndex, board) {
    let y = floor(gridIndex / board.gridWidth)
    let x = gridIndex - y * board.gridWidth
    return { x, y }
  }

  getGridIndexFromScreen(canvasX, canvasY) {
    return this.getGridIndex(floor((canvasX - this.canvasX) / this.gridSpacing), floor((canvasY - this.canvasY) / this.gridSpacing))
  }

  addLink(indexStart, indexEnd) {
    this.links.push(new Link(indexStart, indexEnd, this))
  }

  addLinkByCoords(x1, y1, x2, y2) {
    this.addLink(this.getGridIndex(x1, y1), this.getGridIndex(x2, y2))
  }

  clearLinks() {
    for (let link of this.links) {
      link.clear()
    }
  }

  getNeighbors(index) {
    let neighborIndices = []
    if (index % this.gridWidth !== 0) neighborIndices.push(index - 1)
    if (index % this.gridWidth !== this.gridWidth - 1) neighborIndices.push(index + 1)
    if (index >= this.gridWidth) neighborIndices.push(index - this.gridWidth)
    if (index < this.gridWidth * (this.gridHeight - 1)) neighborIndices.push(index + this.gridWidth)
    return neighborIndices
  }

  static getNeighbors(index, board) {
    let neighborIndices = []
    if (index % board.gridWidth !== 0) neighborIndices.push(index - 1)
    if (index % board.gridWidth !== board.gridWidth - 1) neighborIndices.push(index + 1)
    if (index >= board.gridWidth) neighborIndices.push(index - board.gridWidth)
    if (index < board.gridWidth * (board.gridHeight - 1)) neighborIndices.push(index + board.gridWidth)
    return neighborIndices
  }

  wanderTest(minPathLength = 3) {
    function populateIndices(arrayLength) {
      let arr = []
      for (let i = 0; i < arrayLength; i++) {
        arr.push(i)
      }
      return arr
    }

    function returnValidNeighbors(index, neighbors, lastDirection, lastLastDirection, path, board) {
      function neighborTouchesPath(neighbor) {
        for (let i = 0; i < path.length - 1; i++) {
          if (board.areTouching(path[i], neighbor)) {
            return true
          }
        }
        return false
      }

      function neighborIsValid(neighbor, lastLastDirection, board) {
        let neighborCoords = board.coordsAtIndex(neighbor)
        let neighborDirection = vecDiff(neighborCoords, board.coordsAtIndex(index))
        if (neighborDirection.x + lastLastDirection.x === 0 && neighborDirection.y + lastLastDirection.y === 0) return false
        if (neighborTouchesPath(neighbor)) return false
        return true
      }

      let availableNeighbors = []
      for (let neighbor of neighbors) {
        // /**
        // Check if any of a neighbor's neighbors are invalid, and if so if that neighbor is also
        // completely surrounded (other than a single entry point for the current path)
        // if so the current neighbor is also not valid, as this would cause a gap of one space
        // **/
        // // (WIP)
        // // check neighbor to see if it is closed in
        // let neighborNeighbors = arrayAND(availableIndices, board.getNeighbors(neighbor))
        // if (neighborNeighbors.length === 1 && !neighborIsValid(neighborNeighbors[0], lastDirection, board)) continue
        if (!neighborIsValid(neighbor, lastLastDirection, board)) continue
        availableNeighbors.push(neighbor)
      }
      return availableNeighbors
    }

    function tracePath(indices, board) {
      let availableIndices = [...indices]
      let lastIndex = spliceRandomIndex(availableIndices)
      let path = []
      let lastLastDirection = { x: 0, y: 0 }
      let lastDirection = { x: 0, y: 0 }
      let availableNeighbors = availableIndices
      let reversed = false

      while (availableNeighbors.length > 0) {
        path.push(lastIndex)

        availableNeighbors = returnValidNeighbors(lastIndex, arrayAND(availableIndices, board.getNeighbors(lastIndex)), lastDirection, lastLastDirection, path, board)

        if (availableNeighbors.length <= 0) {
          if (reversed) break
          else {
            lastIndex = path[0]
            lastDirection = path.length > 1 ? vecDiff(
              board.coordsAtIndex(path[0]),
              board.coordsAtIndex(path[1])
            ) : { x: 0, y: 0 }
            lastLastDirection = path.length > 2 ? vecDiff(
              board.coordsAtIndex(path[1]),
              board.coordsAtIndex(path[2])
            ) : { x: 0, y: 0 }
            path.reverse()
            reversed = true
            availableNeighbors.push(null) // this is so the loop goes at least one more time
            path.splice(-1) // this is to prevent double-pushing the same index
            continue
          }
        }

        let selectedNeighbor = sliceRandomIndex(availableNeighbors)

        lastIndex = availableIndices.splice(availableIndices.indexOf(selectedNeighbor), 1)[0]
        lastLastDirection = lastDirection
        lastDirection = vecDiff(board.coordsAtIndex(selectedNeighbor), board.coordsAtIndex(lastIndex))
      }


      if (path.length < minPathLength) return false

      return { path, availableIndices }
    }

    // Attempts to check if a board's solution is unique by testing every
    // combination of removing two links and rerouting them
    function checkUnique(board) {
      let testLinks = []
      for (let link of board.links) {
        testLinks.push(new Link(link.endpoints[0], link.endpoints[1], board))
      }
      for (let i = 0; i < testLinks.length; i++) {
        let removedLinkA = testLinks.splice(i)
        let availableIndices = [...removedLinkA.endpoints, ...removedLinkA.path]
        for (let j = 0; j < testLinks.length; j++) {
          if (j === i) continue
          let removedLinkB = testLinks.splice(j)
          availableIndices = [...availableIndices, ...removedLinkB.endpoints, ...removedLinkB.path]
          // I have no idea what to put here
          // I'm thinking that right here we perform a tracePath again for each link
          // If the path is identical to before, try again
          // If it's not identical and it returns false, assume unique
          // If it's not identical and it creates a new valid solution, solution is not unique
          // This is a really dumb idea that probably isn't very efficient at all lol
          testLinks.splice(j, 0, removedLinkB)
        }
        testLinks.splice(i, 0, removedLinkA)
      }
    }

    this.links = []

    let availableIndices = populateIndices(this.gridWidth * this.gridHeight)

    while (availableIndices.length > 0) {
      let result = tracePath(availableIndices, this)
      if (!result) return false

      let path = result.path
      availableIndices = result.availableIndices
      if (path.length < minPathLength) return false

      let linkID = this.links.push(new Link(path[0], path[path.length - 1], this)) - 1
      for (let i = 0; i < path.length - 1; i++) this.links[linkID].drawPath(path[i])
      this.links[linkID].isComplete = true
    }

    return true
  }

  // Currently, this mostly provides puzzles with unique solutions but not always.
  // (WIP)
  keepWandering(logOutput = true) {
    let numWanders = 1
    let startTime = millis()
    while (!this.wanderTest()) numWanders++
    let totalTime = millis() - startTime
    if (logOutput) console.log(`Attempted ${numWanders} wanders in ${totalTime}ms`);
    return { numWanders, totalTime }
  }

  pruneUnfinishedLinks() {
    for (let link of this.links) {
      if (!link.isComplete) link.clear()
    }
  }

  allLinksComplete() {
    for (let link of this.links) {
      if (!link.isComplete) return false
    }
    return true
  }

  // allSpacesFilledOld() {
  //   let isIndexFilleds = []
  //   spacesLoop: for (let i = 0; i < this.gridWidth * this.gridHeight; i++) {
  //     isIndexFilleds[i] = false
  //     for (let link of this.links) {
  //       if (link.isIndexEndpoint(i) || link.isIndexPath(i)) {
  //         isIndexFilleds[i] = true
  //         continue spacesLoop
  //       }
  //     }
  //   }
  //   for (let indexFilled of isIndexFilleds) if (!indexFilled) return false
  //   return true
  // }

  // Thank you to @mcardellje on Discord for this code suggestion, they are a much better JavaScripter than I
  allSpacesFilled() {
    for (let i = 0; i < this.gridWidth * this.gridHeight; i++) {
      if (this.links.every(link => !link.isIndexEndpoint(i) && !link.isIndexPath(i))) {
        return false
      }
    }
    return true
  }

  solve() {
    let endpoints = []
    for (let link of this.links) {
      endpoints.push(link.endpoints)
    }
    console.log(endpoints)
  }

  getLinkInfo(index) {
    let isEndpoint = false
    let isPath = false
    let linkID = false
    let isLink = false
    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i].isIndexEndpoint(index)) {
        isEndpoint = true
        isLink = true
        linkID = i
        break
      }
      if (this.links[i].isIndexPath(index)) {
        isPath = true
        isLink = true
        linkID = i
        break
      }
    }
    return {
      isEndpoint, isPath, isLink, linkID
    }
  }

  getLinkIDAt(gridIndex) {
    return this.getLinkInfo(gridIndex).linkID
  }

  startDrawing(gridIndex) {
    this.dragging.linkID = this.getLinkIDAt(gridIndex)
    this.dragging.link = this.links[this.dragging.linkID]
    this.dragging.link.clear()
    this.dragging.started = true
    this.dragging.startIndex = gridIndex
    this.dragging.link.pathStart = gridIndex
    this.dragging.lastIndex = gridIndex

    this.dragging.started = this.dragging.started
    this.dragging.startIndex = this.dragging.startIndex
  }

  stopDrawing() {
    this.dragging.linkID = null
    this.dragging.link = new Link()
    this.dragging.startIndex = null
    this.dragging.lastIndex = -1
  }

  stopDragging() {
    this.stopDrawing()
    this.dragging.started = false
  }

  // takes into account framerate limitations and splits drag moves into chunks this.gridSpacing long
  // A better version of this would just attempt to pathfind to the next location
  /**
  p.s. there is a weird behaviour here where if there is a link with an endpoint at the top left (0,0)
  then when clicking on any empty square where the x or y coordinate is 0 will cause the program to
  interpolate a drag from the top left square to the square that was clicked. This is unintentional but
  also I'm too tired to fix it right now and it's not causing any problems yet so it's staying in
  (WIP)
  **/
  smoothUpdate(selectedIndex) {
    if (!this.dragging.started) this.update(selectedIndex)
    if (selectedIndex === this.dragging.lastIndex) return

    let pCursorPos = this.coordsAtIndex(this.dragging.lastIndex)
    let cursorPos = this.coordsAtIndex(selectedIndex)

    for (let i = 0; i <= vecPythagoras(pCursorPos, cursorPos); i++) {
      let { x, y } = vecLerp(pCursorPos, cursorPos, i / vecPythagoras(pCursorPos, cursorPos))
      this.update(this.getGridIndex(x, y))
    }
  }

  update(selectedIndex) {
    // this isn't technically needed if running from smoothUpdate()
    if (selectedIndex === this.dragging.lastIndex) return

    let currentSquare = this.getLinkInfo(selectedIndex)
    this.dragging.isEndpoint = currentSquare.isEndpoint
    this.dragging.isPath = currentSquare.isPath
    this.dragging.isLink = currentSquare.isLink

    if (!this.dragging.started) {
      if (!currentSquare.isEndpoint) return

      this.startDrawing(selectedIndex)
    }

    if (this.dragging.lastIndex === null) return

    if (currentSquare.isPath) {
      if (this.getLinkIDAt(selectedIndex) !== this.getLinkIDAt(this.dragging.startIndex)) return

      this.dragging.link.chop(selectedIndex)
    } else if (currentSquare.isEndpoint) {
      if (this.dragging.link.isIndexAtOppositeEndpoint(selectedIndex, this.dragging.startIndex)) {
        if (!Board.areTouching(selectedIndex, this.dragging.lastIndex, this)) return

        this.dragging.link.isComplete = true
        this.stopDrawing()
        return
      }
      if (this.getLinkIDAt(selectedIndex) !== this.dragging.linkID) return

      this.dragging.link.clear()
    } else if (!Board.areTouching(selectedIndex, this.dragging.lastIndex, this)) return

    this.dragging.link.drawPath(selectedIndex)
    this.dragging.lastIndex = selectedIndex
  }

  outputInitializer() {
    console.log("The current board's initialization code is as follows:")
    console.log(`let board = new Board(${this.gridWidth}, ${this.gridHeight}, ${this.canvasX}, ${this.canvasY}, ${this.widthOnCanvas})`)
    for (let link of this.links) {
      console.log(`board.addLink(${link.endpoints[0]}, ${link.endpoints[1]})`)
    }
  }

  showGrid() {
    push()
    stroke(0, 0, 0, 127)
    //lon
    for (let i = 1; i < this.gridWidth; i++) line(this.gridSpacing * i, 0, this.gridSpacing * i, this.heightOnCanvas)
    //lat
    for (let i = 1; i < this.gridHeight; i++) line(0, this.gridSpacing * i, this.widthOnCanvas, this.gridSpacing * i)
    pop()
  }

  highlightSquare(gridIndex) {
    let { x, y } = this.coordsAtIndex(gridIndex)
    push()
    noStroke()
    fill(220)
    rect(x * this.gridSpacing, y * this.gridSpacing, this.gridSpacing, this.gridSpacing)
    pop()
  }

  highlightDrag() {
    if (!this.dragging.started) return

    for (let index of this.dragging.link.endpoints) {
      let { x, y } = this.coordsAtIndex(index)
      push()
      noStroke()
      fill(0, 255, 255)
      rect(x * this.gridSpacing, y * this.gridSpacing, this.gridSpacing, this.gridSpacing)
      pop()
    }

    // if (!this.dragging.lastIndex) return
    // let {x, y} = this.coordsAtIndex(this.dragging.lastIndex)
    // push()
    // noStroke()
    // fill(0, 255, 0)
    // rect(x * this.gridSpacing, y * this.gridSpacing, this.gridSpacing, this.gridSpacing)
    // pop()
  }

  showLinks(highlightCompletedLinks = false) {
    let sizeFactor = this.sizeFactor

    let scaledLine = function (p1, p2, gridSpacing) {
      line(
        (p1.x * gridSpacing) + gridSpacing / 2,
        (p1.y * gridSpacing) + gridSpacing / 2,
        (p2.x * gridSpacing) + gridSpacing / 2,
        (p2.y * gridSpacing) + gridSpacing / 2
      )
    }

    for (let i = 0; i < this.links.length; i++) {
      let currentLink = this.links[i]
      for (let gridIndex of currentLink.endpoints) {
        let { x, y } = this.coordsAtIndex(gridIndex)
        push()
        textAlign(CENTER, CENTER)
        if (highlightCompletedLinks && currentLink.isComplete) {
          strokeWeight(sizeFactor * 4)
          stroke(0)
          fill(0, 255, 255)
        }
        textSize(settings.txtSize * sizeFactor)
        text(
          i + 1,
          (x * this.gridSpacing) + this.gridSpacing / 2,
          (y * this.gridSpacing) + this.gridSpacing / 2
        )
        pop()
      }
      push()
      strokeWeight(settings.linkRadius * sizeFactor)
      stroke("#0000cc")
      if (currentLink.path.length !== 0) {
        let p1 = this.coordsAtIndex(currentLink.path[0])
        let p2 = this.coordsAtIndex(currentLink.getEndpoint(0))
        p2 = vecAdd(vecMultScalar(vecDiff(p2, p1), 0.6), p1)

        scaledLine(p1, p2, this.gridSpacing)

        if (currentLink.isComplete) {
          p1 = this.coordsAtIndex(currentLink.path[currentLink.path.length - 1])
          p2 = this.coordsAtIndex(currentLink.getEndpoint(1))
          p2 = vecAdd(vecMultScalar(vecDiff(p2, p1), 0.6), p1)
          scaledLine(p1, p2, this.gridSpacing)
        }

        for (let j = 1; j < currentLink.path.length; j++) {
          let p1 = this.coordsAtIndex(currentLink.path[j])
          let p2 = this.coordsAtIndex(currentLink.path[j - 1])
          scaledLine(p1, p2, this.gridSpacing)
        }
      } else if (currentLink.isComplete) {
        /**
        This is when the link is complete, but the endpoints are right next to each other
        If this happens, it's indicative of a poorly designed puzzle, I think
        (Maybe that could be an interesting puzzle design if neighboring endpoints are not allowed to connect?)
        However, I'm handling this edge case anyways because it can cause confusion if I don't
        **/
        let p1 = this.coordsAtIndex(currentLink.endpoints[0])
        let p2 = this.coordsAtIndex(currentLink.endpoints[1])
        let newp1 = vecAdd(vecMultScalar(vecDiff(p1, p2), 0.6), p2)
        p2 = vecAdd(vecMultScalar(vecDiff(p2, p1), 0.6), p1)
        p1 = newp1
        scaledLine(p1, p2, this.gridSpacing)
      }
      pop()
    }
  }

  showWinScreen() {
    push()

    // 200 = 3
    // 425 = 5
    let sizeFactor = this.sizeFactor

    textSize(50 * sizeFactor)
    textAlign(CENTER, CENTER)
    fill(0, 240, 50)
    stroke(0, 100, 0)
    strokeWeight(5 * sizeFactor)
    text("Puzzle\nSolved!", this.widthOnCanvas / 2, this.heightOnCanvas / 2)

    pop()
  }

  isPixelOnBoard(x, y) {
    return x > this.canvasX && y > this.canvasY && x < this.canvasX + this.widthOnCanvas && y < this.canvasY + this.heightOnCanvas
  }

  showBoard(cursorX, cursorY, showWinScreen, { highlightDrag = false, highlightCompletedLinks = false }) {
    let highlightIndex = this.isPixelOnBoard(cursorX, cursorY) ? this.getGridIndexFromScreen(cursorX, cursorY) : false
    push()
    translate(this.canvasX, this.canvasY)

    push()
    noStroke()
    fill(255)
    rect(0, 0, this.widthOnCanvas, this.heightOnCanvas)
    pop()

    if (highlightIndex) this.highlightSquare(highlightIndex)
    if (highlightDrag) this.highlightDrag()
    this.showGrid()
    this.showLinks(highlightCompletedLinks)

    if (showWinScreen) this.showWinScreen()

    pop()
  }
}

class WikipediaExample extends Board {
  constructor(canvasX, canvasY, widthOnCanvas) {
    super(7, 7, canvasX, canvasY, widthOnCanvas)

    this.addLink(this.getGridIndex(4, 2), this.getGridIndex(2, 5))
    this.addLink(this.getGridIndex(4, 1), this.getGridIndex(0, 6))
    this.addLink(this.getGridIndex(1, 1), this.getGridIndex(3, 2))
    this.addLink(this.getGridIndex(3, 0), this.getGridIndex(4, 6))
    this.addLink(this.getGridIndex(5, 1), this.getGridIndex(3, 3))
  }
}

class FlowExample extends Board {
  constructor(canvasX, canvasY, widthOnCanvas) {
    super(9, 9, canvasX, canvasY, widthOnCanvas)

    this.addLink(this.getGridIndex(0, 0), this.getGridIndex(2, 2))
    this.addLink(this.getGridIndex(5, 0), this.getGridIndex(1, 1))
    this.addLink(this.getGridIndex(6, 0), this.getGridIndex(8, 6))
    this.addLink(this.getGridIndex(2, 1), this.getGridIndex(4, 2))
    this.addLink(this.getGridIndex(3, 2), this.getGridIndex(0, 5))
    this.addLink(this.getGridIndex(6, 2), this.getGridIndex(2, 6))
    this.addLink(this.getGridIndex(1, 4), this.getGridIndex(4, 7))
    this.addLink(this.getGridIndex(1, 5), this.getGridIndex(8, 7))
    this.addLink(this.getGridIndex(6, 5), this.getGridIndex(1, 7))
  }
}
