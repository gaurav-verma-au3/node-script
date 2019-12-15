const fs = require("fs");
const MONGO_STRING = require("./config");
const MongoClient = require("mongodb").MongoClient;

const url = MONGO_STRING.MONGO_STRING;
//const client = new MongoClient(url);
//console.log("Connected correctly to server");
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("states");

  var allStates = [];
  var final = [];

  fs.readFile("cities.json", "utf8", (err, data) => {
    let parsed = JSON.parse(data);

    for (var key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        allStates.push(parsed[key].state);
        // console.log(parsed[key]);
      }
    }
    const states = [...new Set(allStates)];

    states.forEach(element => {
      final.push({
        state: element,
        cities: []
      });
    });
    for (i = 0; i < final.length; i++) {
      let key = final[i].state;
      for (j = 0; j < parsed.length; j++) {
        if (parsed[j].state === key) {
          final[i].cities.push(parsed[j].name);
        }
      }
    }
    final.map(obj => {
      dbo.collection("statesCollection").insert(obj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  });
});
