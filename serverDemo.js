var Router = require('./router');
var router = new Router();

router.add("POST", /^\/$/, function (request, response) {
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
      // zipFile.pipe(output);
      let jsonInfo = JSON.stringify({ name: timeStamp + ".zip" });
      console.log("Sending: " + jsonInfo);
      respond(response, 204, jsonInfo, 'application/json');
      // output.on("close", function () {
      //   console.log("Sending " + jsonInfo);
      //   respond(response, 204, jsonInfo);
      // });
    }
  })
})


http.createServer(function (request, response) {
  if (!router.routing(request, response)) {
    fileServer(request, response);
  }
}).listen(8000);
console.log('Listening on port 8000...')
