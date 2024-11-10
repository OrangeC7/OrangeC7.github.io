/**
 ---- FUNCTIONS
 **/

function roughDist(x1, x2, y1, y2) {
    // let xDist = x1 - x2
    // let yDist = y1 - y2
    return dist(x1, x2, y1, y2)
}

// Draws a circle and a fancy visualization of the signedDistToCircle
function visualizeCircleSDF(position, circlePosition, radius) {
    let distance = circleSDF(position, circlePosition, radius);

    noFill();

    stroke("#ffffff");
    ellipse(circlePosition.x, circlePosition.y, radius * 2);

    textFont(loadedFont, 15);
    textAlign(LEFT, TOP);
    text((round(1000 * distance) / 1000).toFixed(3), 10, 10);

    stroke("#00ff00");
    line(position.x, position.y, circlePosition.x, circlePosition.y);

    if (distance > 0) {
        // Vector from center of circle to mouse
        let vector = createVector(position.x - circlePosition.x, position.y - circlePosition.y);
        vector.setMag(radius);
        stroke("#ff0000");
        line(circlePosition.x, circlePosition.y, circlePosition.x + vector.x, circlePosition.y + vector.y);
    }
}

let paintCanvas;
function bakePainter() {
    // for (let x = 0; x < paintCanvas.width; x++) {
    //     for (let y = 0; y < paintCanvas.height; y++) {

    //     }
    // }
    // console.log(pixels[])
}

function doThingsToPixelsOn(canvas) {
    canvas.loadPixels()
    for (let i = 0; i < canvas.pixels.length; i += 4) {
        if (canvas.pixels[i] > 0) {
            canvas.pixels[i] = 50
            canvas.pixels[i + 1] = 50
            canvas.pixels[i + 2] = 50
            canvas.pixels[i + 3] = 50
            // let pixelIndex = Math.floor(i/4)
            // console.log(pixelIndex%canvas.width, Math.floor(pixelIndex/canvas.width))
        }
    }
    canvas.updatePixels()
}

// Generalized SDF visualizer
let sdfViewerCanvas;
let sdfViewerRenderSpeed = 5;
let sdfToView = circleSDF;
let viewedSDFParameters;
function viewSDF(sdf, params) {
    let epsilon = Math.pow(2, settings.epsilonMagnitude);
    if (!sdfIsRendered) {
        if (viewerI < width) {
            for (let xAdd = 0; xAdd < sdfViewerRenderSpeed; xAdd++) {
                for (let y = 0; y < height; y++) {
                    let x = viewerI + xAdd;
                    let sdfResult = sdf(createVector(x, y), ...params);
                    if (sdfResult > epsilon) {
                        sdfViewerCanvas.stroke(lerpColor(color("#000"), color("#f00"), 1 / (sdfResult * 0.05 + 1)))
                    } else if (sdfResult < -epsilon) {
                        sdfViewerCanvas.stroke(lerpColor(color("#000"), color("#0f0"), -(1 / (sdfResult * 0.05 - 1))))
                    } else {
                        sdfViewerCanvas.stroke("#fff")
                    }
                    sdfViewerCanvas.point(x - width / 2, y - height / 2);
                }
            }
            viewerI += sdfViewerRenderSpeed;
        } else {
            sdfIsRendered = true;
            console.log("Finished rendering SDF")
        }
    }
    image(sdfViewerCanvas, 0, 0);
    let resultAtMouse = sdf(createVector(mouseX, mouseY), ...params);
    textFont(loadedFont, 15);
    textAlign(LEFT, TOP);
    fill("#fff");
    text((round(1000 * resultAtMouse) / 1000).toFixed(3), 10, 10);
}

