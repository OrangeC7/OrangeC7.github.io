// Loop a position toroidally between a minimum position and maximum position
// Accuracy is questionable :P
function loopPos(mpos, minpos, maxpos, r) {
  let pos = mpos.copy()

  const xwidth = maxpos.x + minpos.x
  const ywidth = maxpos.y + minpos.y

  if (pos.x > maxpos.x + r) pos.x -= xwidth + r * 2
  else if (pos.x < minpos.x - r) pos.x += xwidth + r * 2

  if (pos.y > maxpos.y + r) pos.y -= ywidth + r * 2
  else if (pos.y < minpos.y - r) pos.y += ywidth + r * 2

  return pos
}

function initObstacles() {
  let w = width
  let h = height
  if (scaleUp) {
    w = w/2
    h = h/2
  }
  for (let i = 0; i < numObstacles; i++) {
    // X and Y positions must not be in middle third (ninth?) of screen
    let x = random(w)
    let y = random(h)
    while (x > w / freeSpace && x < w * (freeSpace-1) / freeSpace && y > h / freeSpace && y < h * (freeSpace-1) / freeSpace) {
      x = random(w)
      y = random(h)
    }
    
    // Repopulate the obstacles array
    obstacles[i] = new Obstacle(x, y, random(minObstacleRadius, maxObstacleRadius), maxObstacleVelocity)
  }
}

// Calculate the three nearest obstacles to a player, drawLines is true by default
function nearestObstacles(amtClosest, player, drawLines) {
  if (drawLines == null) drawLines = true
  let sorted = copyArray(obstacles)
  sorted.sort(function(a, b) {
    return a.distance(player) - b.distance(player)
  })

  let closest = []
  for (let i = 0; i < amtClosest; i++) closest[i] = sorted[i]
  if (drawLines) {
    stroke(0)
    for (const obs of closest) line(obs.pos.x, obs.pos.y, player.pos.x, player.pos.y)
    noStroke()
  }

  return closest
}

// Copy an array so it does not reference base obstacles but creates new ones
function copyArray(array) {
  let newArray = []
  for (let i = 0; i < array.length; i++) {
    newArray[i] = array[i].copy()
  }
  return newArray
}

// Pause animation
function pauseAnim() {
  if (paused && (frameCount-pauseFrame) % 60 < 30) {
    fill(0, 255, 0)
    let padding = 10
    let h = 25
    let w = 6
    rect(padding, height - padding - h, w, h)
    rect(padding * 1.5 + w, height - padding - h, w, h)
  }
}

// Draw scale button ('size' is the size of the button, larger numbers are smaller)
function scaleButton() {
  let x, y, w, h
  if (scaleUp) {
    fill(0, 255, 0, 20)
    w = (width/2) / scaleButtonSize
    h = (height/2) / scaleButtonSize
    x = (width/2) - w
    y = (height/2) - h
  } else {
    fill (255, 0, 0, 20)
    w = width / scaleButtonSize
    h = height / scaleButtonSize
    x = width - w
    y = height - h
  }
  
  rect(x, y, w, h)
}