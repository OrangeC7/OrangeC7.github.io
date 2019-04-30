let numNearObstacles = 8

let player
let obstacles = []

let paused = false
let pauseFrame = 0

let lastPressFrame = 0

let scaleUp = false
let scaleSize = 1

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
  
  frameRate(60) // Forcing sketch to run at 60 fps, if possible
}

function initSketch() {
	// For player and controls settings go to options.js. Change to "AIPlayer" to initiate a random network to control the player
	player = new Player(width / 2, height / 2, 20, playerColour)

	// For obstacles settings go to options.js
	initObstacles()
}

function draw() {
  scale(scaleSize)
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

	pauseAnim() // If paused, show pause animation
  scaleButton() // Show scale button
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
  
  // Allow touch functionality
  if (mouseIsPressed) {
    let mpos
    if (scaleUp) mpos = createVector(mouseX/2, mouseY/2) 
    else mpos = createVector(mouseX, mouseY)
    let dir = mpos.sub(player.pos).normalize() // Calculate normal vector in direction of mouse
    player.move(dir.x * playerSpeed, dir.y * playerSpeed)
    lastPressFrame = frameCount
  }
}

// Pause the sketch if key is pressed
// Not part of controls because keyPressed activates once per press,
//  controls checks every frame
function keyPressed() {
	switch (key) {
	case ' ': // Pause
		paused = !paused
		pauseFrame = frameCount
		break
	}
}

// Button on bottom right to change scale of Movables for higher pixel density screens
function mousePressed() {
  if (mouseIsPressed &&
      mouseX > width * (scaleButtonSize-1)/scaleButtonSize &&
      mouseY > height * (scaleButtonSize-1)/scaleButtonSize)
  {
    scaleUp = !scaleUp
    if (scaleUp) {
      scaleSize = 2
      
      // It turns out these were useful after all :P
      midVector = createVector(width / 4, height / 4)
      zeroVector = createVector(0, 0)
      dimVector = createVector(width / 2, height / 2)
      
      initSketch()
    } else {
      scaleSize = 1
      
      // It turns out these were useful after all :P
      midVector = createVector(width / 2, height / 2)
      zeroVector = createVector(0, 0)
      dimVector = createVector(width, height)
      
      initSketch()
    }
    
  }
}