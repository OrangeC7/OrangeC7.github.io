function setup() {
	createCanvas(400, 400)
}

function draw() {
	background(220)
    
	if (mouseIsPressed) {
		if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= width) {
			background(0)
		}
	}
}