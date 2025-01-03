let colors;
let playerAttributes;
let sdfIsRendered;
let viewerI;

// it doesn't work no matter what I try
// structuredClone()? breaks
// {...object}? breaks
// setting each setting by hand in the for loop in initSettings()? still breaks
// why javascript what sacrifice do you want from me

function getDefaultSettings() {
    return {
        fov: 1.57,
        rayAmount: 30,
        // jiggle: 0.051, // Amount in radians to randomly shift the ray direction by each frame.
        // fogginess: 0, // Amount in radians to randomly shift the ray direction at each raymarch step. Simulates the ray bouncing around in air
        maxPersistenceTime: 164, // Maximum number of milliseconds that points are drawn
        epsilonMagnitude: -1.2,
        showFPS: false,
        showFOV: false,
        showRays: false,
        showResult: true,
        showBounds: false,
        drawScene: false, // draw the scene directly
        showDistFuncVisual: false,
        useMouseMovement: true,
        centerOnPlayer: true,
        pauseRender: false,
        noClip: false,
        pointSize: 1.5,
        colorMode: 0,
        currentScene: 1,
        useOldPhysics: true,
    };
}

let settings = getDefaultSettings();

function getDefaultControls() {
    return {
        up: [87],
        down: [83],
        left: [65],
        right: [68],
        sneak: [16],
        turnRight: [40, 39],
        turnLeft: [38, 37],
        controlIsPressed: function (control) {
            return this[control].some(keyID => keyIsDown(keyID));
        }
    };
}

let controls = getDefaultControls();

let buttons = document.getElementsByTagName("button");
for (let element of buttons) {
    element.onclick = function () {
        switch (this.id) {
            case "settingsReset":
                if (settings.showDistFuncVisual) {
                    sdfIsRendered = false;
                    viewerI = 0;
                }
                break;
            case "logPlayerPosition":
                let pos = getCurrentScene().player.position;
                let view = getCurrentScene().player.viewDirection;
                console.log(`{ spawnPosition: createVector(${pos.x}, ${pos.y}), spawnViewDirection: createVector(${view.x}, ${view.y}) }`);
                break;
            case "resetSettings":
                settings = getDefaultSettings();
                initSettings();
                break;
            case "resetControls":
                controls = getDefaultControls();
                break;
        }
    };
}

function initSettings() {
    for (let key in settings) {
        let element = document.getElementById(key)
        if (element.type === "range") {
            element.value = settings[key];
            document.getElementById(key + "Num").innerText = element.value;
            if (element.id === "currentScene") {
                element.max = numScenes;
            }
        } else if (element.type === "checkbox") {
            element.checked = settings[key];
        } else {
            console.error(`A setting with an unknown type appeared. (${element.type})`);
        }
        element.oninput = function () {
            if (this.type === "range") {
                settings[key] = this.value;
                if (key === "colorMode") {
                    switch (this.value) {
                        case "0":
                            document.getElementById(key + "Num").innerText = "RGB"
                            colorMode(RGB)
                            break;
                        case "1":
                            document.getElementById(key + "Num").innerText = "HSB"
                            colorMode(HSB)
                            break;
                        case "2":
                            document.getElementById(key + "Num").innerText = "HSL"
                            colorMode(HSL)
                            break;
                        default:
                            document.getElementById(key + "Num").innerText = "?"
                            break;
                    }
                } else document.getElementById(key + "Num").innerText = this.value;
            } else if (this.type === "checkbox") {
                settings[key] = this.checked;
                if (settings.useMouseMovement) {
                    cursor("crosshair");
                } else {
                    noCursor();
                }
            } else {
                console.error(`A setting with an unknown type appeared. (${this.type})`);
            }
        };
    }

    colors = {
        bg: color("#111"),
        scene: color("#0ff"),
        sceneStroke: color("#a00"),
        player: color("#111"),
        playerStroke: color("#f70"),
        frustum: color("#00f"),
        viewDirection: color("#f0f"),
        fps: color("#0f0"),
        debugSegment: color("#00aa"),
        debugSegment2: color("#040"),
        debugSegmentPoint: color("#f00"),
        fadeColor: color("#111"),
    }

    playerAttributes = {
        speed: 5,
        sneakFactor: 0.2,
        turnSpeed: 0.5,
        size: 10,
        movementDampening: 1.1, // 1 = no dampening, 2 = 50% dampening
    }

    sdfIsRendered = false;
    viewerI = 0;
}


