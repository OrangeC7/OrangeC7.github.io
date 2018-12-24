let winningRows = [
	// x o o; o x o; o o x
	[[1,1], [2,2], [3,3]],
	// x x x; o o o; o o o
	[[1,1], [1,2], [1,3]],
	// x o o; x o o; x o o
	[[1,1], [2,1], [3,1]],
	// o x o; o x o; o x o
	[[1,2], [2,2], [3,2]],
	// o o o; x x x; o o o
	[[2,1], [2,2], [2,3]],
	// o o x; o x o; x o o
	[[1,3], [2,2], [3,1]],
	// o o o; o o o; x x x
	[[3,1], [3,2], [3,3]],
	// o o x; o o x; o o x
	[[1,3], [2,3], [3,3]],
]

class board {
	
	constructor(nestedBoards = true) {
		if (nestedBoards) {
			// 3x3 array
			this.spaces = []
			for(var i = 0; i < 3; i++) {
				matrix[i] = new Array(3)
			}
		} else {
			// Use given 3x3(?) array
			this.spaces = nestedBoards
		}
	}
	
	checkForRows() {
		
	}
	
}