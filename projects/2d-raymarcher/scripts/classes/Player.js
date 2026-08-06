class Player {
    constructor(parentScene, positionVector = parentScene.spawnPosition, viewVector = parentScene.spawnViewDirection) {
        this.parentScene = parentScene;
        this.viewDirection = viewVector;
        this.position = positionVector;
        this.lastPosition = positionVector;
        this.lastMovement = createVector();
        this.acceleration = createVector();
        this.velocity = createVector();
    }

    collidingWith(sceneObject, offsetVector) {
        return sceneObject.collidingWithCircle(createVector(this.position.x + offsetVector.x, this.position.y + offsetVector.y), playerAttributes.size / 2)
    }

    setScene(scene) {
        this.parentScene = scene;
    }

    control() {
        this.acceleration = createVector();

        if (controls.controlIsPressed("up")) this.acceleration.y--;
        if (controls.controlIsPressed("down")) this.acceleration.y++;

        if (controls.controlIsPressed("left")) this.acceleration.x--;
        if (controls.controlIsPressed("right")) this.acceleration.x++;

        let targetSpeed = controls.controlIsPressed("sneak") ? playerAttributes.speed * playerAttributes.sneakFactor : playerAttributes.speed;

        this.acceleration.normalize().mult(Math.log(playerAttributes.movementDampening + 1) * targetSpeed * deltaTime / 100);

        if (settings.useMouseMovement) {
            if (settings.centerOnPlayer) {
                this.viewDirection = new p5.Vector(
                    mouseX - width / 2,
                    mouseY - height / 2
                )
            } else {
                this.viewDirection = new p5.Vector(
                    mouseX - this.position.x,
                    mouseY - this.position.y
                )
            }
        } else {
            if (controls.controlIsPressed("turnRight")) this.viewDirection.rotate(playerAttributes.turnSpeed * deltaTime / 100);
            else if (controls.controlIsPressed("turnLeft")) this.viewDirection.rotate(-playerAttributes.turnSpeed * deltaTime / 100);
        }

        this.viewDirection.normalize();
    }

    move() {
        this.lastPosition = this.position;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        if (!settings.noClip && settings.useOldPhysics) {
            for (let sceneObject of this.parentScene.sceneObjects) {
                if (this.collidingWith(sceneObject, createVector(this.velocity.x, 0))) {
                    let absX = Math.abs(this.velocity.x);
                    if (!this.collidingWith(sceneObject, createVector(0, absX))) {
                        // this.velocity.y += absX;
                        this.velocity.y++;
                    }
                    if (!this.collidingWith(sceneObject, createVector(0, -absX))) {
                        // this.velocity.y -= absX;
                        this.velocity.y--;
                    }
                    // this.velocity.x = this.velocity.x < 0 ? -sceneObject.distFrom(this.position) : sceneObject.distFrom(this.position);
                    this.velocity.x = 0;
                }
                if (this.collidingWith(sceneObject, createVector(0, this.velocity.y))) {
                    let absY = Math.abs(this.velocity.y);
                    if (!this.collidingWith(sceneObject, createVector(absY, 0))) {
                        // this.velocity.x += absY;
                        this.velocity.x++;
                    }
                    if (!this.collidingWith(sceneObject, createVector(-absY, 0))) {
                        // this.velocity.x -= absY;
                        this.velocity.x--;
                    }
                    // this.velocity.y = this.velocity.y < 0 ? -sceneObject.distFrom(this.position) : sceneObject.distFrom(this.position);
                    this.velocity.y = 0;
                }
                if (this.collidingWith(sceneObject, createVector(this.velocity.x, this.velocity.y))) {
                    this.velocity = createVector();
                }
            }
        }

        this.velocity.mult(1 / playerAttributes.movementDampening);

        this.position.add(this.velocity);

        if (!settings.noClip && !settings.useOldPhysics) {
            for (let sceneObject of this.parentScene.sceneObjects) {
                if (
                    sceneObject.collidingWithCircle(
                        this.position,
                        playerAttributes.size / 2
                    )
                ) {
                    let normalToCollision = sceneObject.normalTo(this.position)
                    this.position.add(normalToCollision.mult(-sceneObject.distFrom(this.position) + playerAttributes.size / 2));
                }
            }
        }

        this.lastMovement = this.position
    }

    update() {
        this.control();
        this.move();
    }

    draw() {
        push();
        if (settings.showFOV) {
            stroke(colors.frustum);

            let dLength = sqrt(sq(width) + sq(height));
            let L = p5.Vector.rotate(this.viewDirection, -settings.fov / 2).mult(dLength);
            let R = p5.Vector.rotate(this.viewDirection, settings.fov / 2).mult(dLength);
            line(this.position.x, this.position.y, L.x + this.position.x, L.y + this.position.y);
            line(this.position.x, this.position.y, R.x + this.position.x, R.y + this.position.y);

            stroke(colors.viewDirection);

            let C = p5.Vector.rotate(this.viewDirection, 0).mult(dLength);
            line(this.position.x, this.position.y, C.x + this.position.x, C.y + this.position.y);
        }

        stroke(colors.playerStroke);
        strokeWeight(settings.pointSize);

        noFill();
        ellipse(this.position.x, this.position.y, playerAttributes.size);

        line(this.position.x, this.position.y, this.position.x + this.viewDirection.x * playerAttributes.size / 2, this.position.y + this.viewDirection.y * playerAttributes.size / 2);

        // line(this.position.x, this.position.y, this.position.x + this.velocity.x, this.position.y + this.velocity.y)
        pop();
    }
}