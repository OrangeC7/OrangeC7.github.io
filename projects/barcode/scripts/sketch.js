let bc
let buttons = []

let userInput = []
let userText = []
let lastAppmode = "appmodeRead"

function randomizeBarcode() {
    bc.randomizeData()
    userInput = []
    userText = []
    resetChoices()
}

let waitingForNextBarcode = false
function resetChoices() {
    if (userText.length === bc.data.length) {
        if (settings.autoRandomize) {
            waitingForNextBarcode = true
            let wasSectionsHighlighted = settings.highlightSections
            if (!wasSectionsHighlighted) settings.handlers.highlightSections.check()
            setTimeout(() => {
                randomizeBarcode()
                if (!wasSectionsHighlighted) settings.handlers.highlightSections.uncheck()
                waitingForNextBarcode = false
            }, settings.autoRandomizeTime)
        }
        return
    }

    let usedCharacters = [bc.data[userText.length]]
    let correctButton = rangedRandom(0, settings.numChoices - 1)
    for (let i = 0; i < settings.numChoices; i++) {
        if (i === correctButton) {
            buttons[i].setCharacter(bc.data[userText.length])
        } else {
            let newCharacter = bc.randomCharacter(usedCharacters)
            buttons[i].setCharacter(newCharacter)
            usedCharacters.push(newCharacter)
        }
    }
}

function testSetChoices(iters = 1000) {
    for (let i = 0; i < iters; i++) {
        resetChoices()
        console.log(buttons)
        let buttonTexts = []
        for (let j = 0; j < settings.numChoices; j++) {
            let nextButtonText = buttons[j].characterCode
            console.log(buttonTexts, nextButtonText)
            if (buttonTexts.includes(nextButtonText)) return false
            buttonTexts[j] = nextButtonText
        }
    }
    return true
}

let scores = []

function setup() {
    createCanvas(1000, 500);
    textAlign(CENTER, TOP)
    textSize(20)

    settings.initialize()
    settings.handlers.randomize.setBehaviour(randomizeBarcode)
    settings.handlers.resetScore.setBehaviour(() => {
        scores = []
    })

    let buttonWidth = 100
    let buttonHeight = 40
    let buttonSpacing = 20
    for (let i = 0; i < MAX_MULTIPLE_CHOICES; i++) buttons.push(new Button(44 + buttonWidth * i + buttonSpacing * i, 300, buttonWidth, buttonHeight, 0, (buttonObject) => {
        if (!waitingForNextBarcode) {
            if (bc.data[userText.length] === buttonObject.characterCode) scores.push(1)
            else scores.push(0)
            userText.push(buttonObject.characterCode)
            resetChoices()
        }
    }))

    bc = new Barcode(44, 10)
    randomizeBarcode()
}

function draw() {
    background(120);

    settings.update()

    bc.setSymbology(settings.symbology, randomizeBarcode)

    bc.highlightSections = settings.highlightSections
    bc.startcode = parseInt(settings.code128startcode)
    bc.height = settings.barcodeHeight
    bc.barWidth = settings.barWidth

    if (settings.appmodeMultChoice) {
        if (lastAppmode !== "appmodeMultChoice") userText = []
        if (lastAppmode === "appmodeEdit") {
            randomizeBarcode()
            settings.handlers.showAnswer.uncheck()
        }
        bc.render(userText, !settings.showAnswer, true)

        for (let i = 0; i < settings.numChoices; i++) {
            let buttonCharacterTable = []
            switch (settings.symbology) {
                case CODE_128:
                    buttonCharacterTable = settings.code128startcode === "103" ? CODE_128_CODE_A_ENCODING : settings.code128startcode === "104" ? CODE_128_CODE_B_ENCODING : CODE_128_CODE_C_ENCODING
                    break
                case RM4SCC:
                    buttonCharacterTable = RM4SCC_ENCODING
                    break
            }
            buttons[i].render(mouseX, mouseY, mouseIsPressed, buttonCharacterTable)
            buttons[i].update(mouseX, mouseY, mouseIsPressed)
        }

        push()
        textAlign(RIGHT, BOTTOM)
        fill(0)
        text(`Score: ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 1000) / 10}% correct`, width - 44, height - 44)
        pop()

        lastAppmode = "appmodeMultChoice"
        return
    }

    if (settings.appmodeRecall) {

        lastAppmode = "appmodeRecall"
        return
    }

    if (settings.appmodeEdit) {
        if (lastAppmode !== "appmodeEdit") settings.handlers.showAnswer.check()
        bc.data = []
        for (let i = 0; i < userText.length; i++) {
            bc.data[i] = parseInt(userText[i])
        }
        bc.render([], !settings.showAnswer)
        lastAppmode = "appmodeEdit"
    }

    if (settings.appmodeRead) {
        if (lastAppmode !== "appmodeRead") userText = []
        if (lastAppmode === "appmodeEdit") {
            randomizeBarcode()
            settings.handlers.showAnswer.uncheck()
        }
        bc.render(userText, !settings.showAnswer)
        lastAppmode = "appmodeRead"
    }

    push()
    textAlign(LEFT, TOP)
    fill(0)
    text(`${userText.join()}\n${userInput.join("")}`, 44, 300)
    pop()
}

function keyPressed() {
    switch (key) {
        case "Insert":
            randomizeBarcode()
            break
        case "Delete":
            settings.handlers.highlightSections.flip()
            break
        case "End":
            settings.handlers.showAnswer.flip()
            break
        case "Backspace":
            if (!settings.appmodeRead && !settings.appmodeEdit) break
            if (userInput.length > 0) userInput.pop()
            else userText.pop()
            break
        case "Enter":
            if (!settings.appmodeRead && !settings.appmodeEdit) break
            userText.push(userInput.join(""))
            userInput = []
            break
        case "Shift":
        case "Alt":
        case "Control":
        case "CapsLock":
        case "Tab":
        case "Meta":
            break
        case "q":
            if (settings.appmodeMultChoice) {
                buttons[0].activate()
                break
            }
        case "w":
            if (settings.appmodeMultChoice) {
                buttons[1].activate()
                break
            }
        case "e":
            if (settings.appmodeMultChoice) {
                buttons[2].activate()
                break
            }
        case "r":
            if (settings.appmodeMultChoice) {
                buttons[3].activate()
                break
            }
        case "t":
            if (settings.appmodeMultChoice) {
                buttons[4].activate()
                break
            }
        default:
            if (!settings.appmodeRead && !settings.appmodeEdit) break
            userInput.push(key)
    }
    draw()
}