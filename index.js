const puppeteer = require('puppeteer');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

const json2csvParser = new Json2csvParser();

const fLink = 'https://en.wikipedia.org/wiki/List_of_terrorist_incidents';
let links = [];
let dataset = [];


(async () => {




    // GETTING THE LINKS


    try {
        const browser = await puppeteer.launch({
            headless: false
        });
    
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(fLink, {waitUntil: 'networkidle0'});
        
        await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.3.1.min.js'});

        console.log("<- Retrieving a list of links.");

        let listArray = await page.$$('#mw-content-text > div > div:nth-child(21) > ul > li');


        for(let link of listArray){

            let url = await link.$eval('a', element => element.getAttribute('href'));
            let title = await link.$eval('a', element => element.getAttribute('title'));

            url = "https://en.wikipedia.org" + url;

            console.log("==============================");
            console.log({
                url,
                title
            });
            console.log("==============================");

            links.push({
                url,
                title
            });
        }

        console.log("<- Finished retrieving a list of links.");

        links = links.slice(49, 97);   //used to slice array

        console.log("<- Finished slicing the list of links.");

        console.log("==============================");

        console.log("<- Writing a list of links into linkList file.");

        fs.writeFileSync('./linkList.json', JSON.stringify(links), 'utf-8');

        console.log("<- Finished writing a list of links into linkList file.");

        console.log("==============================");

        await browser.close();
    
    } catch (error) {
        console.error();
    }


    //GETTING THE DATA

    (async () => {
        try {

            for(let link of links){
                const browser = await puppeteer.launch({
                    headless: false
                });
                const page = await browser.newPage();
                await page.setViewport({ width: 1280, height: 800 });

                console.log("==============================");
                console.log("Travelling to link:", link);
                console.log("==============================");
        
                await page.goto(link.url, {waitUntil: 'networkidle2'});

                let rowArray = await page.$$("table[class='wikitable sortable jquery-tablesorter'] > tbody > tr");

                let dataA = [];

                for(let row of rowArray){
                    // let date = await row.$eval('td:nth-child(1)', element => element.textContent);
                    // date = date.substring(0, date.length - 1);
                    // let type = await row.$eval('td:nth-child(2)', element => element.textContent);
                    // type = type.substring(0, type.length - 1);
                    // let dead = await row.$eval('td:nth-child(3)', element => element.textContent);
                    // dead = dead.substring(0, dead.length - 1);
                    // let injured = await row.$eval('td:nth-child(4)', element => element.textContent);
                    // injured = injured.substring(0, injured.length - 1);
                    // let location = await row.$eval('td:nth-child(5)', element => element.textContent);
                    // location = location.substring(0, location.length - 1);
                    // let details = await row.$eval('td:nth-child(6)', element => element.textContent);
                    // details = details.substring(0, details.length - 1);
                    // let perpetrator = await row.$eval('td:nth-child(7)', element => element.textContent);
                    // perpetrator = perpetrator.substring(0, perpetrator.length - 1);
                    // let partOf = await row.$eval('td:nth-child(8)', element => element.textContent);
                    // partOf = partOf.substring(0, partOf.length - 1);
                    
                    let date, type, dead, injured, location, details, perpetrator, partOf;

                    if (await row.$('td:nth-child(1)') != null) {
                        date = await row.$eval('td:nth-child(1)', element => element.textContent);
                        date = date.substring(0, date.length - 1);
                    }
                    else {
                        date = "";
                    }

                    if (await row.$('td:nth-child(2)') != null) {
                        type = await row.$eval('td:nth-child(2)', element => element.textContent);
                        type = type.substring(0, type.length - 1);
                    }
                    else {
                        type = "";
                    }

                    if (await row.$('td:nth-child(3)') != null) {
                        dead = await row.$eval('td:nth-child(3)', element => element.textContent);
                        dead = dead.substring(0, dead.length - 1);
                    }
                    else {
                        dead = "";
                    }

                    if (await row.$('td:nth-child(4)') != null) {
                        injured = await row.$eval('td:nth-child(4)', element => element.textContent);
                        injured = injured.substring(0, injured.length - 1);
                    }
                    else {
                        injured = "";
                    }

                    if (await row.$('td:nth-child(5)') != null) {
                        location = await row.$eval('td:nth-child(5)', element => element.textContent);
                        location = location.substring(0, location.length - 1);
                    }
                    else {
                        location = "";
                    }

                    if (await row.$('td:nth-child(6)') != null) {
                        details = await row.$eval('td:nth-child(6)', element => element.textContent);
                        details = details.substring(0, details.length - 1);
                    }
                    else {
                        details = "";
                    }

                    if (await row.$('td:nth-child(7)') != null) {
                        perpetrator = await row.$eval('td:nth-child(7)', element => element.textContent);
                        perpetrator = perpetrator.substring(0, perpetrator.length - 1);
                    }
                    else {
                        perpetrator = "";
                    }


                    if (await row.$('td:nth-child(8)') != null) {
                        partOf = await row.$eval('td:nth-child(8)', element => element.textContent);
                        partOf = partOf.substring(0, partOf.length - 1);
                    }
                    else {
                        partOf = "";
                    }

                    console.log("==============================");
                    console.log({date, type, dead, injured, location, details, perpetrator, partOf});
                    console.log("==============================");

                    dataA.push({date, type, dead, injured, location, details, perpetrator, partOf});
                }


                let linkTitle = link.title;

                linkTitle = linkTitle.substring('List of terrorist incidents in '.length);

                let file = linkTitle + '.json';
                let file2 = linkTitle + '.csv';

                console.log("==============================");
                console.log("Started writing JSON file");
                fs.writeFileSync(`./json/${file}`, JSON.stringify(dataA), 'utf-8');
                console.log("Finished writing JSON file");
                console.log("==============================");


                const csv = json2csvParser.parse(dataA);

                console.log("==============================");
                console.log("Started writing CSV file");
                fs.writeFileSync(`./csv/${file2}`, csv, 'utf-8');
                console.log("Finished writing CSV file");
                console.log("==============================");

                dataset.push({linkTitle, dataA });



                console.log("==============================");
                console.log(linkTitle + " -> completed");
                console.log("==============================");


                await browser.close();
            }


            console.log("==============================");
            console.log("<- Writing a dataset.");
            console.log("==============================");

            fs.writeFileSync('./dataset.json', JSON.stringify(dataset), 'utf-8');

            console.log("==============================");
            console.log("<- Finished writing a dataset.");
            console.log("==============================");

        } catch (error) {
            console.error();
        }
    })();

})();