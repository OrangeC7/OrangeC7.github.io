let numNearObstacles = 8

let player
let obstacles = []

let paused = false
let pauseFrame = 0

function setup() {
	createCanvas(window.innerWidth, window.innerHeight)
	window.addEventListener("resize", function(event) {
		resizeCanvas(window.innerWidth, window.innerHeight)
	})
	noSmooth()
	noStroke()

	// Why do I have these
	midVector = createVector(width / 2, height / 2)
	zeroVector = createVector(0, 0)
	dimVector = createVector(width, height)

	initSketch()
}

function initSketch() {
	// For player and controls settings go to options.js. Change to "AIPlayer" to initiate a random network to control the player
	player = new Player(width / 2, height / 2, 20, playerColour)

	// For obstacles settings go to options.js
	initObstacles()
}

function draw() {
	background(45)
	background(45)

	// Update everything
	// For every obstacle, update
	if (!paused) {
		controls() // Check player controls
		player.update(obstacles) // Update the player

		for (const obstacle of obstacles) {
			obstacle.update()
			if (player.overlaps(obstacle)) {
				initSketch()
			}
		}
	}

	// Draw everything
	// Show every obstacle
	for (const obstacle of obstacles) {
		obstacle.show()
	}

	player.show() // Show the player

	// Trace lines to the nearest obstacles and highlight them
	let nearest = nearestObstacles(numNearObstacles, player, false)
	for (let obstacle of nearest) {
		obstacle.show(warningColour, 1, true)
	}

	// If paused, show pause animation
	pauseAnim()
}

function controls() {

	if (keyIsDown(UP_ARROW) || keyIsDown(up)) {
		player.move(0, -playerSpeed)
	}
	if (keyIsDown(LEFT_ARROW) || keyIsDown(left)) {
		player.move(-playerSpeed, 0)
	}
	if (keyIsDown(DOWN_ARROW) || keyIsDown(down)) {
		player.move(0, playerSpeed)
	}
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(right)) {
		player.move(playerSpeed, 0)
	}

	// switch (key) {
	//   case 'w':
	//     player.move(0, -playerSpeed)
	//     // break
	//   case 'a':
	//     player.move(-playerSpeed, 0)
	//     // break
	//   case 's':
	//     player.move(0, playerSpeed)
	//     // break
	//   case 'd':
	//     player.move(playerSpeed, 0)
	//     // break
	// }
	// switch (keyCode) {
	//   case 38:
	//     player.move(0, -playerSpeed)
	//     break
	//   case 37:
	//     player.move(-playerSpeed, 0)
	//     break
	//   case 40:
	//     player.move(0, playerSpeed)
	//     break
	//   case 39:
	//     player.move(playerSpeed, 0)
	//     break
	// }
}

function keyPressed() {
	switch (key) {
	case ' ': // Pause
		paused = !paused
		pauseFrame = frameCount
		break
	}
}

// Allow touch functionality
let lastPressFrame;
function mouseDragged() {
  if (!paused) {
    let mpos = createVector(mouseX, mouseY)
    let dir = mpos.sub(player.pos).normalize() // Calculate normal vector in direction of mouse
    player.move(dir.x * playerSpeed, dir.y * playerSpeed)
    lastPressFrame = frameCount
  }
}