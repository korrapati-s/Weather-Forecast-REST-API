

var express = require("express");
var app     = express();
var path    = require("path");
var fs = require('fs');
var bparser = require('body-parser');
var os = require('os');
var Converter  = require("csvtojson").Converter;

app.use(bparser.json());
app.use(bparser.urlencoded({ extended: true }));

var fileStream = fs.createReadStream("daily.csv");
var jsonData;
//new converter instance
var converter = new Converter({constructResult:true,noheader:false});

//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function (jsonObj) {
    jsonData = jsonObj
});
fileStream.pipe(converter);


app.get("/historical",(req,res) => {
    res.json(jsonData);
});

app.get("/historical/:data", (req,res) => {
  var data = req.params.data;
  var result,status;
  if(!isNaN(data)) {
      for (var i=0; i < jsonData.length; i++) {
        if(jsonData[i] == undefined) {
          result = 404;
	  //res.sendStatus(200);
        }
        else if(jsonData[i].DATE == data) {
          result = jsonData[i];//res.sendStatus(404);
          break;
        }
        else {
         result =  404;
	 //res.sendStatus(404);
        }
      }
    }

  res.send(result);
});

app.post("/historical", (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var data = JSON.stringify(req.body);
    jsonData.push(JSON.parse(data));
    res.status(201);
    res.send(req.body);
});

app.delete("/historical/:data" , (req,res) => {
  res.setHeader('Content-Type', 'text/html');
  var data = req.params.data; console.log(data);
  for (var i=0; i < jsonData.length; i++) {
     if(jsonData[i].DATE == data) { console.log(jsonData[i]);
      delete jsonData[i];
       res.sendStatus(200);
    }
  }
});

app.get("/forecast/:date", (req,res) => {
  var date = req.params.date;
  var result = [];
  for (var i=0; i < jsonData.length; i++) {
    if(jsonData[i]== undefined) {
      result[0] = "Date has been already deleted, Please try another date";
    }
    else if(jsonData[i].DATE == date) {
      for(var j=0; j<7; j++) {
      result[j] = jsonData[i+j];
      }
    }

    else {
      if(isNaN(date) || date.length!=8) {
        result[0] = "Invalid input";
      } else  {
        if(date.length == 8) {
           var dat = date.split("");
           dat[0] = 2;dat[1] = 0;dat[2] = 1; dat[3] = 5;
           var dat2 = dat.join("");
           var diff = date - dat2;
           if(jsonData[i].DATE == dat2) {
             for(var j=0; j<7; j++) {
               result[j] = jsonData[i+j];
               result[j].DATE = JSON.stringify(parseInt(result[j].DATE) + diff);
	       jsonData.push(result[j]);
             }
           }
        }
      }

    }
  }
  res.send(result);
});


app.listen(3000);
console.log("Running at Port 3000");
