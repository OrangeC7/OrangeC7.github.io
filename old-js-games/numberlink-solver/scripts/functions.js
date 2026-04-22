function vecAdd(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

function vecDiff(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

function vecMultScalar(v, s) {
    return {
        x: v.x * s,
        y: v.y * s
    }
}

function vecPythagoras(a, b) {
    let aSquared = Math.abs(a.x - b.x) * Math.abs(a.x - b.x)
    let bSquared = Math.abs(a.y - b.y) * Math.abs(a.y - b.y)
    return Math.sqrt(aSquared + bSquared)
}

function vecLerp(a, b, n) {
    return {
        x: a.x + (b.x - a.x) * n,
        y: a.y + (b.y - a.y) * n
    }
}

function vecRound(v) {
    return {
        x: Math.round(v.x),
        y: Math.round(v.y)
    }
}

function spliceRandomIndex(arr) {
    return arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
}

function sliceRandomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

// in collaboration with Stack Overflow: https://stackoverflow.com/a/1885569
function arrayAND(arr1, arr2) {
    return arr1.filter(value => arr2.includes(value))
}

const mapRange = (value, oldMin, oldMax, newMin, newMax) => ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;