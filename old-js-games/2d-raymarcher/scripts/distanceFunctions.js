let circleSDFCalls = 0;
// Distance function from pos to a circle of radius r positioned at cPos
function circleSDF(pos, cPos, r) {
    circleSDFCalls++;
    return createVector(pos.x - cPos.x, pos.y - cPos.y).mag() - r;
}

let rectangleSDFCalls = 0;
// Signed distance function for a rectangle
function rectangleSDF(pos, x1, y1, x2, y2) {
    rectangleSDFCalls++;
    let dx = Math.max(x1 - pos.x, pos.x - x2);
    let dy = Math.max(y1 - pos.y, pos.y - y2);
    return createVector(Math.max(0, dx), Math.max(0, dy)).mag() + Math.min(0.0, Math.max(dx, dy));
}

// Unsigned distance function for a rectangle
function rectangleUDF(pos, x1, y1, x2, y2) {
    rectangleSDFCalls++;
    let dx = Math.max(x1 - pos.x, pos.x - x2);
    let dy = Math.max(y1 - pos.y, pos.y - y2);
    return createVector(Math.max(0, dx), Math.max(0, dy)).mag();
}

// Toy distance function
function botchedRectangleSDF(pos, x1, y1, x2, y2) {
    let dx = Math.max(x1 - pos.x, pos.x - x2);
    let dy = Math.max(y1 - pos.y, pos.y - y2);
    // return createVector(Math.max(0, dx), Math.max(0, dy)).mag() + Math.min(0.0, Math.max(dx, dy));
    return createVector(Math.max(0, dx), Math.max(0, dy)).mag();
}