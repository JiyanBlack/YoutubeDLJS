var Router = require('./router');
var archiver = require('archiver');
var mime = require('mime');
var http = require('http');
var ecstatic = require("ecstatic");
var fs = require('fs');
var fileServer = ecstatic({ root: "./public" });
//user put a series of youtube url
//server side gets a serious of youtube url, validate it --> {urls:[url1,url2,url3...]}
//package it up as downloader
//automatically begin download the downloader
//and show the instruction of how to use downloader...

function respond(response, status, data, type) {
  response.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  response.end(data);
}


var router = new Router();

//data Structure : {timeStamp:Date.now(), urls:["url1","url2"]}

function readJSONStream(stream, callback) {
  var data = "";
  stream.on("data", function (chunk) {
    data += chunk;
  });
  stream.on("end", function () {
    var result, error;
    try { result = JSON.parse(data); } catch (e) { error = e; }
    callback(error, result);
  });
  stream.on("error", function (error) {
    callback(error);
  });
}



router.add("POST", /^\//, function (request, response) {
  readJSONStream(request, function (error, youtubeURLs) {
    if (error) respond(response, 400, error.toString());
    else {
      let zipFile = archiver('zip');
      let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
      youtubeURLs.urls.forEach(url => {
        if (!validationReg.exec(url)) throw new Error('Invalid Youtube URL!');
      });
      let timeStamp = youtubeURLs.timeStamp;
      // console.log(youtubeURLs);
      zipFile.append(JSON.stringify(youtubeURLs), { name: 'urls.json' }).directory('./server/downloader/', './downloader').finalize();
      let outputPath = './public/' + timeStamp.toString() + '.zip'
      let output = fs.createWriteStream(outputPath);
      zipFile.pipe(output);

      output.on("close", function () {
        // console.log("Sending " + timeStamp + ".zip");
        respond(response, 200, JSON.stringify({ name: timeStamp + ".zip" }),
          "application/json");
      });
    }
  })
})


http.createServer(function (request, response) {
  if (!router.routing(request, response)) {
    // console.log("No router found!")
    fileServer(request, response);
  }
}).listen(8000);
console.log('Listening on port 8000...')
