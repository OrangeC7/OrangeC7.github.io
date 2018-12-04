function setup() {
	createCanvas(400, 400)
}

function draw() {
	background(220)
    
	bgOnMouse(color(0, 0, 0))
}

function bgOnMouse(color) {
// Set the background to black when the mouse is pressed in the canvas
	if (mouseIsPressed) {
		if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= width) {
			background(color)
		}
	}
}