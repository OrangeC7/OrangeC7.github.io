class Rectangle extends SceneObject {
    constructor({ x1, y1, x2, y2, transparency, transparencyPower, objectColor, animationTime, animationFunction }) {
        super({ x: x1, y: y1, boundingArea: { x1, y1, x2, y2 }, transparency, transparencyPower, objectColor, animationTime, animationFunction });
        this.pos2 = createVector(x2, y2);
        this.size = createVector(this.pos2.x - this.pos.x, this.pos2.y - this.pos.y);
        this.d = this.pos.dist(this.pos2);
    }

    distFrom(point, scaleMod) {
        if (!scaleMod) return rectangleSDF(point, this.pos.x, this.pos.y, this.pos2.x, this.pos2.y);
        else return rectangleSDF(point, this.pos.x, this.pos.y, this.pos.x + this.size.x * scaleMod.x, this.pos.y + this.size.y * scaleMod.y);
    }

    normalTo(point, scaleMod) {
        function cardinalize(v) {
            let magnitude = v.mag()
            if (v.x > 0 && v.x < Math.abs(v.y)) v.x = 0
            else if (v.x < 0 && v.x > -Math.abs(v.y)) v.x = 0
            if (v.y > 0 && v.y < Math.abs(v.x)) v.y = 0
            else if (v.y < 0 && v.y > -Math.abs(v.x)) v.y = 0
            return v.setMag(magnitude)
        }
        let truePos2 = scaleMod ? createVector(this.pos.x + this.size.x * scaleMod.x, this.pos.y + this.size.y * scaleMod.y) : this.pos2;
        return cardinalize(createVector(point.x - (this.pos.x + truePos2.x) / 2, point.y - (this.pos.y + truePos2.y) / 2)).normalize();
    }

    closestPointTo(point, scaleMod) {
        let truePos2 = scaleMod ? createVector(this.pos.x + this.size.x * scaleMod.x, this.pos.y + this.size.y * scaleMod.y) : this.pos2;
        return createVector((this.pos.x + truePos2.x) / 2, (this.pos.y + truePos2.y) / 2)
    }

    show(positionOffset = createVector(0, 0), scaleMod = createVector(1, 1)) {
        rect(
            this.pos.x + positionOffset.x,
            this.pos.y + positionOffset.y,
            this.size.x * scaleMod.x,
            this.size.y * scaleMod.y
        );
    }
}