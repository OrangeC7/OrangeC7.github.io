// boundingBoxType of 0 is a rectangle, while 1 is an ellipse
class SceneObject {
    constructor({ x, y, animationTime = 1, animationFunction = (t) => { return this.pos }, boundingArea: boundingArea = { x1: x, y1: y, x2: x, y2: y }, boundingAreaType = 0, transparency = 0, transparencyPower = 1, objectColor = colors.scene }) {
        this.pos = createVector(x, y);
        this.parentScene = null;

        this.boundingArea = boundingArea;
        this.boundingAreaType = boundingAreaType;

        this.color = objectColor;
        this.transparency = transparency;
        this.transparencyPower = transparencyPower;
    }

    setScene(scene) {
        this.parentScene = scene;
    }

    getScene() {
        if (!this.parentScene) {
            console.error("Could not get parent scene of SceneObject", this);
        } else return this.parentScene;
    }

    distFromBoundingArea(point) {
        if (this.boundingAreaType === 0) return rectangleSDF(point, this.boundingArea.x1, this.boundingArea.y1, this.boundingArea.x2, this.boundingArea.y2);
        else if (this.boundingAreaType === 1) return circleSDF(point, this.boundingArea.x, this.boundingArea.y, this.boundingArea.r);
        else console.error("SceneObject is set with an unknown or undefined boundingAreaType", this);
    }

    distFrom(point) {
        return dist(this.x, this.y, point.x, point.y);
    }

    visualDistFrom(point, scaleMod) {
        function mapOneToInfinity(x) {
            return (1 / (1 - x) - 1)
        }

        let result = this.distFrom(point, scaleMod);
        if (this.transparency === 0) {
            return { distance: result, closestColor: this.color }
        } else {
            return { distance: result + mapOneToInfinity(Math.pow(Math.random(), this.transparencyPower)) * mapOneToInfinity(Math.sqrt(this.transparency)) * settings.rectangleTransparencyModifier, closestColor: this.color }
            // return result + Math.pow(Math.random(), 5) * this.transparency * settings.rectangleTransparencyModifier;
        }
    }

    colliding(point) {
        if (this.distFrom(point) < 0) return true;
        else return false;
    }

    collidingWithCircle(pos, radius) {
        if (this.distFrom(pos) < radius) return true;
        else return false;
    }

    normalTo(point) {
        return createVector(point.x - this.pos.x, point.y - this.pos.y).normalize();
    }

    closestPointTo(point) {
        return this.pos;
    }

    drawBoundingArea(positionOffset = createVector(0, 0), scaleMod = createVector(1, 1)) {
        if (this.boundingAreaType === 0) rect(
            this.boundingArea.x1 + positionOffset.x,
            this.boundingArea.y1 + positionOffset.y,
            (this.boundingArea.x2 - this.boundingArea.x1) * scaleMod.x,
            (this.boundingArea.y2 - this.boundingArea.y1) * scaleMod.y
        );
        else if (this.boundingAreaType === 1) ellipse(this.boundingArea.x, this.boundingArea.y, this.boundingArea.r * 2);
        else console.error("SceneObject has an invalid boundingAreaType", this);
    }

    drawNormalTo(point, positionOffset = createVector(0, 0)) {
        let scaledNormal = this.normalTo(point).mult(30);
        let closestPoint = this.closestPointTo(point);
        line(closestPoint.x + positionOffset.x, closestPoint.y + positionOffset.y, closestPoint.x + scaledNormal.x + positionOffset.x, closestPoint.y + scaledNormal.y + positionOffset.y);
    }

    drawClosestPointTo(pos, positionOffset = createVector(0, 0)) {
        let closestPoint = this.closestPointTo(pos);
        point(closestPoint.x + positionOffset.x, closestPoint.y + positionOffset.y);
    }

    show(positionOffset = createVector(0, 0)) {
        point(this.pos.x + positionOffset.x, this.pos.y + positionOffset.y);
    }
}

class Line extends SceneObject {
    constructor(x1, y1, x2, y2, objectColor) {
        super({ x: x1, y: y1, boundingArea: { x1: x1, y1: y1, x2: x2, y2: y2 }, objectColor: objectColor })
        this.pos2 = createVector(x2, y2);
    }

    distFrom(point) {
        return Math.abs(point.x * (this.pos2.y - this.pos.y) - point.y * (this.pos2.x - this.pos.x) + this.pos2.x * this.pos.y - this.pos2.y * this.pos.x) / this.pos.dist(this.pos2);
    }

    normalTo(point) {
        return createVector(this.pos.y - this.pos2.y, this.pos2.x - this.pos.x).normalize();
    }

    // closestPointTo() {

    // }

    show(positionOffset = createVector(0, 0)) {
        stroke(this.color);
        line(this.pos.x + positionOffset.x, this.pos.y + positionOffset.y, this.pos2.x + positionOffset.x, this.pos2.y + positionOffset.y);
    }
}