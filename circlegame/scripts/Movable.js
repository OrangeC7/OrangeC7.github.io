let midVector, zeroVector, dimVector

// Class that all movable objects extend
class Movable {
  
  constructor(x, y, r, xvel, yvel) {
    if (yvel !== null && xvel !== null) this.vel = createVector(xvel, yvel)
    else this.vel = createVector()

    this.pos = createVector(x, y)
    this.acc = createVector()
    this.r = r

    this.colour = color(220)
  }
  
  // Check if this movable overlaps another movable
  overlaps(movable) {
    return this.distance(movable) < this.r + movable.r
  }
  
  // Get toroidal distance to another movable (close to opposite edge could still be close)
  // https://stackoverflow.com/a/3041398
  distance(movable) {
    if (movable instanceof Movable) {
      let dx = abs(this.pos.x - movable.pos.x)
      if (dx > width / 2) dx = width - dx

      let dy = abs(this.pos.y - movable.pos.y)
      if (dy > height / 2) dy = height - dy

      return sqrt(sq(dx) + sq(dy))
    } else {
      let dx = abs(this.pos.x - movable.x)
      if (dx > width / 2) dx = width - dx

      let dy = abs(this.pos.y - movable.y)
      if (dy > height / 2) dy = height - dy

      return sqrt(sq(dx) + sq(dy))
    }
  }
  
  // Copy this movable
  copy() {
    return new Movable(this.pos.x, this.pos.y, this.r, this.vel.x, this.vel.y)
  }
  
  // Update movable with all acceleration and velocity calculations
  update(deltaTime) {
	if (deltaTime == null) deltaTime = false
    const r = this.r

    this.pos = loopPos(this.pos, zeroVector, dimVector, this.r)

	if (deltaTime) {
		// Move based on change in time, not per frame (Not working)
		this.vel.add(this.acc * (60/frameRate()))
		this.pos.add(this.vel * (60/frameRate()))
	} else {
		this.vel.add(this.acc)
		this.pos.add(this.vel)
	}
  }
  
  show(colour, scale, add) {
    if (scale == null) scale = 1.0
    if (add == null) add = false
    
    if (colour == null) {
      let re = red(this.colour)
      let gr = green(this.colour)
      let bl = blue(this.colour)
      fill(re * 0.8, gr * 0.8, bl * 0.8)
    } else {
      let re = red(colour)
      let gr = green(colour)
      let bl = blue(colour)
      fill(re * 0.8, gr * 0.8, bl * 0.8)
    }
    if (add) ellipse(this.pos.x, this.pos.y, (this.r * 2) + scale)
    else ellipse(this.pos.x, this.pos.y, this.r * 2 * scale)
    
    if (colour == null) fill(this.colour)
    else fill(colour)
    if (add) ellipse(this.pos.x, this.pos.y, ((this.r * 2) - outlineWidth) + scale)
    else ellipse(this.pos.x, this.pos.y, ((this.r * 2) - outlineWidth) * scale)
  }

}