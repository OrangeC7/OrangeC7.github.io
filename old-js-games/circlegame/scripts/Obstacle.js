class Obstacle extends Movable {
  
  //vrange stands for "Velocity Range"
  constructor(x, y, r, vrange) {
    const xvel = random(-vrange, vrange)
    const yvel = random(-vrange, vrange)
    super(x, y, r, xvel, yvel) // Call parent constructor
  }
  
}