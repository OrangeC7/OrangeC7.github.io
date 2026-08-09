function rangedRandom(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

class Barcode {
    constructor(x = 44, y = 0, w = 5, h = 200, symbology = CODE_128) {
        this.x = x
        this.y = y
        this.barWidth = w
        this.height = h

        this.symbology = symbology
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

        // Code 128 specific
        this.startcode = 103
    }

    setSymbology(symbology, initFunc) {
        if (this.symbology !== symbology) {
            this.symbology = symbology
            this.data = []
            switch (symbology) {
                case RM4SCC:
                    settings.handlers.barWidth.setValue(8)
                    settings.handlers.barcodeHeight.setValue(100)
                    break
                case CODE_128:
                    settings.handlers.barWidth.setValue(5)
                    settings.handlers.barcodeHeight.setValue(200)
                    break
            }
            initFunc()
        }
    }

    randomCharacter(excludedCharacters = []) {
        let characterPool = []
        switch (this.symbology) {
            case CODE_128:
                switch (settings.code128CharacterSet) {
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
                break
            case RM4SCC:
                switch (settings.rm4sccCharacterSet) {
                    case "rm4scc_digits":
                        characterPool = RM4SCC_DIGITS
                        break
                    case "rm4scc_letters":
                        characterPool = RM4SCC_LETTERS
                        break
                    case "all_symbols":
                        characterPool = RM4SCC_ALL_SYMBOLS
                        break
                }
        }
        characterPool = characterPool.filter((el) => !excludedCharacters.includes(el)) //https://stackoverflow.com/a/19957433
        return characterPool[rangedRandom(0, characterPool.length - 1)]
    }

    randomizeData() {
        let newData = []
        do {
            newData = []
            for (let i = 0; newData.length < settings.randomizerLength; i++) {
                newData.push(this.randomCharacter())
            }
            // console.log(newData)
        } while (JSON.stringify(bc.data) === JSON.stringify(newData))
        bc.data = newData
    }

    renderBarsCode128(x, characterIndex, lCol, dCol, barHeight) {
        push()
        noStroke()

        let characterWidths = CODE_128_WIDTHS[characterIndex]
        let black = true
        let dx = 0
        for (let nextBarWidth of characterWidths) {
            if (black) fill(dCol)
            else fill(lCol)
            let barWidthOnScreen = nextBarWidth * this.barWidth
            rect(x + dx, this.y, barWidthOnScreen, barHeight)
            black = !black
            dx += barWidthOnScreen
        }

        pop()
    }

    renderBarsRM4SCC(x, characterIndex, lCol, dCol, barHeight) {
        let x1 = x
        let y1 = this.y
        let y2 = this.y + barHeight * 1 / 3
        let y3 = this.y + barHeight * 2 / 3
        let y4 = this.y + barHeight

        let characterHeights = RM4SCC_HEIGHTS[characterIndex]
        let dx = 0

        push()
        noStroke()
        for (let nextBarHeight of characterHeights) {
            fill(lCol)
            rect(x1 + dx, y1, this.barWidth * 2, y4 - y1)
            fill(dCol)
            switch (nextBarHeight) {
                case "T":
                    rect(x1 + dx + this.barWidth, y2, this.barWidth, y3 - y2)
                    break
                case "A":
                    rect(x1 + dx + this.barWidth, y1, this.barWidth, y3 - y1)
                    break
                case "D":
                    rect(x1 + dx + this.barWidth, y2, this.barWidth, y4 - y2)
                    break
                case "F":
                    rect(x1 + dx + this.barWidth, y1, this.barWidth, y4 - y1)
                    break
            }
            dx += this.barWidth * 2
        }
        pop()
    }

    renderCharacter(x, characterIndex, symbology, lCol = 255, dCol = 0, isChecksum = false, hideData = false, barHeight = this.height, renderText = true, xOffset = 0) {
        x *= this.barWidth
        x += this.x
        let characterText = characterIndex.toString(16)
        let symbologyLabel = ""
        let characterWidth
        switch (symbology) {
            case CODE_128:
            case CODE_128_CODE_A:
            case CODE_128_CODE_B:
            case CODE_128_CODE_C:
                this.renderBarsCode128(x, characterIndex, lCol, dCol, barHeight)
                characterWidth = 11
                if (isChecksum) {
                    symbologyLabel = CHECKSUM_CHARACTER
                    break
                }
                switch (symbology) {
                    case CODE_128_CODE_A:
                        characterText = CODE_128_CODE_A_ENCODING[characterIndex]
                        symbologyLabel = "A"
                        break
                    case CODE_128_CODE_B:
                        characterText = CODE_128_CODE_B_ENCODING[characterIndex]
                        symbologyLabel = "B"
                        break
                    case CODE_128_CODE_C:
                        characterText = CODE_128_CODE_C_ENCODING[characterIndex]
                        symbologyLabel = "C"
                        break
                    default:
                        characterText = CODE_128_CODE_C_ENCODING[characterIndex]
                        break
                }
                break
            case RM4SCC:
                this.renderBarsRM4SCC(x, characterIndex, lCol, dCol, barHeight)
                characterWidth = 8
                switch (characterIndex) {
                    case 36:
                        characterText = "START"
                        break
                    case 37:
                        characterText = "STOP"
                        break
                    default:
                        characterText = RM4SCC_ENCODING[characterIndex]
                        break
                }
                break
        }

        push()
        stroke(dCol)
        fill(lCol)
        textAlign(CENTER, TOP)
        textSize(13)
        if (renderText) text(`${hideData ? "?" : characterText}\n${hideData ? "?" : symbologyLabel}`, x + xOffset + this.barWidth * characterWidth / 2, this.y + barHeight + 20)
        pop()
    }

    renderCode128(compareText, hideTranscription, renderCompareText) {
        this.renderCharacter(0, this.startcode, CODE_128, this.highlightSections ? this.startColor : undefined, this.highlightSections ? this.startColorB : undefined)
        let checksum = this.startcode
        let barPos = 1
        let code
        let tempcode = false
        if (this.startcode === 103) code = CODE_128_CODE_A
        else if (this.startcode === 104) code = CODE_128_CODE_B
        else if (this.startcode === 105) code = CODE_128_CODE_C
        else console.error(`${this} is configured with an invalid startcode (${this.startcode})`)

        let i = 0
        for (let characterCode of this.data) {
            let colorW, colorB
            let maskData = false
            if (compareText.length < barPos) {
                colorW = this.dataColor
                colorB = this.dataColorB
                maskData = hideTranscription
            } else {
                if (parseInt(compareText[barPos - 1]) === characterCode) {
                    colorW = color(0, 255, 0)
                    colorB = color(0, 25, 25)
                } else {
                    colorW = color(255, 0, 0)
                    colorB = color(25, 0, 25)
                }
            }

            this.renderCharacter(barPos * 11, characterCode, tempcode ? tempcode : code, this.highlightSections ? colorW : undefined, this.highlightSections ? colorB : undefined, false, maskData)
            if (renderCompareText) this.renderCharacter(barPos * 11, compareText[i] ? compareText[i] : characterCode, tempcode ? tempcode : code, this.highlightSections ? colorW : undefined, this.highlightSections ? colorB : undefined, false, maskData, this.height / 2, false)
            checksum += characterCode * barPos
            barPos++

            tempcode = false
            if (characterCode === 98 && code === CODE_128_CODE_A) tempcode = CODE_128_CODE_B
            if (characterCode === 98 && code === CODE_128_CODE_B) tempcode = CODE_128_CODE_A
            if (characterCode === 99 && code !== CODE_128_CODE_C) code = CODE_128_CODE_C
            if (characterCode === 100 && code !== CODE_128_CODE_B) code = CODE_128_CODE_B
            if (characterCode === 101 && code !== CODE_128_CODE_A) code = CODE_128_CODE_A
            i++
        }

        checksum %= 103
        this.renderCharacter(barPos * 11, checksum, CODE_128, this.highlightSections ? this.checkColor : undefined, this.highlightSections ? this.checkColorB : undefined, true)
        barPos++

        this.renderCharacter(barPos * 11, CODE_128_WIDTHS.length - 1, CODE_128, this.highlightSections ? this.stopColor : undefined, this.highlightSections ? this.stopColorB : undefined)
    }

    renderCodeRM4SCC(compareText, hideTranscription, renderCompareText) {
        this.renderCharacter(0, 36, RM4SCC, this.highlightSections ? this.startColor : undefined, this.highlightSections ? this.startColorB : undefined, undefined, undefined, undefined, undefined, -this.barWidth * 3)
        let barPos = 0
        let checksumTop = 0
        let checksumBottom = 0
        for (let characterCode of this.data) {
            let colorW, colorB
            let maskData = false
            if (compareText.length <= barPos) {
                colorW = this.dataColor
                colorB = this.dataColorB
                maskData = hideTranscription
            } else {
                if (parseInt(compareText[barPos]) === characterCode) {
                    colorW = color(0, 255, 0)
                    colorB = color(0, 25, 25)
                } else {
                    colorW = color(255, 0, 0)
                    colorB = color(25, 0, 25)
                }
            }
            this.renderCharacter(2 + barPos++ * 8, characterCode, RM4SCC, this.highlightSections ? colorW : undefined, this.highlightSections ? colorB : undefined, false, maskData)

            checksumTop += RM4SCC_CHECKSUM_VALUE_TOP[characterCode]
            checksumBottom += RM4SCC_CHECKSUM_VALUE_BOTTOM[characterCode]
        }
        checksumTop = (checksumTop % 6 === 0 ? 5 : checksumTop % 6 - 1)
        checksumBottom = (checksumBottom % 6 === 0 ? 5 : checksumBottom % 6 - 1)
        let checksumCharacterCode = checksumBottom + checksumTop * 6
        this.renderCharacter(2 + barPos++ * 8, checksumCharacterCode, RM4SCC, this.highlightSections ? this.checkColor : undefined, this.highlightSections ? this.checkColorB : undefined)
        this.renderCharacter(2 + barPos * 8, 37, RM4SCC, this.highlightSections ? this.stopColor : undefined, this.highlightSections ? this.stopColorB : undefined, undefined, undefined, undefined, undefined, -this.barWidth * 3)
    }

    render(compareText, hideTranscription, renderCompareText = false) {
        switch (this.symbology) {
            case CODE_128:
                this.renderCode128(compareText, hideTranscription, renderCompareText)
                break
            case RM4SCC:
                this.renderCodeRM4SCC(compareText, hideTranscription, renderCompareText)
                break
        }
    }
}