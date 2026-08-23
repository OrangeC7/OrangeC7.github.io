const CLASS_SECTION = "settings-section"
const CLASS_COLUMN = "settings-column"
const CLASS_SETTING = "setting"
const CLASS_TITLE = "settings-title"
const SETTINGS_LABEL = "settings-label"

const BUTTON = "button"
const CHECKBOX = "checkbox"
const RADIO = "radio"
const SLIDER = "slider"
const DROPDOWN = "dropdown"

const SETTINGS_MENU = [
    {
        type: CLASS_SECTION,
        contents: [
            {
                type: CLASS_COLUMN,
                title: "Settings",
                contents: [
                    {
                        type: CLASS_SETTING,
                        inputType: "button",
                        id: "settingsbutton",
                        label: "this does nothing",
                    },
                ]
            },
        ]
    },
]

function createMenuElement(parent, elementType, elementClass) {
    let newElement = document.createElement(elementType)
    if (elementClass) newElement.setAttribute("class", elementClass)
    parent.append(newElement)
    return newElement
}

function createMenuSection(parent) {
    return createMenuElement(parent, "div", CLASS_SECTION)
}

function createMenuTitle(parent, title) {
    let titleElement = createMenuElement(parent, "p", CLASS_TITLE)
    titleElement.textContent = title
    return titleElement
}

function createMenuLabel(parent, id, label) {
    let newLabel = createMenuElement(parent, "label")
    newLabel.setAttribute("for", id)
    newLabel.textContent = label
    return newLabel
}

function createMenuColumn(parent, title) {
    let newColumn = createMenuElement(parent, "div", CLASS_COLUMN)
    createMenuTitle(newColumn, title)
    return newColumn
}

let settingsArea = document.getElementsByClassName("settings-area")[0]

let settings = {
    clearMenu: function () {
        let elements = settingsArea.children
        let len = elements.length
        for (let i = 0; i < len; i++) {
            elements[0].remove()
        }
    },
    initialize: function () {
        this.clearMenu()
        recursiveInitialize(settingsArea, SETTINGS_MENU, 6)
    },
    conditions: [],
    update: function () {
        function hideSetting(settingDiv) {
            if (!settingDiv.attributes.getNamedItem("style")) settingDiv.setAttribute("style", "visibility:hidden; max-height:0; max-width:0; margin:0;") // https://stackoverflow.com/a/59702383
        }
        function showSetting(settingDiv) {
            if (settingDiv.attributes.getNamedItem("style")) settingDiv.removeAttribute("style")
        }
        for (let conditional of this.conditions) {
            let settingDiv = this.handlers[conditional.id].settingDiv
            if (settings[conditional.conditionID] === conditional.conditionValue) {
                if (conditional.showByDefault) {
                    hideSetting(settingDiv)
                } else {
                    showSetting(settingDiv)
                }
            } else {
                if (conditional.showByDefault) {
                    showSetting(settingDiv)
                } else {
                    hideSetting(settingDiv)
                }
            }
        }
    },
    handlers: {},
    radioGroups: {},
}

class MenuSetting {
    constructor(parent, id, label = id, createLabel = true) {
        this.settingDiv = createMenuElement(parent, "div", CLASS_SETTING)
        this.id = id
        this.label = label
        if (createLabel) createMenuLabel(this.settingDiv, id, label)
        settings.handlers[id] = this
    }
}

class SettingsButton extends MenuSetting {
    constructor(parent, id, label) {
        super(parent, id, label, false)
        this.element = createMenuElement(this.settingDiv, "button")
        this.element.setAttribute("id", id)
        this.element.textContent = label
    }
    setBehaviour(f) {
        this.element.onclick = f
    }
}

class SettingsCheckbox extends MenuSetting {
    constructor(parent, id, isChecked = false, label) {
        super(parent, id, label)
        this.element = createMenuElement(this.settingDiv, "input")
        this.element.setAttribute("type", "checkbox")
        this.element.setAttribute("id", id)
        if (isChecked) this.element.setAttribute("checked", isChecked)
        settings[id] = isChecked
        this.element.oninput = function () {
            settings[id] = this.checked
        }
    }
    flip() {
        this.element.checked = !this.element.checked
        this.element.oninput()
    }
    check() {
        this.element.checked = true
        this.element.oninput()
    }
    uncheck() {
        this.element.checked = false
        this.element.oninput()
    }
}

