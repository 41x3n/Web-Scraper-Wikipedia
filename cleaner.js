const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

const json2csvParser = new Json2csvParser();


var data = JSON.parse(fs.readFileSync('dataset.json').toString());

let dataA = [];

for(let D of data){
    let data = D.dataA;


    let month, year;

    let occ = D.linkTitle;
    occ = occ.trim();
    let arr = occ.split(/ /);


    month = arr[0];
    year = arr[1];

    let date, type, dead, injured, location, details, perpetrator, partOf;

    for(let D of data) {

        //Date
        let data1 = D.date;
        data1 = data1.replace(/[^0-9 ]/g,' ');
        data1 = data1.trim();
        let arr1 = data1.split(/ /);
        // console.log(arr1[0]);
        date = arr1[0];

        type = D.type;

        //dead
        let data2 = D.dead;
        data2 = data2.replace(/[^0-9 ]/g,' ');
        data2 = data2.trim();
        let arr2 = data2.split(/ /);
        // console.log(arr2[0]);
        dead = arr2[0];

        //injured
        let data3 = D.injured;
        data3 = data3.replace(/[^0-9 ]/g,' ');
        data3 = data3.trim();
        let arr3 = data3.split(/ /);
        if(arr3[0] == "")
            arr3[0] = "0";
        // console.log(arr3[0]);
        injured = arr3[0];

        location = D.location;

        details = D.details;

        //perpetrator
        let data4 = D.perpetrator;
        data4 = data4.replace(" (suspected)", "");
        data4 = data4.replace("(suspected)", "");
        data4 = data4.replace(" (claimed)", "");
        data4 = data4.replace(" (Claimed)", "");
        let arr4 = data4.split('[');
        // console.log(arr4[0]);
        perpetrator = arr4[0].trim();

        partOf = D.partOf;


        let datax = {
            month: month,
            year: year,
            date: date,
            type: type,
            dead: dead,
            injured: injured,
            location: location,
            details: details,
            perpetrator: perpetrator,
            partOf: partOf
        };

        // console.log(datax);
        // console.log("----------------------");

        dataA.push(datax);


    }
    // // break;
    // console.log("==========");

}

console.log(dataA);

console.log("==============================");
console.log("<- Writing a dataset.");
console.log("==============================");

fs.writeFileSync('./datasetX.json', JSON.stringify(dataA), 'utf-8');

console.log("==============================");
console.log("<- Finished writing a dataset.");
console.log("==============================");

const csv = json2csvParser.parse(dataA);
console.log("==============================");
console.log("Started writing CSV file");
fs.writeFileSync('datacsv', csv, 'utf-8');
console.log("Finished writing CSV file");
console.log("==============================");