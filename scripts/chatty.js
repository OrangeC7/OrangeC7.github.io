// This is my own project that I started with the pj.js web editor. (editor.p5js.org)
// A link to the original sketch is here: https://editor.p5js.org/OrangeC7/sketches/HyW0INR07

let chats = {
  inputs: [],
  outputs: []
}

function setup() {

  // Functionality for chat system

  document.getElementById("chat_submit").onclick = function() {
    let input = getInput()
    // console.log(input)

    setOutput(input)
  }

  document.getElementById("chat_adjust").onclick = function() {
    let input = getInput()
    let output = getOutput()

    chats.inputs.push(input)
    chats.outputs.push(output)
  }

  document.getElementById("return_chats").onclick = function() {
    let chatsJSON = JSON.stringify(chats)

    document.getElementById("chats_output").innerHTML = chatsJSON
  }

  document.getElementById("chats_load").onclick = function() {
    let chatsJSON = document.getElementById("chats_input").value

    chats = JSON.parse(chatsJSON)
  }

  // Enter triggers button
  // (Ripped from here: https://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box)
  
  // Chat
  document.getElementById("chat_input")
    .addEventListener("keyup", function(event) {
      event.preventDefault()
      if (event.keyCode === 13) {
        document.getElementById("chat_submit").click()
      }
    })
  
  // Adjust
  document.getElementById("chat_output")
    .addEventListener("keyup", function(event) {
      event.preventDefault()
      if (event.keyCode === 13) {
        document.getElementById("chat_adjust").click()
      }
    })
  
  // Chat Loader
  document.getElementById("chats_input")
    .addEventListener("keyup", function(event) {
      event.preventDefault()
      if (event.keyCode === 13) {
        document.getElementById("chats_load").click()
      }
    })

}

function getInput() {
  return document.getElementById("chat_input").value
}

function getOutput() {
  return document.getElementById("chat_output").value
}

function setOutput(input) {
  let index = chats.inputs.indexOf(input)
  let output = document.getElementById("chat_output")

  if (index == -1) {
    output.value = "Please type a response and click 'Adjust'"
  } else {
    output.value = chats.outputs[index]
  }
}