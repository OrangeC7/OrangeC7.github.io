new p5() // Allow p5 functions outside p5 draw(), setup(), etc.

// Controls/player settings

const up  = 87 // Alternate up movement key (87 = 'w')
const left = 65 // Alternate left movement key (65 = 'a')
const down = 83 // Alternate down movement key (83 = 's')
const right = 68 // Alternate right movement key (68 = 'd')

const playerSpeed = 0.08 // 1 is very fast, 0.01 is very slow

const scaleButtonSize = 10 // Larger numbers are smaller, size of button that changes scale

// Simulation settings

// Self explanatory obstacle settings
const numObstacles = 50
const maxObstacleVelocity = 2
const minObstacleRadius = 10
const maxObstacleRadius = 15

const freeSpace = 5 // How many squares (per side) to divide the space into, obstacles only spawn on outside of grid

const damp = 0.9 // Dampening of player acceleration and velocity

// Aesthetic settings

const playerColour = color(255, 125, 0)

const outlineWidth = 10 // Pixels of width for the outline of movables

const warningColour = color(255, 100, 100)