chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved " + msg);


        var request = new XMLHttpRequest();

        request.open("POST", "http://localhost:5000/search", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({code: msg}));
        request.onload = function () {
            if (request.readyState === request.DONE) {
                if (request.status === 200) {
                    
                    var data = JSON.parse(request.response)
                    console.log(data);
                    chrome.storage.local.set(data,function(){
                        console.log('saved')
                    })
                }
            }
        };
    });
});

