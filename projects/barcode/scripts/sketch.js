let bc
let buttons = []

let userInput = []
let userText = []
let lastAppmode = "appmodeRead"

function rangedRandom(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

function randomCharacter(excludedCharacters = []) {
    let characterPool = []
    switch (settings.characterSet) {
        case "double_digits":
            characterPool = CODE_128_DOUBLE_DIGITS
            break
        case "single_digits":
            characterPool = CODE_128_SINGLE_DIGITS
            break
        case "uppercase_letters":
            characterPool = CODE_128_UPPERCASE_LETTERS
            break
        case 3: // used to be single digits + uppercase letters
            characterPool = CODE_128_SINGLE_DIGITS.concat(CODE_128_UPPERCASE_LETTERS)
            break
        case "lowercase_letters":
            characterPool = CODE_128_LOWERCASE_LETTERS
            break
        case 5: // used to be lowercase + uppercase
            characterPool = CODE_128_LOWERCASE_LETTERS.concat(CODE_128_UPPERCASE_LETTERS)
            break
        case "all_symbols":
            characterPool = CODE_128_ALL_SYMBOLS
            break
    }
    characterPool = characterPool.filter((el) => !excludedCharacters.includes(el)) //https://stackoverflow.com/a/19957433
    return characterPool[rangedRandom(0, characterPool.length - 1)]
}

function resetChoices() {
    if (userText.length === bc.data.length) {
        if (settings.autoRandomize) setTimeout(randomizeBarcode, settings.autoRandomizeTime)
        return
    }

    let usedCharacters = [bc.data[userText.length]]
    let correctButton = rangedRandom(0, settings.numChoices - 1)
    for (let i = 0; i < settings.numChoices; i++) {
        if (i === correctButton) {
            buttons[i].setCharacter(bc.data[userText.length])
        } else {
            let newCharacter = randomCharacter(usedCharacters)
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

function randomizeBarcode() {
    let newData = []
    do {
        newData = []
        for (let i = 0; newData.length < settings.randomizerLength; i++) {
            newData.push(randomCharacter())
        }
        console.log(newData)
    } while (JSON.stringify(bc.data) === JSON.stringify(newData))
    bc.data = newData
    userInput = []
    userText = []
    // for (let i = 0; i === 0 || Math.random() > 0.1 && bc.data.length < maxLength; i++) {
    for (let i = 0; bc.data.length < settings.randomizerLength; i++) {
        bc.data.push(randomCharacter())
    }
    resetChoices()
}

function setup() {
    createCanvas(1000, 400);
    textAlign(CENTER, TOP)
    textSize(20)

    settings.initialize()
    settings.handlers.randomize.setBehaviour(() => {
        randomizeBarcode()
    })

    let buttonWidth = 100
    let buttonHeight = 40
    let buttonSpacing = 20
    for (let i = 0; i < MAX_MULTIPLE_CHOICES; i++) buttons.push(new Button(44 + buttonWidth * i + buttonSpacing * i, 300, buttonWidth, buttonHeight, 0, (buttonObject) => {
        userText.push(buttonObject.characterCode)
        resetChoices()
    }))

    bc = new Barcode(44, 10)
    randomizeBarcode()
}

function draw() {
    background(120);

    settings.update()

    bc.highlightSections = settings.highlightSections
    bc.startcode = parseInt(settings.code128startcode)

    if (settings.appmodeMultChoice) {
        if (lastAppmode !== "appmodeMultChoice") userText = []
        if (lastAppmode === "appmodeEdit") {
            randomizeBarcode()
            settings.handlers.showAnswer.uncheck()
        }
        bc.render(userText, !settings.showAnswer, true)

        for (let i = 0; i < settings.numChoices; i++) {
            buttons[i].render(mouseX, mouseY, mouseIsPressed, settings.code128startcode === "103" ? CODE_128_CODE_A : settings.code128startcode === "104" ? CODE_128_CODE_B : CODE_128_CODE_C)
            buttons[i].update(mouseX, mouseY, mouseIsPressed)
        }

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
        default:
            if (!settings.appmodeRead && !settings.appmodeEdit) break
            userInput.push(key)
    }
    draw()
}