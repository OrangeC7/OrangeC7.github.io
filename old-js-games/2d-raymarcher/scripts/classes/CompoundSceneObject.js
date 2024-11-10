class CompoundSceneObject extends SceneObject {
    constructor({ sceneObjects, x, y, xScale = 1, yScale = xScale, objectColor, transparency }) {
        super({ x: x, y: y, boundingArea: {}, objectColor: objectColor, transparency });
        this.sceneObjects = sceneObjects;
        this.scale = createVector(xScale, yScale);
        this.pos = createVector(x, y);

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let sceneObject of sceneObjects) {
            minX = sceneObject.pos.x < minX ? sceneObject.pos.x : minX;
            minY = sceneObject.pos.y < minY ? sceneObject.pos.y : minY;
            maxX = sceneObject.pos2.x > maxX ? sceneObject.pos2.x : maxX;
            maxY = sceneObject.pos2.y > maxY ? sceneObject.pos2.y : maxY;
        }
        this.boundingArea = { x1: minX + this.pos.x, y1: minY + this.pos.y, x2: (maxX * this.scale.x) + this.pos.x, y2: (maxY * this.scale.y) + this.pos.y };
        this.pos2 = createVector(this.boundingArea.x2, this.boundingArea.y2);
    }

    distFrom(point, scaleMod) {
        let minDistance = Infinity;
        let trueScale = scaleMod ? p5.Vector.mult(scaleMod, this.scale) : this.scale;
        for (let sceneObject of this.sceneObjects) {
            minDistance = Math.min(minDistance, sceneObject.distFrom(createVector(
                point.x - this.pos.x - sceneObject.pos.x * (trueScale.x - 1),
                point.y - this.pos.y - sceneObject.pos.y * (trueScale.y - 1)
            ), trueScale));
        }
        return minDistance;
    }

    visualDistFrom(point, scaleMod) {
        let minDistance = Infinity;
        let closestColor;
        let trueScale = scaleMod ? p5.Vector.mult(scaleMod, this.scale) : this.scale;
        for (let sceneObject of this.sceneObjects) {
            let distanceResult = sceneObject.visualDistFrom(createVector(
                point.x - this.pos.x - sceneObject.pos.x * (trueScale.x - 1),
                point.y - this.pos.y - sceneObject.pos.y * (trueScale.y - 1)
            ), trueScale);
            if (distanceResult.distance < minDistance) {
                minDistance = distanceResult.distance;
                closestColor = sceneObject.color;
            }
        }
        return { distance: minDistance, closestColor: closestColor };
    }

    normalTo(point, scaleMod) {
        let minDistance = Infinity;
        let closestNormal = createVector(0, 0);
        let trueScale = scaleMod ? p5.Vector.mult(scaleMod, this.scale) : this.scale;
        for (let sceneObject of this.sceneObjects) {
            let distanceResult = sceneObject.distFrom(createVector(
                point.x - this.pos.x - sceneObject.pos.x * (trueScale.x - 1),
                point.y - this.pos.y - sceneObject.pos.y * (trueScale.y - 1)
            ), trueScale);
            if (distanceResult < minDistance) {
                minDistance = distanceResult;
                closestNormal = sceneObject.normalTo(p5.Vector.add(point, this.pos), trueScale);
            }
        }
        return closestNormal;
    }

    drawNormalTo(point, positionOffset = createVector(0, 0)) {
        for (let sceneObject of this.sceneObjects) {
            sceneObject.drawNormalTo(point, p5.Vector.add(positionOffset, p5.Vector.mult(this.pos, this.scale)));
        }
    }

    closestPointTo(point, scaleMod) {
        let minDistance = Infinity;
        let closestPoint = createVector(0, 0);
        let trueScale = scaleMod ? p5.Vector.mult(scaleMod, this.scale) : this.scale;
        for (let sceneObject of this.sceneObjects) {
            let distanceResult = sceneObject.distFrom(createVector(
                point.x - this.pos.x - sceneObject.pos.x * (trueScale.x - 1),
                point.y - this.pos.y - sceneObject.pos.y * (trueScale.y - 1)
            ), trueScale);
            if (distanceResult < minDistance) {
                minDistance = distanceResult;
                closestPoint = sceneObject.closestPointTo(p5.Vector.add(point, this.pos), trueScale);
            }
        }
        return p5.Vector.add(this.pos, p5.Vector.mult(closestPoint, trueScale));
    }

    drawBoundingArea(positionOffset = createVector(0, 0), scaleMod = createVector(1, 1)) {
        if (this.boundingAreaType === 0) rect(
            this.boundingArea.x1 + positionOffset.x,
            this.boundingArea.y1 + positionOffset.y,
            (this.boundingArea.x2 - this.boundingArea.x1) * scaleMod.x,
            (this.boundingArea.y2 - this.boundingArea.y1) * scaleMod.y
        );
        else ellipse(this.boundingArea.x, this.boundingArea.y, this.boundingArea.r * 2)
        for (let sceneObject of this.sceneObjects) {
            sceneObject.drawBoundingArea(createVector(
                this.pos.x + sceneObject.pos.x * (this.scale.x * scaleMod.x - 1) + positionOffset.x,
                this.pos.y + sceneObject.pos.y * (this.scale.y * scaleMod.y - 1) + positionOffset.y
            ), p5.Vector.mult(this.scale, scaleMod));
        }
    }

    show(positionOffset = createVector(0, 0), scaleMod = createVector(1, 1)) {
        for (let sceneObject of this.sceneObjects) {
            sceneObject.show(createVector(
                this.pos.x + sceneObject.pos.x * (this.scale.x * scaleMod.x - 1) + positionOffset.x,
                this.pos.y + sceneObject.pos.y * (this.scale.y * scaleMod.y - 1) + positionOffset.y
            ), p5.Vector.mult(this.scale, scaleMod));
        }
    }
}

