let callCounters = {
    rectangleSDF: 0,
    rectangleUDF: 0,
    circleSDF: 0,
    sceneVisualSDF: 0,
    marchForLoop: 0,
};

// Distance function from pos to a circle of radius r positioned at cPos
function circleSDF(pos, cPos, r) {
    callCounters.circleSDF++;
    return createVector(pos.x - cPos.x, pos.y - cPos.y).mag() - r;
}

// Fast signed distance function for a rectangle
// This version of the SDF isn't as accurate, but is faster than the proper equation
function rectangleSDF(pos, x1, y1, x2, y2) {
    callCounters.rectangleSDF++;
    let dx = Math.max(x1 - pos.x, pos.x - x2);
    let dy = Math.max(y1 - pos.y, pos.y - y2);
    return Math.max(dx, dy);
}

// // PROPER signed distance function for a rectangle
// function rectangleSDF(pos, x1, y1, x2, y2) {
//     callCounters.rectangleSDF++;
//     let dx = Math.max(x1 - pos.x, pos.x - x2);
//     let dy = Math.max(y1 - pos.y, pos.y - y2);
//     return createVector(Math.max(0, dx), Math.max(0, dy)).mag() + Math.min(0.0, Math.max(dx, dy));
// }

// Unsigned distance function for a rectangle
function rectangleUDF(pos, x1, y1, x2, y2) {
    callCounters.rectangleUDF++;
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

// Function used to apply transparency to transparent objects
function transparencyDistance(t, p) {
    return (1 / (1 - Math.pow(Math.random(), p)) - 1) * (1 / (1 - Math.sqrt(t)) - 1);
}