let marchCount = 0;
/** Takes in a distance function with its arguments and raymarches from a point in space to the shape.
distFunction: The distance function to be used
funcArgs: Any arguments that are to be passed to the function
x, y: The position of the viewer
raymarchDirection: A normalized vector representing the direction to raymarch in
drawRays: Whether or not to draw individual raymarches (default = false)
fov: The field of view in radians (default 1.25rad ~= 71.6deg)
rayAmount: How many lines to trace (default = 10)
minStep: How small a step should be before it stops tracing (default = 1)
viewDist: How far to trace a ray before stopping
**/
function march(
    player,
    drawRays = false,
    fov = 1.25,
    rayAmount = 100,
    minStep = 1,
    viewDist = 800,
    epsilon = minStep
) {
    let x = player.position.x
    let y = player.position.y
    let raymarchDirection = player.viewDirection

    let jiggle = settings.fov / settings.rayAmount;

    let points = [];
    let pointColors = [];
    let marchNumbers = [];
    for (let i = 0; i <= rayAmount; i++) {
        let rayEnd = createVector(x, y);
        let raySeg = createVector(minStep, minStep)
        let angleDirection = map(i, 0, rayAmount, -fov / 2, fov / 2);
        let angle = angleDirection + Math.random() * jiggle - jiggle / 2;

        let started = false // this is to ensure the loop runs at least once
        let marches = 0;
        let pointColor = colors.scene;
        while (!started || roughDist(x, y, rayEnd.x, rayEnd.y) > minStep && roughDist(x, y, rayEnd.x, rayEnd.y) < viewDist) {
            started = true;

            // if (settings.fogginess > 0) angle += Math.random() * settings.fogginess - settings.fogginess / 2
            raySeg = p5.Vector.rotate(raymarchDirection, angle);

            let sdfResult = player.parentScene.visualSDF(rayEnd);
            raySeg.mult(sdfResult.distance);
            pointColor = sdfResult.closestColor;

            if (drawRays) {
                stroke(colors.debugSegment);
                line(rayEnd.x, rayEnd.y, raySeg.x + rayEnd.x, raySeg.y + rayEnd.y);

                noStroke();
                fill(colors.debugSegmentPoint);
                rect(rayEnd.x - 1, rayEnd.y - 1, 2, 2);
            }

            rayEnd.add(raySeg);
            if (raySeg.mag() <= epsilon) break;
            marches++;
        }
        marchCount += marches;

        if (drawRays) {
            let rayEnd = createVector(x, y);
            let raySeg = createVector(1, 1);
            raySeg = p5.Vector.rotate(raymarchDirection, angleDirection);
            raySeg.mult(viewDist);
            rayEnd.add(raySeg);
            stroke(colors.debugSegment2);
            line(x, y, rayEnd.x, rayEnd.y);
        }

        if (roughDist(x, y, rayEnd.x, rayEnd.y) < viewDist) {
            points.push(rayEnd);
            pointColors.push(pointColor);
            marchNumbers.push(marches);
        }
    }
    return { points: points, marches: marchNumbers, colors: pointColors };
}

/**
---- MAIN PROGRAM
**/

let player;
let scenes = [];

function getCurrentScene() {
    return scenes[settings.currentScene - 1];
}

// let recentPoints = [];
// let allPixels = [];
let recentPixels = {};

let frameTimes = [[0, 0]];

let loadedFont;
function preload() {
    loadedFont = loadFont('assets/FiraCode-Medium.ttf');
}

