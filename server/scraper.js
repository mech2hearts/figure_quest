const router = require('express').Router();
const cheerio = require("cheerio");
const Items = require('./Items.js')
const request = require('request')

let findRS = (code,company)=>{
    return new Promise((resolve, reject)=>{
        var storeItems=[]
        const rightStuf ='https://www.rightstufanime.com/search?keywords='
        const hlj = 'https://hlj.com/search/go?ts=custom&w='

        switch(company){
            case 'Plaza Japan':
                    var searchURL = 'plazajapan.com/'
                    var listingElement = '.facets-item-cell-grid-title'
                    var priceElement = '.product-views-price-lead'
                    break;
            case 'HobbyLink Japan':
                    var searchURL = 'https://hlj.co.jp/search/go?w='
                    var listingElement = '.product-item-link'
                    var priceElement = '.price'
                    break;
        }

        if(company=="HobbyLink Japan"){
            var searchURL = 'https://hlj.co.jp/search/go?w='
            var listingElement = '.product-item-link'
            var priceElement = '.price'

            request(searchURL+code, (err, res, html)=>{
            if(!err && res.statusCode==200){
                const $ = cheerio.load(html)
                const searchResult = $('.price').text().replace(/[^0-9\.]+/g, '').trim()
                const itemURL = $('.product-image').attr('href')
                


                var storeListing={
                    name: "HobbyLink Japan",
                    price: searchResult,
                    url: itemURL
                }
                resolve(storeListing);      
            } else {
                reject()
            }
        })
        }
        

        if(company=="Plaza Japan"){
            var searchURL = 'https://www.plazajapan.com/'
            request(searchURL+code, (err, res, html)=>{
                if(!err && res.statusCode==200){
                    const $ = cheerio.load(html)
                    
                    const offPrice = $('.price-value').first().text().replace(/[^0-9\.]+/g, '').trim()
                    /*const itemPrice = $('.price').text().replace(/\s/g, '').replace(offPrice,'').replace(/[^0-9\.]+/g, '')
                    //const link = searchURL+itemUrl.attr('href')
                    console.log(itemPrice)*/
                    var storeListing={
                        name: "Plaza Japan",
                        price: offPrice,
                        url: searchURL+code
                    }
                    resolve(storeListing);       
                } else {
                    reject()
                }
            })
        }
        
        
        
    })
}
    

let promiseFind = new Promise((resolve, reject)=>{

    let isClean = true;

    if(isClean){
        resolve();
    } else {
        reject();
    }
})

router.post("/", (req,res)=>{

    const itemCode = req.body.code;
    console.log(itemCode)
    var searchItem={}
    Items.findOne({id: itemCode}, (err, item)=>{
        if(!item){  //scrape websites

            var storeItems=[]
            findRS(itemCode,'Plaza Japan').then((fromResolve)=>{
                storeItems.push(fromResolve)
                findRS(itemCode, 'HobbyLink Japan').then((fromResolve)=>{
                    storeItems.push(fromResolve)
                    var lowest = 0
                    var low = 0
                    if(storeItems[0]<storeItems[1]){
                        lowest = storeItems[0]
                        low = storeItems[0]
                    } else {
                        lowest = storeItems[1]
                        low = storeItems[1]
                    }
                    var itemInfo = new Items ({
                        id: itemCode,
                        currentLow: low,
                        lowestEver: lowest,
                        stores: storeItems,
                    })
                    itemInfo.save().then(item=>{
                        res.send(item)
                    }).catch(err => console.log(err))                  
                })
            })
            
            
        } else {
            const halfDay = 60 * 60 * 12 * 1000
            if((Date.now()-item.time)>halfDay){
                var storeItems=[]
                findRS(itemCode,'Plaza Japan').then((fromResolve)=>{
                    storeItems.push(fromResolve)
                    findRS(itemCode, 'HobbyLink Japan').then((fromResolve)=>{
                        storeItems.push(fromResolve)
                        var lowest = 0
                        var low = 0
                        if(storeItems[0]<storeItems[1]){
                            lowest = storeItems[0]
                            low = storeItems[0]
                        } else {
                            lowest = storeItems[1]
                            low = storeItems[1]
                        }
                        var itemInfo = new Items ({
                            id: itemCode,
                            currentLow: low,
                            lowestEver: lowest,
                            stores: storeItems,
                            time: Date.now
                        })
                        itemInfo.update({id: itemCode}, itemInfo).then(item=>{
                            res.send(itemInfo)
                        }).catch(err => console.log(err))                  
                    })
                })
            } else {
                res.send(item)
            }
        }
    })
    
})


module.exports = router