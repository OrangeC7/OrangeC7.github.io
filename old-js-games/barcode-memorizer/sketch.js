const encoding = [
    [' ', ' ', '00', [2, 1, 2, 2, 2, 2]],
    ['!', '!', '01', [2, 2, 2, 1, 2, 2]],
    ['"', '"', '02', [2, 2, 2, 2, 2, 1]],
    ['#', '#', '03', [1, 2, 1, 2, 2, 3]],
    ['$', '$', '04', [1, 2, 1, 3, 2, 2]],
    ['%', '%', '05', [1, 3, 1, 2, 2, 2]],
    ['&', '&', '06', [1, 2, 2, 2, 1, 3]],
    ["'", "'", '07', [1, 2, 2, 3, 1, 2]],
    ['(', '(', '08', [1, 3, 2, 2, 1, 2]],
    [')', ')', '09', [2, 2, 1, 2, 1, 3]],
    ['*', '*', '10', [2, 2, 1, 3, 1, 2]],
    ['+', '+', '11', [2, 3, 1, 2, 1, 2]],
    [',', ',', '12', [1, 1, 2, 2, 3, 2]],
    ['-', '-', '13', [1, 2, 2, 1, 3, 2]],
    ['.', '.', '14', [1, 2, 2, 2, 3, 1]],
    ['/', '/', '15', [1, 1, 3, 2, 2, 2]],
    ['0', '0', '16', [1, 2, 3, 1, 2, 2]],
    ['1', '1', '17', [1, 2, 3, 2, 2, 1]],
    ['2', '2', '18', [2, 2, 3, 2, 1, 1]],
    ['3', '3', '19', [2, 2, 1, 1, 3, 2]],
    ['4', '4', '20', [2, 2, 1, 2, 3, 1]],
    ['5', '5', '21', [2, 1, 3, 2, 1, 2]],
    ['6', '6', '22', [2, 2, 3, 1, 1, 2]],
    ['7', '7', '23', [3, 1, 2, 1, 3, 1]],
    ['8', '8', '24', [3, 1, 1, 2, 2, 2]],
    ['9', '9', '25', [3, 2, 1, 1, 2, 2]],
    [':', ':', '26', [3, 2, 1, 2, 2, 1]],
    [';', ';', '27', [3, 1, 2, 2, 1, 2]],
    ['<', '<', '28', [3, 2, 2, 1, 1, 2]],
    ['=', '=', '29', [3, 2, 2, 2, 1, 1]],
    ['>', '>', '30', [2, 1, 2, 1, 2, 3]],
    ['?', '?', '31', [2, 1, 2, 3, 2, 1]],
    ['@', '@', '32', [2, 3, 2, 1, 2, 1]],
    ['A', 'A', '33', [1, 1, 1, 3, 2, 3]],
    ['B', 'B', '34', [1, 3, 1, 1, 2, 3]],
    ['C', 'C', '35', [1, 3, 1, 3, 2, 1]],
    ['D', 'D', '36', [1, 1, 2, 3, 1, 3]],
    ['E', 'E', '37', [1, 3, 2, 1, 1, 3]],
    ['F', 'F', '38', [1, 3, 2, 3, 1, 1]],
    ['G', 'G', '39', [2, 1, 1, 3, 1, 3]],
    ['H', 'H', '40', [2, 3, 1, 1, 1, 3]],
    ['I', 'I', '41', [2, 3, 1, 3, 1, 1]],
    ['J', 'J', '42', [1, 1, 2, 1, 3, 3]],
    ['K', 'K', '43', [1, 1, 2, 3, 3, 1]],
    ['L', 'L', '44', [1, 3, 2, 1, 3, 1]],
    ['M', 'M', '45', [1, 1, 3, 1, 2, 3]],
    ['N', 'N', '46', [1, 1, 3, 3, 2, 1]],
    ['O', 'O', '47', [1, 3, 3, 1, 2, 1]],
    ['P', 'P', '48', [3, 1, 3, 1, 2, 1]],
    ['Q', 'Q', '49', [2, 1, 1, 3, 3, 1]],
    ['R', 'R', '50', [2, 3, 1, 1, 3, 1]],
    ['S', 'S', '51', [2, 1, 3, 1, 1, 3]],
    ['T', 'T', '52', [2, 1, 3, 3, 1, 1]],
    ['U', 'U', '53', [2, 1, 3, 1, 3, 1]],
    ['V', 'V', '54', [3, 1, 1, 1, 2, 3]],
    ['W', 'W', '55', [3, 1, 1, 3, 2, 1]],
    ['X', 'X', '56', [3, 3, 1, 1, 2, 1]],
    ['Y', 'Y', '57', [3, 1, 2, 1, 1, 3]],
    ['Z', 'Z', '58', [3, 1, 2, 3, 1, 1]],
    ['[', '[', '59', [3, 3, 2, 1, 1, 1]],
    ['\\', '\\', '60', [3, 1, 4, 1, 1, 1]],
    [']', ']', '61', [2, 2, 1, 4, 1, 1]],
    ['^', '^', '62', [4, 3, 1, 1, 1, 1]],
    ['_', '_', '63', [1, 1, 1, 2, 2, 4]],
    ['NUL', '`', '64', [1, 1, 1, 4, 2, 2]],
    ['SOH', 'a', '65', [1, 2, 1, 1, 2, 4]],
    ['STX', 'b', '66', [1, 2, 1, 4, 2, 1]],
    ['ETX', 'c', '67', [1, 4, 1, 1, 2, 2]],
    ['EOT', 'd', '68', [1, 4, 1, 2, 2, 1]],
    ['ENQ', 'e', '69', [1, 1, 2, 2, 1, 4]],
    ['ACK', 'f', '70', [1, 1, 2, 4, 1, 2]],
    ['BEL', 'g', '71', [1, 2, 2, 1, 1, 4]],
    ['BS', 'h', '72', [1, 2, 2, 4, 1, 1]],
    ['HT', 'i', '73', [1, 4, 2, 1, 1, 2]],
    ['LF', 'j', '74', [1, 4, 2, 2, 1, 1]],
    ['VT', 'k', '75', [2, 4, 1, 2, 1, 1]],
    ['FF', 'l', '76', [2, 2, 1, 1, 1, 4]],
    ['CR', 'm', '77', [4, 1, 3, 1, 1, 1]],
    ['SO', 'n', '78', [2, 4, 1, 1, 1, 2]],
    ['SI', 'o', '79', [1, 3, 4, 1, 1, 1]],
    ['DLE', 'p', '80', [1, 1, 1, 2, 4, 2]],
    ['DC1', 'q', '81', [1, 2, 1, 1, 4, 2]],
    ['DC2', 'r', '82', [1, 2, 1, 2, 4, 1]],
    ['DC3', 's', '83', [1, 1, 4, 2, 1, 2]],
    ['DC4', 't', '84', [1, 2, 4, 1, 1, 2]],
    ['NAK', 'u', '85', [1, 2, 4, 2, 1, 1]],
    ['SYN', 'v', '86', [4, 1, 1, 2, 1, 2]],
    ['ETB', 'w', '87', [4, 2, 1, 1, 1, 2]],
    ['CAN', 'x', '88', [4, 2, 1, 2, 1, 1]],
    ['EM', 'y', '89', [2, 1, 2, 1, 4, 1]],
    ['SUB', 'z', '90', [2, 1, 4, 1, 2, 1]],
    ['ESC', '{', '91', [4, 1, 2, 1, 2, 1]],
    ['FS', '|', '92', [1, 1, 1, 1, 4, 3]],
    ['GS', '}', '93', [1, 1, 1, 3, 4, 1]],
    ['RS', '~', '94', [1, 3, 1, 1, 4, 1]],
    ['US', 'DEL', '95', [1, 1, 4, 1, 1, 3]],
    ['FNC 3', 'FNC 3', '96', [1, 1, 4, 3, 1, 1]],
    ['FNC 2', 'FNC 2', '97', [4, 1, 1, 1, 1, 3]],
    ['Shift B', 'Shift A', '98', [4, 1, 1, 3, 1, 1]],
    ['Code C', 'Code C', '99', [1, 1, 3, 1, 4, 1]],
    ['Code B', 'FNC 4', 'Code B', [1, 1, 4, 1, 3, 1]],
    ['FNC 4', 'Code A', 'Code A', [3, 1, 1, 1, 4, 1]],
    ['FNC 1', 'FNC 1', 'FNC 1', [4, 1, 1, 1, 3, 1]],
    ['Start Code A', 'Start Code A', 'Start Code A', [2, 1, 1, 4, 1, 2]],
    ['Start Code B', 'Start Code B', 'Start Code B', [2, 1, 1, 2, 1, 4]],
    ['Start Code C', 'Start Code C', 'Start Code C', [2, 1, 1, 2, 3, 2]],
    ['Stop', 'Stop', 'Stop', [2, 3, 3, 1, 1, 1, 2]],
    ['Reverse Stop', 'Reverse Stop', 'Reverse Stop', [2, 1, 1, 1, 3, 3]],
    ['Stop pattern', 'Stop pattern', 'Stop pattern', [2, 3, 3, 1, 1, 1, 2]]
]

