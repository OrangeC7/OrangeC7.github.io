function sketch(p) {
	let p.setup = function() {
		createCanvas(400, 400)
	}

	let p.draw = function() {
		background(220)
		
		bgOnMouse(color(0, 0, 0))
	}

	let p.bgOnMouse = function(color) {
	// Set the background to black when the mouse is pressed in the canvas
		if (mouseIsPressed) {
			if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= width) {
				background(color)
			}
		}
	}
}

new p5(sketch, 'test-script')