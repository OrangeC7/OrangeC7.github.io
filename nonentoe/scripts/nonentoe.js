let nac

function setup() {
	createCanvas(
		window.innerWidth,
		window.innerHeight
	)
	
	nac = new Board(
		[
			[ " ", " ", "x" ],
			[ " ", " ", " " ],
			[ "o", "x", " " ]
		]
	)
}

function draw() {
	background(220)
	
	nac.show()
}

function checkWinner() {
	nac = nac.winner()
	if (typeof nac == "string") { // If nac is a string, there's a winner!
		console.log("Winner!")
		console.log(nac)
	} else if (typeof nac == "object" && nac != null) { // If nac is still an object
		if (nac.isFull()) { // If the board is full, but there's no winner, there's a draw
			console.log("Draw!")
		} else { // If the board is not full, but there's no winner, keep playing!
			console.log("Play ball!")
		}
	} else { // If nac isn't an object and isn't x or o, something's gone wrong...
		console.log("Something went wrong...")
	}
}