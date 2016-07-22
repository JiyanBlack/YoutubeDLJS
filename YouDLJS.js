var Router = require('./router');

//user put a series of youtube url
//server side gets a serious of youtube url, validate it --> {urls:[url1,url2,url3...]}
//package it up as downloader
//automatically begin download the downloader
//and show the instruction of how to use downloader...

function respond(response, statusCode, data, type) {
  response.writeHead(statusCode, { "Conten-Type": type || "text/plain" });
  response.end(data);
}

var route = new Router();

function readJSONStream(stream, callback) {
  let data = "";
  stream.on("data", function (chunk) {
    data += chunk;
  });
  stream.on("end", function () {
    let youtubeURLs, error;
    try {
      let youtubeURLs = JSON.parse(data).urls;
      let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
      youtubeURLs.forEach(url => {
        if (!validationReg.exec(url)) throw new Error('Invalid Youtube URL!');
      });
    } catch (e) {
      error = e;
    }
    callback(error, youtubeURLs);
  })
  stream.on('error', function (error) {
    callback(error);
  })
}


router.add("PUT", /^\/sendURL\/(d+)$/, function (request, response, timeStamp) {
  readJSONStream(request, function (error, youtubeURLs) {
    if (error) respond(response, 400, error.toString());
    else {
      generateZip(youtubeURLs, timeStamp);
    }
  })
})