function setup() {
    createCanvas(800, 800, WEBGL);

    cursor("crosshair");

    initSettings();

    paintCanvas = createGraphics(width, height, WEBGL);
    paintCanvas.stroke("fff")
    paintCanvas.strokeWeight(3);

    sdfViewerCanvas = createGraphics(width, height, WEBGL);
    sdfViewerCanvas.strokeWeight(2);
    viewedSDFParameters = [createVector(width / 2, height / 2), 200]

    scenes[0] = new Scene({ spawnPosition: createVector(50, 70) });
    // scene1 = new Scene({ spawnPosition: createVector(-13.070065079509217, 384.4834138515663), sceneObjects: [], spawnViewDirection: createVector(0.8968207967851197, -0.44239400815755064) });
    scenes[1] = new Scene({ spawnPosition: createVector(0, 0) });
    scenes[2] = new Scene({ spawnPosition: createVector(0, 0) });

    let boundaryRectangle = new InvertedRectangle({ x1: -800, y1: -800, x2: 1600, y2: 1600, transparency: 0.9 });

    // Scene 1
    scenes[0].add(boundaryRectangle);

    scenes[0].add(new Circle({ x: 100, y: 300, r: 50, transparency: 0.5 }));
    scenes[0].add(new Circle({ x: 350, y: 70, r: 80, objectColor: color("#f00") }));
    scenes[0].add(new Circle({ x: 75, y: 550, r: 120 }));
    scenes[0].add(new Circle({ x: 800, y: 650, r: 100, transparency: 0.5 }));
    scenes[0].add(new Circle({ x: 300, y: 760, r: 20 }));
    scenes[0].add(new Circle({ x: 225, y: 740, r: 30 }));
    scenes[0].add(new Circle({ x: 350, y: 775, r: 15 }));

    scenes[0].add(new Rectangle({ x1: -800, y1: 390, x2: 300, y2: 410 }));
    scenes[0].add(new Rectangle({ x1: 600, y1: 390, x2: 1600, y2: 410 }));

    scenes[0].add(new MazeObject({ x: 300, y: 300, xScale: 10, yScale: 10, objectColor: color("#fff") }));
    scenes[0].add(new TextObject1(1000, -600, 10, 10));
    scenes[0].add(new TextObject2(50, 800, 12, 12));
    colorMode(RGB);

    scenes[0].setPlayer(new Player(scenes[0]));

    // Scene 2
    scenes[1].add(boundaryRectangle);

    scenes[1].add(new GlyphTestObject(-780, 1420, 12, 12));

    scenes[1].setPlayer(new Player(scenes[1]));

    // Scene 3
    scenes[2].add(boundaryRectangle);

    scenes[2].add(new Circle({ x: 400, y: 300, r: 150, transparency: 0.8, transparencyBorderEffect: 1 }))

    scenes[2].setPlayer(new Player(scenes[2]));

    document.getElementById("loadingPrompt").remove();
}

