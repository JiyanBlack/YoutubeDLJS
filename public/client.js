function request(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.method || "GET", options.pathname, true);
  req.addEventListener("load", function () {
    if (req.status < 400) {
      console.log(req.responseText || "no input response");
      callback(null, req.responseText);
    } else
      callback(new Error("Request failed: " + req.statusText));
  });
  req.addEventListener("error", function () {
    callback(new Error("Network error"));
  });
  req.send(options.body || null);
}


var submit = document.getElementById('submitURL');
submit.addEventListener('click', function (event) {
  let json_url = { 'timeStamp': Date.now(), 'urls': ['https://www.youtube.com/watch?v=zdVYVSdDAXs'] }
    // console.log(JSON.stringify(json_url));
  request({ method: "POST", pathname: '/', body: JSON.stringify(json_url) }, function (error, response) {
    urlInfo = JSON.parse(response);
    console.log(urlInfo);
    document.location = (urlInfo.name);
  });
})