const double_digits = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
]

const all_characters = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
]

const single_digits = [
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
]

const uppercase_letters = [
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
]

const lowercase_letters = [
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
]

const CODEA = 0
const CODEB = 1
const CODEC = 2
const HVAL = "hex"

class barcodeRenderer {
    constructor(x = 44, y = 0, w = 5, h = 200) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h

        this.startcode = 105
        this.data = []

        this.highlightSections = true

        this.startColor = color(255, 255, 0)
        this.dataColor = 225
        this.checkColor = color(0, 255, 255)
        this.stopColor = color(255, 50, 100)
        this.startColorB = color(50, 25, 0)
        this.dataColorB = 0
        this.checkColorB = color(0, 25, 50)
        this.stopColorB = color(50, 0, 25)
    }

    addCharacter(num) {
        this.data.push(num)
    }

    renderCharacter(x, d, code = CODEB, lCol = 255, dCol = 0, hideData = false) {
        push()
        noStroke()
        let characterWidths = encoding[d][3]
        let black = true
        let dx = 0
        x *= this.width
        x += this.x
        for (let w of characterWidths) {
            if (black) fill(dCol)
            else fill(lCol)
            let screenW = w * this.width
            rect(x + dx, this.y, screenW, this.y + this.height)
            black = !black
            dx += screenW
        }
        pop()

        push()

        stroke(dCol)
        fill(lCol)
        strokeWeight()
        textAlign(CENTER, TOP)
        textSize(13)
        let txt
        let codeblock = code
        if (code === CODEA) {
            txt = encoding[d][0]
            codeblock = "A"
        } else if (code === CODEB) {
            txt = encoding[d][1]
            codeblock = "B"
        } else if (code === CODEC) {
            txt = encoding[d][2]
            codeblock = "C"
        } else if (code === HVAL) {
            txt = d.toString(16)
        } else txt = d

        if (txt === "Stop pattern") {
            txt = "STOP"
            codeblock = ""
        } else if (txt === "Start Code A") {
            txt = "STARTA"
            codeblock = ""
        } else if (txt === "Start Code B") {
            txt = "STARTB"
            codeblock = ""
        } else if (txt === "Start Code C") {
            txt = "STARTC"
            codeblock = ""
        }

        text(`${hideData ? "?" : txt}\n${hideData ? "?" : codeblock}`, x + this.width * 5.5, this.y + this.height + 20)

        pop()
    }

    render(compareText, hideData) {
        this.renderCharacter(0, this.startcode, CODEA, this.highlightSections ? this.startColor : undefined, this.highlightSections ? this.startColorB : undefined)
        let cs = this.startcode
        let pos = 1
        let code
        let tempcode = false
        if (this.startcode === 103) code = CODEA
        else if (this.startcode === 104) code = CODEB
        else if (this.startcode === 105) code = CODEC
        else console.error(`${this} is configured with an invalid startcode (${this.startcode})`)

        for (let d of this.data) {
            let colorW, colorB
            let dataMask = false
            if (compareText.length < pos) {
                colorW = this.dataColor
                colorB = this.dataColorB
                dataMask = hideData
            } else {
                if (compareText[pos - 1] === encoding[d][code]) {
                    colorW = color(0, 255, 0)
                    colorB = color(0, 25, 25)
                } else {
                    colorW = color(255, 0, 0)
                    colorB = color(25, 0, 25)
                }
            }

            this.renderCharacter(pos * 11, d, tempcode ? tempcode : code, colorW, colorB, dataMask)
            cs += d * pos
            pos++

            tempcode = false
            if (d === 98 && code === CODEA) tempcode = CODEB
            if (d === 98 && code === CODEB) tempcode = CODEA
            if (d === 99 && code !== CODEC) code = CODEC
            if (d === 100 && code !== CODEB) code = CODEB
            if (d === 101 && code !== CODEA) code = CODEA
        }

        cs %= 103
        this.renderCharacter(pos * 11, cs, HVAL, this.highlightSections ? this.checkColor : undefined, this.highlightSections ? this.checkColorB : undefined)
        pos++

        this.renderCharacter(pos * 11, encoding.length - 1, CODEB, this.highlightSections ? this.stopColor : undefined, this.highlightSections ? this.stopColorB : undefined)
    }
}

