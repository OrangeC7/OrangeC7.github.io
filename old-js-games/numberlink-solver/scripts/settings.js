let colors

function getDefaultSettings() {
    return {
        linkRadius: 5,
        txtSize: 40,
        boardVisualWidth: 550,
        turnOffWinScreen: false,
        boardGridWidth: 10,
        boardGridHeight: 10,
        autoNextPuzzle: false,
        // debug: false,
        // testing: false,
        // bailProbability: 0,
        // This will do wanderSpeedFactor many wanderTest()s per frame
        wanderSpeedFactor: 200,
    }
}

let settings = getDefaultSettings();

function initSettings() {
    for (let key in settings) {
        let element = document.getElementById(key)
        if (element.type === "range") {
            element.value = settings[key]
            document.getElementById(key + "Num").innerText = element.value
        } else if (element.type === "checkbox") {
            element.checked = settings[key]
        } else {
            console.error(`A setting with an unknown type appeared. (${element.type})`)
        }
        element.oninput = function () {
            if (this.type === "range") {
                settings[key] = this.value
                document.getElementById(key + "Num").innerText = this.value
            } else if (this.type === "checkbox") {
                settings[key] = this.checked
            } else {
                console.error(`A setting with an unknown type appeared. (${this.type})`)
            }
        }
    }
}

let bailProbability = 0

let canvasSize = 550

let debug = false
let testing = false

// This will do wanderSpeedFactor many wanderTest()s per frame
// let wanderSpeedFactor = 200