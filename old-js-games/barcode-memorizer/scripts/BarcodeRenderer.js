class BarcodeRenderer {
    constructor(x = 44, y = 0, w = 5, h = 200) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h

        this.startcode = 103
        this.data = []

        this.highlightSections = true

        this.startColor = color(255, 255, 0)
        this.dataColor = 225
        this.checkColor = color(0, 255, 255)
        this.stopColor = color(255, 0, 255)
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
        let characterWidths = ENCODING[d][3]
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
            txt = ENCODING[d][0]
            codeblock = "A"
        } else if (code === CODEB) {
            txt = ENCODING[d][1]
            codeblock = "B"
        } else if (code === CODEC) {
            txt = ENCODING[d][2]
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
                if (compareText[pos - 1] === ENCODING[d][code]) {
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

        this.renderCharacter(pos * 11, ENCODING.length - 1, CODEB, this.highlightSections ? this.stopColor : undefined, this.highlightSections ? this.stopColorB : undefined)
    }
}