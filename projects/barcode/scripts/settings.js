const CLASS_SECTION = "settings-section"
const CLASS_COLUMN = "settings-column"
const CLASS_SETTING = "setting"
const CLASS_TITLE = "settings-title"
const SETTINGS_LABEL = "settings-label"

const MAX_MULTIPLE_CHOICES = 5

const SETTINGS_MENU = [
    {
        type: CLASS_SECTION,
        contents: [
            {
                type: CLASS_COLUMN,
                title: "Application Mode",
                contents: [
                    {
                        type: CLASS_SECTION,
                        contents: [
                            {
                                type: CLASS_SETTING,
                                inputType: "radio",
                                name: "appmode",
                                id: "appmodeRead",
                                label: "Read",
                                default: true,
                            },
                            {
                                type: CLASS_SETTING,
                                inputType: "radio",
                                name: "appmode",
                                id: "appmodeMultChoice",
                                label: "Multiple Choice",
                                default: false,
                            },
                            {
                                type: CLASS_SETTING,
                                inputType: "radio",
                                name: "appmode",
                                id: "appmodeRecall",
                                label: "Recall",
                                default: false,
                            },
                            {
                                type: CLASS_SETTING,
                                inputType: "radio",
                                name: "appmode",
                                id: "appmodeEdit",
                                label: "Edit",
                                default: false,
                            },
                        ]
                    },
                ]
            },
        ]
    },
    {
        type: CLASS_SECTION,
        id: "multipleChoiceModeSettings",
        conditions: {
            showByDefault: false,
            conditionID: "appmodeMultChoice",
            conditionValue: true
        },
        contents: [
            {
                type: CLASS_COLUMN,
                title: "Multiple Choice Mode Settings",
                contents: [
                    {
                        type: CLASS_SECTION,
                        contents: [
                            {
                                type: CLASS_SETTING,
                                inputType: "slider",
                                id: "numChoices",
                                label: "Number of choices available",
                                min: 2,
                                max: MAX_MULTIPLE_CHOICES,
                                default: 4,
                                step: 1,
                            },
                            {
                                type: CLASS_SETTING,
                                inputType: "button",
                                id: "resetScore",
                                label: "Reset score"
                            },
                        ]
                    },
                ]
            },
        ]
    },
    {
        type: CLASS_SECTION,
        id: "recallModeSettings",
        conditions: {
            showByDefault: false,
            conditionID: "appmodeRecall",
            conditionValue: true
        },
        contents: [
            {
                type: CLASS_COLUMN,
                title: "Recall Mode Settings",
                contents: [
                    {
                        type: SETTINGS_LABEL,
                        id: "recallModeWIPLabel",
                        label: "Nothing here yet"
                    },
                ]
            },
        ]
    },
    {
        type: CLASS_SECTION,
        contents: [
            {
                type: CLASS_COLUMN,
                title: "Display Settings",
                contents: [
                    {
                        type: CLASS_SETTING,
                        inputType: "slider",
                        id: "barcodeHeight",
                        label: "Barcode height",
                        min: 1,
                        max: 200,
                        default: 200,
                        step: 1,
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "slider",
                        id: "barWidth",
                        label: "Barcode bar width",
                        min: 1,
                        max: 20,
                        default: 5,
                        step: 1,
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "checkbox",
                        id: "highlightSections",
                        label: "Highlight barcode sections",
                        default: true,
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "checkbox",
                        id: "showAnswer",
                        label: "Show answer",
                        default: false,
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "button",
                        id: "randomize",
                        label: "Next barcode"
                    },
                ]
            },
            {
                type: CLASS_COLUMN,
                title: "Randomizer Settings",
                contents: [
                    {
                        type: CLASS_SETTING,
                        inputType: "slider",
                        id: "randomizerLength",
                        label: "Barcode length when randomized",
                        min: 1,
                        max: 12,
                        default: 1,
                        step: 1,
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "checkbox",
                        id: "autoRandomize",
                        label: "Generate barcode when done",
                        default: true,
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "slider",
                        id: "autoRandomizeTime",
                        label: "Next barcode timer (in milliseconds)",
                        min: 250,
                        max: 5000,
                        default: 2000,
                        step: 50,
                        conditions: {
                            showByDefault: false,
                            conditionID: "autoRandomize",
                            conditionValue: true
                        },
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "dropdown",
                        id: "code128CharacterSet",
                        label: "Character Set",
                        options: [
                            { value: "double_digits", label: "All CODE C numbers" },
                            { value: "single_digits", label: "Digits" },
                            { value: "uppercase_letters", label: "Uppercase letters" },
                            { value: "lowercase_letters", label: "Lowercase letters" },
                            { value: "all_symbols", label: "All symbols", selected: true },
                        ],
                        conditions: {
                            showByDefault: false,
                            conditionID: "symbology",
                            conditionValue: CODE_128
                        },
                    },
                    {
                        type: CLASS_SETTING,
                        inputType: "dropdown",
                        id: "rm4sccCharacterSet",
                        label: "Character Set",
                        options: [
                            { value: "rm4scc_digits", label: "Numbers" },
                            { value: "rm4scc_letters", label: "Letters" },
                            { value: "all_symbols", label: "Numbers and letters", selected: true },
                        ],
                        conditions: {
                            showByDefault: false,
                            conditionID: "symbology",
                            conditionValue: RM4SCC
                        },
                    },
                ]
            },
        ]
    },
    {
        type: CLASS_SECTION,
        contents: [
            {
                type: CLASS_COLUMN,
                title: "Barcode Settings",
                contents: [
                    {
                        type: CLASS_SECTION,
                        contents: [
                            {
                                type: CLASS_SETTING,
                                inputType: "dropdown",
                                id: "symbology",
                                label: "Symbology (Barcode Type)",
                                options: [
                                    { value: CODE_128, label: "Code 128", selected: true },
                                    { value: "upc", label: "UPC-12" },
                                    { value: "ean", label: "EAN-13" },
                                    { value: "codabar", label: "Codabar" },
                                    { value: "usps", label: "USPS IMb" },
                                    { value: "upu", label: "UPU S18" },
                                    { value: RM4SCC, label: "Royal Mail RM4SCC" },
                                    { value: "postbar", label: "Canada Post PostBar" },
                                ]
                            },
                            {
                                type: CLASS_SETTING,
                                inputType: "dropdown",
                                id: "code128startcode",
                                label: "Code 128 start code",
                                options: [
                                    { value: "103", label: "Code A", selected: true },
                                    { value: "104", label: "Code B" },
                                    { value: "105", label: "Code C" },
                                ],
                                conditions: {
                                    showByDefault: false,
                                    conditionID: "symbology",
                                    conditionValue: "code128"
                                }
                            },
                        ]
                    },
                ]
            },
        ]
    },
    // {
    //     type: CLASS_SECTION,
    //     contents: [
    //         {
    //             type: CLASS_COLUMN,
    //             title: "Dev settings",
    //             contents: [
    //                 {
    //                     type: CLASS_SECTION,
    //                     contents: [
    //                         {
    //                             type: CLASS_SETTING,
    //                             inputType: "slider",
    //                             id: "testNumber",
    //                             label: "number",
    //                             min: 0,
    //                             max: 10,
    //                             default: 2,
    //                             step: 0.01,
    //                         },
    //                     ]
    //                 },
    //             ]
    //         },
    //     ]
    // },
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
        recursiveInitialize(settingsArea, SETTINGS_MENU, 5)
    },
    conditions: [],
    update: function () {
        function hideSetting(settingDiv) {
            if (!settingDiv.attributes.getNamedItem("style")) settingDiv.setAttribute("style", "visibility:hidden; max-height:0; margin:0;") // https://stackoverflow.com/a/59702383
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