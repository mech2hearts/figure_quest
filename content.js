/*chrome.runtime.onMessage.addListener(gotMessage)
function gotMessage(request, sender, sendResponse){
    console.log(message.txt)
}*/

/*var port= chrome.extension.connect({
    name: "Sample"
})

port.postMessage(peach)
port.onMessage.addListener(function(msg){
    console.log("Message received")
})*/


console.log('hey')
chrome.runtime.sendMessage({code: document.getElementsByClassName("product-details-value")[0].textContent}, function(response){
    console.log(response.info)
})

var port= chrome.extension.connect({
    name: "Sample"
})

port.postMessage(document.getElementsByClassName("product-details-value")[0].textContent)
port.onMessage.addListener(function(msg){
    console.log(msg)
})