class SettingsRadio extends SettingsCheckbox {
    constructor(parent, id, name, isChecked = false, label) {
        super(parent, id, isChecked, label)
        this.element.setAttribute("type", "radio")
        this.element.setAttribute("name", name)
        if (!settings.radioGroups[name]) settings.radioGroups[name] = {}
        settings.radioGroups[name][id] = this
        this.element.oninput = function () {
            for (let radioButton in settings.radioGroups[name]) {
                settings[settings.radioGroups[name][radioButton].id] = false
            }
            settings[id] = this.checked
        }
    }
}

class SettingsSlider extends MenuSetting {
    constructor(parent, id, min, max, value, step, label) {
        super(parent, id, label)
        this.sliderSection = createMenuSection(this.settingDiv)
        let numberDisplay = createMenuElement(this.sliderSection, "span")
        numberDisplay.innerText = value
        this.numberDisplay = numberDisplay
        this.element = createMenuElement(this.sliderSection, "input", "range")
        this.element.setAttribute("type", "range")
        this.element.setAttribute("id", id)
        this.element.setAttribute("min", min)
        this.element.setAttribute("max", max)
        this.element.setAttribute("value", value)
        this.element.setAttribute("step", step)
        settings[id] = value
        this.element.oninput = function () {
            numberDisplay.innerText = this.value
            settings[id] = parseInt(this.value)
        }
    }
    setValue(n) {
        this.element.value = n
        this.element.oninput()
    }
}

class SettingsDropdown extends MenuSetting {
    constructor(parent, id, options, label) {
        super(parent, id, label)
        this.element = createMenuElement(this.settingDiv, "select")
        this.element.setAttribute("id", id)
        this.dropdownOptions = []
        for (let option of options) {
            let newOption = createMenuElement(this.element, "option")
            newOption.setAttribute("value", option.value)
            if (option.selected) {
                newOption.setAttribute("selected", "selected")
                settings[id] = option.value
            }
            newOption.textContent = option.label
            this.dropdownOptions.push(newOption)
        }
        this.element.oninput = function () {
            settings[id] = this.value
        }
    }
}

function recursiveInitialize(parent, settingsElements, depth) {
    if (depth <= 0) {
        console.error("Settings menu is deeper than expected! Returning early.", parent, settingsElements, depth)
        return
    }
    if (!settingsElements) {
        console.error(`Section contents is not defined`, parent, depth)
        return
    }

    for (let element of settingsElements) {
        if (!element.type) {
            console.error(`Settings menu element does not have a 'type' property`, element)
            return
        }
        switch (element.type) {
            case CLASS_SECTION:
                let newSection = createMenuSection(parent)
                if (element.id) {
                    newSection.setAttribute("id", element.id)
                    settings.handlers[element.id] = {
                        settingDiv: newSection
                    }
                }
                recursiveInitialize(newSection, element.contents, depth - 1)
                break
            case CLASS_COLUMN:
                let newColumn = createMenuColumn(parent, element.title)
                if (element.id) {
                    newColumn.setAttribute("id", element.id)
                    settings.handlers[element.id] = {
                        settingDiv: newColumn
                    }
                }
                recursiveInitialize(newColumn, element.contents, depth - 1)
                break
            case CLASS_SETTING:
                switch (element.inputType) {
                    case "button":
                        new SettingsButton(parent, element.id, element.label)
                        break
                    case "checkbox":
                        new SettingsCheckbox(parent, element.id, element.default, element.label)
                        break
                    case "radio":
                        new SettingsRadio(parent, element.id, element.name, element.default, element.label)
                        break
                    case "slider":
                        new SettingsSlider(parent, element.id, element.min, element.max, element.default, element.step, element.label)
                        break
                    case "dropdown":
                        new SettingsDropdown(parent, element.id, element.options, element.label)
                        break
                }
                break
            case CLASS_TITLE:
                let newTitle = createMenuTitle(parent, element.title)
                if (element.id) {
                    newTitle.setAttribute("id", element.id)
                    settings.handlers[element.id] = {
                        settingDiv: newTitle
                    }
                }
                break
            case SETTINGS_LABEL:
                createMenuLabel(parent, element.id, element.label)
                break
            default:
                console.error(`Unrecognized settings menu element ${element.type}`, element)
                break
        }
        if (element.conditions) {
            if (!element.id) {
                console.error(`${element} does not have an id associated with it, but contains a 'conditions' property! It cannot be conditionally shown or hidden without one.`, element.conditions)
            }
            settings.conditions.push({
                id: element.id,
                handler: settings.handlers[element.id],
                conditionID: element.conditions.conditionID,
                conditionValue: element.conditions.conditionValue,
                showByDefault: element.conditions.showByDefault
            })
        }
    }
}