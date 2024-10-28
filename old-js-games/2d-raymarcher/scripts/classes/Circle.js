class Circle extends SceneObject {
    constructor({ x, y, r, transparency, transparencyPower, objectColor }) {
        super({ x: x, y: y, boundingArea: { x: x, y: y, r: r }, boundingAreaType: 1, transparency: transparency, transparencyPower: transparencyPower, objectColor: objectColor });
        this.r = r;
        this.d = r * 2;
    }

    distFrom(point, scaleMod) {
        if (scaleMod) console.error("TODO: make Circles a compatible SceneObject for CompoundSceneObjects 🤔", this)
        return circleSDF(point, this.pos, this.r);
    }

    closestPointTo(point) {
        return this.normalTo(point).mult(-this.distFrom(point)).add(point);
    }

    show(positionOffset = createVector(0, 0), scaleMod = createVector(1, 1)) {
        ellipse(this.pos.x + positionOffset.x, this.pos.y + positionOffset.y, this.r * 2 * scaleMod.x, this.r * 2 * scaleMod.y);
    }
}