let maxMarches = 0;
let lastCountsReset = 0;
function draw() {
    translate(-width / 2, -height / 2, 0);
    background(colors.bg);
    frameRate(1000); // make sure the framerate is uncapped

    let currentScene = getCurrentScene();

    currentScene.updatePlayer();

    let currentMS = millis();
    let renderStageMS = [currentMS];
    if (settings.showDistFuncVisual) {
        if (mouseIsPressed) paintCanvas.line(pmouseX - width / 2, pmouseY - height / 2, mouseX - width / 2, mouseY - height / 2);
        viewSDF(sdfToView, viewedSDFParameters);
        image(paintCanvas, 0, 0);
        doThingsToPixelsOn(paintCanvas);
    }
    else {
        if (settings.centerOnPlayer) translate(width / 2 - currentScene.player.position.x, height / 2 - currentScene.player.position.y);

        if (!settings.pauseRender) {
            let result = march(
                currentScene.player,
                settings.showRays,
                settings.fov,
                settings.rayAmount,
                Math.pow(2, settings.epsilonMagnitude),
                settings.centerOnPlayer ? roughDist(0, 0, width / 2, height / 2) : roughDist(0, 0, width, height),
            );

            currentMS = millis();
            renderStageMS.push(currentMS);

            maxMarches = 0;
            for (let i = 0; i < result.points.length; i++) {
                let point = createVector(Math.round(result.points[i].x), Math.round(result.points[i].y));
                let pointLocation = point.x + "," + point.y;
                recentPixels[pointLocation] = [point, currentMS, result.marches[i], result.colors[i]];
                maxMarches = result.marches[i] > maxMarches ? result.marches[i] : maxMarches;
            }
        }

        currentMS = millis();
        renderStageMS.push(currentMS);
        for (let pixel in recentPixels) {
            let age = currentMS - recentPixels[pixel][1];

            if (settings.showResult) {
                push();
                stroke(lerpColor(recentPixels[pixel][3], colors.fadeColor, age / settings.maxPersistenceTime));
                if (settings.pauseRender) stroke(255, 255, 255);
                strokeWeight(settings.pointSize);

                point(recentPixels[pixel][0].x, recentPixels[pixel][0].y);
                pop();
            }

            if (!settings.pauseRender && age >= settings.maxPersistenceTime) {
                delete recentPixels[pixel];
            }
        }

        if (settings.drawScene) currentScene.drawSceneObjects();
        if (settings.showBounds) {
            push();
            strokeWeight(1.5);
            currentScene.drawBoundaries();
            currentScene.drawNormalsTo(currentScene.player.position);
            strokeWeight(3);
            currentScene.drawClosestPointsTo(currentScene.player.position);
            pop();
        }
        currentScene.player.draw();

        if (settings.centerOnPlayer) translate(currentScene.player.position.x - width / 2, currentScene.player.position.y - height / 2);
    }
    currentMS = millis();
    renderStageMS.push(currentMS);
    frameTimes.push([currentMS - renderStageMS[0], currentMS]);
    frameTimes = frameTimes.filter(frameTime => currentMS - frameTime[1] < 1000);

    if (settings.showFPS) {
        let FPSSize = 20;
        let FPSPadding = 0.1 * FPSSize;
        let FPSInterval = FPSSize + FPSPadding;
        let FPSPosition = createVector(width - FPSPadding, FPSPadding);

        push();
        noStroke();
        fill(colors.fps);
        textFont(loadedFont, FPSSize);
        textAlign(RIGHT, TOP);

        let rowLocation = 0;

        let frameMS = frameTimes.reduce((accum, frameTime) => accum + frameTime[0], 0) / frameTimes.length;

        let fpsCount = Math.round(1000 / frameMS);
        let fpsReported = Math.round(frameRate());
        text(`FPS: ${fpsCount}/${fpsReported}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);

        let maxFrameTime = (Math.round(100 * frameTimes.reduce((accum, compare) => Math.max(accum, compare[0]), -Infinity)) / 100).toFixed(2);
        let minFPSCount = Math.round(1000 / maxFrameTime);
        text(`Min FPS: ${minFPSCount}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);

        let frameTime = (Math.round(100 * frameMS) / 100).toFixed(2);
        text(`Frame time: ${frameTime}ms`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);

        text(`Max time: ${maxFrameTime}ms`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);

        let renderStages = ""
        for (let i = 1; i < renderStageMS.length; i++) {
            renderStages += (Math.round(10 * (renderStageMS[i] - renderStageMS[i - 1])) / 10).toFixed(1) + "/"
        }
        renderStages = renderStages.substring(0, renderStages.length - 1)
        text(`Render stages: ${renderStages}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);

        text(`Max march count: ${maxMarches}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);
        text(`Calls for rect distance: ${rectangleSDFCalls}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);
        text(`Calls for circ distance: ${circleSDFCalls}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);
        text(`Times marched: ${marchCount}`, FPSPosition.x, FPSPosition.y + rowLocation++ * FPSInterval);
        pop();
    }
    if (millis() >= lastCountsReset + 1000) {
        rectangleSDFCalls = 0;
        circleSDFCalls = 0;
        marchCount = 0;
        lastCountsReset = millis();
    }
}

// function draw() {
//   let pink = color(255, 102, 204);
//   let img = createImage(66, 66);
//   img.loadPixels();
//   for (let i = 0; i < 4 * (width * height / 2); i += 4) {
//     img.pixels[i] = red(pink);
//     img.pixels[i + 1] = green(pink);
//     img.pixels[i + 2] = blue(pink);
//     img.pixels[i + 3] = alpha(pink);
//   }
//   img.updatePixels();
//   image(img, 17, 17);
// }