let bc
let d = 0

let barcodeLength = 1
let randomCharacterMode = 0
let randomModeList = [
    "All CODE C numbers",
    "Digits only",
    "Uppercase letters",
    "Digits and uppercase letters",
    "Lowercase letters",
    "Uppercase and lowercase numbers",
    "All characters",
]

let userInput = []
let userText = []

let hideAnswer = true

function setup() {
    createCanvas(1000, 400);
    textAlign(CENTER, TOP)
    textSize(20)

    bc = new barcodeRenderer(44, 10)
    bc.data = [0]
}

function draw() {
    background(120);

    bc.render(userText, hideAnswer)

    push()
    textAlign(LEFT, TOP)
    text(`${userText.join()}\n${userInput.join("")}`, 44, 300)
    pop()

    push()
    let randomModeText = randomModeList[randomCharacterMode]
    textAlign(RIGHT, BOTTOM)
    text(`Random Mode: ${randomModeText}`, width - 20, height - 20)
    pop()

    noLoop()
}

function rangedRandom(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

function randomizeBarcode(maxLength) {
    bc.data = []
    let characterPool = []
    switch (randomCharacterMode) {
        case 0:
            characterPool = double_digits
            break
        case 1:
            characterPool = single_digits
            break
        case 2:
            characterPool = uppercase_letters
            break
        case 3:
            characterPool = single_digits.concat(uppercase_letters)
            break
        case 4:
            characterPool = lowercase_letters
            break
        case 5:
            characterPool = lowercase_letters.concat(uppercase_letters)
            break
        case 6:
            characterPool = all_characters
            break
    }
    // for (let i = 0; i === 0 || Math.random() > 0.1 && bc.data.length < maxLength; i++) {
    for (let i = 0; bc.data.length < maxLength; i++) {
        let index = Math.floor(rangedRandom(0, characterPool.length - 1))
        bc.data.push(characterPool[index])
    }
}

function keyPressed() {
    switch (key) {
        case "Insert":
            randomizeBarcode(barcodeLength)
            break
        case "Delete":
            bc.highlightSections = !bc.highlightSections
            break
        case "PageUp":
            if (bc.startcode > 103) bc.startcode--
            break
        case "PageDown":
            if (bc.startcode < 105) bc.startcode++
            break
        case "ArrowUp":
            if (barcodeLength < 12) barcodeLength++
            break
        case "ArrowDown":
            if (barcodeLength > 1) barcodeLength--
            break
        case "End":
            hideAnswer = !hideAnswer
            break
        case "Backspace":
            if (userInput.length > 0) userInput.pop()
            else userText.pop()
            break
        case "Enter":
            userText.push(userInput.join(""))
            userInput = []
            break
        case "Home":
            randomCharacterMode++
            randomCharacterMode %= randomModeList.length
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