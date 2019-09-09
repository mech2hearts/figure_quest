
window.onload =
    chrome.storage.local.get(null, function(result){
        console.log(result)
        $('#plazaPrice').text(result.stores[0].price+"JPY")
        $('#hljPrice').text(result.stores[1].price+"JPY")
    })
