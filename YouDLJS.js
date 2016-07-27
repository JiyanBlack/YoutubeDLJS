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

http.createServer(function (request, response) {
  if (!router.routing(request, response)) {
    // console.log("No router found!")
    fileServer(request, response);
  }
}).listen(8000);
console.log('Listening on port 8000...')

let router = new Router();
let zipFiles = Object.create(null);
let venv_win = fs.readFileSync('./server/venv_win.zip')

function respond(response, status, data, type) {
  response.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  response.end(data);
}

//data Structure : {timeStamp:Date.now(), urls:["url1","url2"]}

function readJSONStream(stream, callback) {
  let data = "";
  stream.on("data", function (chunk) {
    data += chunk;
  });
  stream.on("end", function () {
    let result, error;
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

      //validate urls:
      try {
        let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
        youtubeURLs.urls.forEach(url => {
          if (!validationReg.exec(url)) throw new Error('Invalid Youtube URL!');
        });
        if (youtubeURLs.urls.length <= 0) throw new Error('Invalid Youtube URL!')
      } catch (e) {
        respond(response, 400, e.toString());
      }

      //generate zipfiles for windows:
      let zipFile = archiver('zip');
      let timeStamp = (Math.floor(Date.now() * Math.random())).toString();

      zipFile.append(JSON.stringify(youtubeURLs), { name: 'urls.json' });
      zipFile.append(venv_win, { name: 'venv_win.zip' });
      zipFile.file('./server/unzip.exe', { name: 'unzip.exe' });
      zipFile.file('./server/util.dat', { name: 'util.dat' });
      zipFile.file('./server/RunMe.cmd', { name: 'RunMe.cmd' }).finalize();
      zipFiles[timeStamp] = zipFile;
      //send the file information to client:
      respond(response, 200, JSON.stringify({ name: timeStamp }),
        "application/json");
    };
  })
})


router.add("GET", /^\/(\d+)/, function (request, response, timeStamp) {
  // download handler:
  if (timeStamp in zipFiles) {
    // console.log(zipFiles);
    console.log("offering downloading: " + timeStamp);
    response.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-disposition': 'attachment; filename=' + timeStamp + '.zip'
    });
    zipFiles[timeStamp].pipe(response);
    zipFiles[timeStamp].on('finish', function () {
      delete zipFiles[timeStamp];
    })
  } else {
    respond(response, 404, "No such file fond!");
  }
})