class TextObject1 extends CompoundSceneObject {
    constructor(x, y, xScale, yScale, objectColor) {
        super({
            sceneObjects: [
                new Rectangle({ x1: 0, y1: 0, x2: 1, y2: 5 }),
                new Rectangle({ x1: 1, y1: 2, x2: 2, y2: 3 }),
                new Rectangle({ x1: 2, y1: 0, x2: 3, y2: 5 }),
                new Rectangle({ x1: 4, y1: 0, x2: 5, y2: 1 }),
                new Rectangle({ x1: 4, y1: 2, x2: 5, y2: 5 }),
                new Rectangle({ x1: 6, y1: 0, x2: 7, y2: 3 }),
                new Rectangle({ x1: 6, y1: 4, x2: 7, y2: 5 }),
            ], x: x, y: y, xScale: xScale, yScale: yScale, objectColor: objectColor, transparency: 0.5
        });
        // this.pos2.x = this.pos.x + 7 * this.scale.x;
        // this.pos2.y = this.pos.y + 5 * this.scale.y;
    }
}

class TextObject2 extends CompoundSceneObject {
    constructor(x, y, xScale, yScale, objectColor) {
        function randomColor() {
            colorMode(HSB)
            return color(Math.random() * 100, Math.random() * 100, 100)
        }
        super({
            sceneObjects: [
                new Glyph12({ x: 0, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph24({ x: 4, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph23({ x: 8, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph16({ x: 12, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph27({ x: 16, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph10({ x: 20, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph29({ x: 24, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph30({ x: 28, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph21({ x: 32, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph10({ x: 36, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph29({ x: 40, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph18({ x: 44, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph24({ x: 48, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph23({ x: 52, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph28({ x: 56, y: 0, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph34({ x: 0, y: 6, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph24({ x: 4, y: 6, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph30({ x: 8, y: 6, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph32({ x: 16, y: 6, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph18({ x: 22, y: 6, xScale: 1, yScale: 1, objectColor: randomColor() }),
                new Glyph23({ x: 26, y: 6, xScale: 1, yScale: 1, objectColor: randomColor() }),
            ], x: x, y: y, xScale: xScale, yScale: yScale, objectColor: objectColor, transparency: 0.5
        });
    }
}

class MazeObject extends CompoundSceneObject {
    constructor({ x, y, xScale, yScale, objectColor }) {
        super({
            sceneObjects: [
                // Outer walls of maze
                new Rectangle({ x1: 0, y1: 0, x2: 2, y2: 30, objectColor: objectColor }),
                new Rectangle({ x1: 4, y1: 0, x2: 30, y2: 2, objectColor: objectColor }),
                new Rectangle({ x1: 28, y1: 2, x2: 30, y2: 30, objectColor: objectColor }),
                new Rectangle({ x1: 2, y1: 28, x2: 14, y2: 30, objectColor: objectColor }),
                new Rectangle({ x1: 16, y1: 28, x2: 28, y2: 30, objectColor: objectColor }),

                // Inner walls of maze
                new Rectangle({ x1: 4, y1: 4, x2: 18, y2: 6, objectColor: objectColor }),
                new Rectangle({ x1: 20, y1: 4, x2: 22, y2: 10, objectColor: objectColor }),
                new Rectangle({ x1: 24, y1: 4, x2: 26, y2: 12, objectColor: objectColor }),
                new Rectangle({ x1: 4, y1: 6, x2: 6, y2: 10, objectColor: objectColor }),
                new Rectangle({ x1: 12, y1: 6, x2: 14, y2: 10, objectColor: objectColor }),
                new Rectangle({ x1: 16, y1: 6, x2: 18, y2: 10, objectColor: objectColor }),
                new Rectangle({ x1: 8, y1: 8, x2: 12, y2: 10, objectColor: objectColor }),
                new Rectangle({ x1: 10, y1: 10, x2: 12, y2: 14, objectColor: objectColor }),
                new Rectangle({ x1: 16, y1: 10, x2: 22, y2: 12, objectColor: objectColor }),
                new Rectangle({ x1: 4, y1: 12, x2: 6, y2: 26, objectColor: objectColor }),
                new Rectangle({ x1: 8, y1: 12, x2: 10, y2: 16, objectColor: objectColor }),
                new Rectangle({ x1: 12, y1: 12, x2: 14, y2: 16, objectColor: objectColor }),
                new Rectangle({ x1: 24, y1: 12, x2: 28, y2: 14, objectColor: objectColor }),
                new Rectangle({ x1: 14, y1: 14, x2: 18, y2: 16, objectColor: objectColor }),
                new Rectangle({ x1: 20, y1: 14, x2: 22, y2: 26, objectColor: objectColor }),
                new Rectangle({ x1: 6, y1: 16, x2: 8, y2: 24, objectColor: objectColor }),
                new Rectangle({ x1: 22, y1: 16, x2: 26, y2: 18, objectColor: objectColor }),
                new Rectangle({ x1: 10, y1: 18, x2: 18, y2: 20, objectColor: objectColor }),
                new Rectangle({ x1: 2, y1: 20, x2: 4, y2: 22, objectColor: objectColor }),
                new Rectangle({ x1: 12, y1: 20, x2: 14, y2: 26, objectColor: objectColor }),
                new Rectangle({ x1: 24, y1: 20, x2: 28, y2: 22, objectColor: objectColor }),
                new Rectangle({ x1: 8, y1: 22, x2: 10, y2: 24, objectColor: objectColor }),
                new Rectangle({ x1: 16, y1: 22, x2: 20, y2: 24, objectColor: objectColor }),
                new Rectangle({ x1: 14, y1: 24, x2: 18, y2: 26, objectColor: objectColor }),
                new Rectangle({ x1: 22, y1: 24, x2: 26, y2: 26, objectColor: objectColor }),
                new Rectangle({ x1: 8, y1: 26, x2: 10, y2: 28, objectColor: objectColor }),
                new Rectangle({ x1: 16, y1: 26, x2: 18, y2: 28, objectColor: objectColor }),
            ], x: x, y: y, xScale: xScale, yScale: yScale, objectColor: objectColor
        });
    }
}

class GlyphTestObject extends CompoundSceneObject {
    constructor(x, y, xScale, yScale, objectColor) {
        super({
            sceneObjects: [
                new Glyph10({ x: 0, y: 0, xScale: 1, yScale: 1 }),
                new Glyph11({ x: 4, y: 0, xScale: 1, yScale: 1 }),
                new Glyph12({ x: 8, y: 0, xScale: 1, yScale: 1 }),
                new Glyph13({ x: 12, y: 0, xScale: 1, yScale: 1 }),
                new Glyph14({ x: 16, y: 0, xScale: 1, yScale: 1 }),
                new Glyph15({ x: 20, y: 0, xScale: 1, yScale: 1 }),
                new Glyph16({ x: 24, y: 0, xScale: 1, yScale: 1 }),
                new Glyph17({ x: 28, y: 0, xScale: 1, yScale: 1 }),
                new Glyph18({ x: 32, y: 0, xScale: 1, yScale: 1 }),
                new Glyph19({ x: 36, y: 0, xScale: 1, yScale: 1 }),
                new Glyph20({ x: 40, y: 0, xScale: 1, yScale: 1 }),
                new Glyph21({ x: 44, y: 0, xScale: 1, yScale: 1 }),
                new Glyph22({ x: 48, y: 0, xScale: 1, yScale: 1 }),
                new Glyph23({ x: 54, y: 0, xScale: 1, yScale: 1 }),
                new Glyph24({ x: 58, y: 0, xScale: 1, yScale: 1 }),
                new Glyph25({ x: 62, y: 0, xScale: 1, yScale: 1 }),
                new Glyph26({ x: 66, y: 0, xScale: 1, yScale: 1 }),
                new Glyph27({ x: 71, y: 0, xScale: 1, yScale: 1 }),
                new Glyph28({ x: 75, y: 0, xScale: 1, yScale: 1 }),
                new Glyph29({ x: 79, y: 0, xScale: 1, yScale: 1 }),
                new Glyph30({ x: 83, y: 0, xScale: 1, yScale: 1 }),
                new Glyph31({ x: 87, y: 0, xScale: 1, yScale: 1 }),
                new Glyph32({ x: 91, y: 0, xScale: 1, yScale: 1 }),
                new Glyph33({ x: 97, y: 0, xScale: 1, yScale: 1 }),
                new Glyph34({ x: 101, y: 0, xScale: 1, yScale: 1 }),
                new Glyph35({ x: 105, y: 0, xScale: 1, yScale: 1 }),
                new Glyph0({ x: 0, y: 6, xScale: 1, yScale: 1 }),
                new Glyph1({ x: 4, y: 6, xScale: 1, yScale: 1 }),
                new Glyph2({ x: 8, y: 6, xScale: 1, yScale: 1 }),
                new Glyph3({ x: 12, y: 6, xScale: 1, yScale: 1 }),
                new Glyph4({ x: 16, y: 6, xScale: 1, yScale: 1 }),
                new Glyph5({ x: 20, y: 6, xScale: 1, yScale: 1 }),
                new Glyph6({ x: 24, y: 6, xScale: 1, yScale: 1 }),
                new Glyph7({ x: 28, y: 6, xScale: 1, yScale: 1 }),
                new Glyph8({ x: 32, y: 6, xScale: 1, yScale: 1 }),
                new Glyph9({ x: 36, y: 6, xScale: 1, yScale: 1 }),
            ], x: x, y: y, xScale: xScale, yScale: yScale, objectColor: objectColor, transparency: 0.5
        });
    }
}