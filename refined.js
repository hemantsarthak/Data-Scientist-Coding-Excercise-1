const fs = require("fs")
const puppeteer = require('puppeteer');
const url = "https://teradek.com/collections/colr/products/anton-bauer-digital-battery?variant=14579104677933";

(async () => {  
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'load'});
    
    var Products = await page.evaluate(() => {
        //Array to be passed to json stingify vars
        var i = 0;
        var prodetails = [];
        //Watt Hour Options Loop
        for (var index = 1; index <=2; index++) {
            
            var click = document.querySelector('#AddToCartForm > div.variant_settings > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(' + index + ') > label').click();
            var Wh = document.querySelector('#AddToCartForm > div.variant_settings > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(' + index + ') > label').innerText;
            var Title = document.querySelector('#main > div > div > div:nth-child(3) > div > h1').innerText;
            //Mount Options Loop
            for (let cindex = 1; cindex <= 2; cindex++) {
            
                var click = document.querySelector('#AddToCartForm > div.variant_settings > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(' + cindex + ') > label').click();
                var mountOption = document.querySelector('#AddToCartForm > div.variant_settings > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child('+ cindex +') > label > span').innerText;
                var SKU = document.querySelector('#AddToCartForm > div.sku.grid__item.one-whole > span').innerText;      
                var mountOptionPrice = document.querySelector('#current-price').innerText;
                //Changing data to match json format given in google drive coding excercise doc       
                //var prod = Wh + ' ' + mountOption;
                
                prodetails [i] = {SKU, WattHr: Wh, Title: Title, Mount: mountOption, Price: mountOptionPrice};
                i ++;
            }; 
        };
        return prodetails; //prodetails array passed to Products var which is then put in json file using fs
    });
    //creating json file
    fs.writeFile("./refinedproducts.json", JSON.stringify({Products}, null, 1),  (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("refinedproducts.json created!");
    });
//close pupeeter broowser   
browser.close()
//thank you, please hire me, have a great day!
})();
