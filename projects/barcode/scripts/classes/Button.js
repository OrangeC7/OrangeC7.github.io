class Button {
    constructor(x, y, w, h, n = "", f = () => { console.log("no behaviour assigned", this) }) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.characterCode = n
        this.behaviour = f
        this.mouseWasPressed = false
        this.behaviour = f
        this.fillColors = {
            default: 200,
            hover: 255,
            pressed: 150
        }
        this.strokeColors = {
            default: 200,
            hover: 255,
            pressed: 150
        }
        this.textColor = 0
    }

    isOnButton(x, y) {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
    }

    setBehaviour(f) {
        this.behaviour = f
    }

    setCharacter(n) {
        this.characterCode = n
    }

    activate() {
        this.behaviour(this)
    }

    update(mx, my, mp) {
        if (!mp && this.mouseWasPressed && this.isOnButton(mx, my)) {
            this.activate()
        }
        this.mouseWasPressed = mp
    }

    render(mx, my, mp, characterTable) {
        push()

        if (this.isOnButton(mx, my)) {
            if (mp) {
                fill(this.fillColors.pressed)
                stroke(this.strokeColors.pressed)
            } else {
                fill(this.fillColors.hover)
                stroke(this.strokeColors.hover)
            }
        } else {
            fill(this.fillColors.default)
            stroke(this.strokeColors.default)
        }

        rect(this.x, this.y, this.w, this.h)

        fill(this.textColor)
        noStroke()
        textAlign(CENTER, CENTER)
        text(characterTable[this.characterCode], this.x + this.w / 2, this.y + this.h / 2)

        pop()
    }
}