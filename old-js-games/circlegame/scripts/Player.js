class Player extends Movable {
  
  // Players should get special colours!
  constructor(x, y, r, colour) {
    super(x, y, r, 0, 0) // Call parent constructor
    
    if (colour != null) this.colour = colour
  }
  
  // Players receive dampening, not all movables do (like obstacles which have no acceleration)
  update() {
    super.update()
    this.vel.mult(damp)
    this.acc.mult(damp)
  }
  
  // Move the player by increasing the acceleration in a certain direction
  move(x, y) {
    this.acc.add(createVector(x, y))
  }
  
}