var http = require('http');
var request = http.request({
  hostname: 'localhost',
  path: 'myfile.txt',
  method: 'GET',
  port: 8000,
  function (response) {
    console.log(response)
  }
})
request.end();
