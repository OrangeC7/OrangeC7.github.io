class InvertedRectangle extends Rectangle {
    constructor({ x1, y1, x2, y2, transparency, transparencyPower, objectColor }) {
        super({ x1: x1, y1: y1, x2: x2, y2: y2, transparency: transparency, transparencyPower: transparencyPower, objectColor: objectColor });
    }

    distFrom(point, scaleMod) {
        if (!scaleMod) return -rectangleSDF(point, this.pos.x, this.pos.y, this.pos2.x, this.pos2.y);
        else return -rectangleSDF(point, this.pos.x, this.pos.y, this.pos.x + this.size.x * scaleMod.x, this.pos.y + this.size.y * scaleMod.y);
    }

    show(positionOffset = createVector(0, 0), scaleMod = createVector(1, 1)) {
        push();
        noFill();
        stroke(this.color);
        rect(
            this.pos.x + positionOffset.x,
            this.pos.y + positionOffset.y,
            this.size.x * scaleMod.x,
            this.size.y * scaleMod.y
        );
        pop();
    }
}