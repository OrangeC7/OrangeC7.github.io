let bc
let d = 0

let barcodeLength = 1

let userInput = []
let userText = []

function rangedRandom(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

function randomizeBarcode() {
    bc.data = []
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
        case 3:
            characterPool = CODE_128_SINGLE_DIGITS.concat(CODE_128_UPPERCASE_LETTERS)
            break
        case "lowercase_letters":
            characterPool = CODE_128_LOWERCASE_LETTERS
            break
        case 5:
            characterPool = CODE_128_LOWERCASE_LETTERS.concat(CODE_128_UPPERCASE_LETTERS)
            break
        case "all_symbols":
            characterPool = CODE_128_ALL_SYMBOLS
            break
    }
    // for (let i = 0; i === 0 || Math.random() > 0.1 && bc.data.length < maxLength; i++) {
    for (let i = 0; bc.data.length < settings.randomizerLength; i++) {
        let index = Math.floor(rangedRandom(0, characterPool.length - 1))
        bc.data.push(characterPool[index])
    }
}

function setup() {
    createCanvas(1000, 400);
    textAlign(CENTER, TOP)
    textSize(20)

    settings.initialize()
    settings.handlers.randomize.setBehavior(randomizeBarcode)

    bc = new BarcodeRenderer(44, 10)
    bc.data = [0]
}

function draw() {
    background(120);

    bc.highlightSections = settings.highlightSections
    bc.startcode = parseInt(settings.code128startcode)

    bc.render(userText, !settings.showAnswer)

    push()
    textAlign(LEFT, TOP)
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
            if (userInput.length > 0) userInput.pop()
            else userText.pop()
            break
        case "Enter":
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
            userInput.push(key)
    }
    draw()
}