class Scene {
    constructor({ spawnPosition, sceneObjects = [], spawnViewDirection = createVector(0, 1) }) {
        this.spawnPosition = spawnPosition;
        this.spawnViewDirection = spawnViewDirection;
        this.sceneObjects = sceneObjects;
        this.player = null;
    }

    add(sceneObject) {
        this.sceneObjects.push(sceneObject);
        sceneObject.setScene(this);
    }

    remove(sceneObjectIndex) {
        this.sceneObjects.splice(sceneObjectIndex, 1);
    }

    setPlayer(player) {
        this.player = player;
        player.setScene(this);
    }

    updatePlayer() {
        this.player.update();
    }

    respawnPlayer() {
        this.player.position = this.spawnPosition;
        this.player.viewDirection = this.spawnViewDirection;
    }

    visualSDF(point) {
        let distance = Infinity;
        let closestColor;
        for (let sceneObject of this.sceneObjects) {
            if (distance > sceneObject.distFromBoundingArea(point)) {
                let distanceResult = sceneObject.visualDistFrom(point);
                if (distanceResult.distance < distance) {
                    distance = distanceResult.distance;
                    closestColor = distanceResult.closestColor;
                }
            }
        }
        return { distance: distance, closestColor: closestColor };
    }

    drawBoundaries() {
        stroke(colors.sceneStroke);
        noFill();
        for (let sceneObject of this.sceneObjects) {
            sceneObject.drawBoundingArea();
        }
    }

    drawNormalsTo(point) {
        stroke(color("#f0f"));
        for (let sceneObject of this.sceneObjects) {
            sceneObject.drawNormalTo(point);
        }
    }

    drawClosestPointsTo(point) {
        stroke(color("#0f0"));
        for (let sceneObject of this.sceneObjects) {
            sceneObject.drawClosestPointTo(point);
        }
    }

    drawSceneObjects() {
        noStroke();
        for (let sceneObject of this.sceneObjects) {
            fill(sceneObject.color);
            sceneObject.show();
        }
    }
}