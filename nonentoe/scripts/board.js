let winningRows = [
	// x o o; o x o; o o x
	[ [0, 0], [1, 1], [2, 2] ],
	// x x x; o o o; o o o
	[ [0, 0], [0, 1], [0, 2] ],
	// x o o; x o o; x o o
	[ [0, 0], [1, 0], [2, 0] ],
	// o x o; o x o; o x o
	[ [0, 1], [1, 1], [2, 1] ],
	// o o o; x x x; o o o
	[ [1, 0], [1, 1], [1, 2] ],
	// o o x; o x o; x o o
	[ [0, 2], [1, 1], [2, 0] ],
	// o o o; o o o; x x x
	[ [2, 0], [2, 1], [2, 2] ],
	// o o x; o o x; o o x
	[ [0, 2], [1, 2], [2, 2] ],
]

class Board {
	
	constructor(nestedBoards) {
		if (nestedBoards == null) {
			// 3x3 array
			this.spaces = []
			for(var i = 0; i < 3; i++) {
				this.spaces[i] = new Array(3)
			}
		} else {
			// Use given(?) 3x3 array
			this.spaces = nestedBoards
		}
	}
	
	// If a game is a draw, the board reduces to a wild board
	// Should the wild board reduce to x or o randomly? Should it be used for either x or o?
	
	winner() {
		for (let row of winningRows) {
			// console.log("Checking all winning row types...")
			// console.log(this.spaces)
			// console.log(row)
			if ( // If this pattern is present for any player
				this.spaces[ row[0][0] ][ row[0][1] ] != config.empty && // 1 != an empty space
				this.spaces[ row[1][0] ][ row[1][1] ] != config.empty && // 2 != an empty space
				this.spaces[ row[2][0] ][ row[2][1] ] != config.empty && // 3 != an empty space
				typeof this.spaces[ row[0][0] ][ row[0][1] ] != "object" && // 1 != an object
				typeof this.spaces[ row[1][0] ][ row[1][1] ] != "object" && // 2 != an object
				typeof this.spaces[ row[2][0] ][ row[2][1] ] != "object" && // 3 != an object
				this.spaces[ row[0][0] ][ row[0][1] ] == // 1 == 2
				this.spaces[ row[1][0] ][ row[1][1] ] &&
				this.spaces[ row[1][0] ][ row[1][1] ] == // 2 == 3
				this.spaces[ row[2][0] ][ row[2][1] ]
			) { // Return the winning player
				return this.spaces[ row[1][0] ][ row[1][1] ]
			}
			// console.log("Not this type...")
		}
		return this
	}
	
	isFull() {
		// Check every space
		for (let row of this.spaces) { for (let space of row) {
			if (space == config.empty) {
				return false
			}
		}}
		return true
	}
	
	play(player, spot, y) {
		let x
		if (Array.isArray(spot)) {
			x = spot[0]
			y = spot[1]
		} else {
			x = spot
		}
		
		if (typeof player == "string") {
			if (this.spaces[x][y] == config.empty) {
				this.spaces[x][y] = player
				return true
			} else {
				console.log("Cannot play to an occupied space")
				return false
			}
		} else {
			console.log("Player must be a string value")
			return false
		}
	}
	
	log() {
		console.log(this.spaces)
	}
	
	show(x1, y1, x2, y2) {
		// Variables
		let w = x2 - x1
		let h = y2 - y1
		
		let c1 = (w/3)/2
		let c2 = ((w/3)+(2*w/3))/2
		let c3 = ((2*w/3)+w)/2
		
		let r1 = (h/3)/2
		let r2 = ((h/3)+(2*h/3))/2
		let r3 = ((2*h/3)+h)/2
		
		// Draw the board on the screen
		
		textSize(20)
		
		text(c1, r1, this.spaces[0][0])
		text(c2, r1, this.spaces[0][1])
		text(c3, r1, this.spaces[0][2])
		
		text(c1, r2, this.spaces[1][0])
		text(c2, r2, this.spaces[1][1])
		text(c3, r2, this.spaces[1][2])
		
		text(c1, r3, this.spaces[2][0])
		text(c2, r3, this.spaces[2][1])
		text(c3, r3, this.spaces[2][2])
	}
	
}