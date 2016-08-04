//https://www.youtube.com/
function requestHandler(paras, callback) {
  //paras: method,url, headers;
  let req = new XMLHttpRequest();
  req.open(paras.method, paras.url, true);
  for (let header in paras.headers) {
    req.setRequestHeader(header, paras.headers[header]);
  }
  req.addEventListener('load', function () {
    if (req.status < 400) callback(null, req);
    else callback(new Error('Fail with status: ' + req.status));
  })
  req.addEventListener('error', function () {
    callback(new Error('Network error :-('));
  })
  req.send(paras.body || null);
}

let urlArray = { 'urls': [] };

$(document).ready(
  function () {
    //handle add url:
    $('#addButton').on('click', function () {
      // validate url
      let text = $('#textarea').val();
      try {
        testUrl(text);
        showurl(text);
        urlArray.urls.push(text);
      } catch (e) {
        showError(e);
      }
    });
    //handle submit:
    $('#submitButton').on('click', function () {
      // if (!urlArray) throw new Error('Empty urls!');
      let jsonUrl = JSON.stringify(urlArray)
      requestHandler({ method: 'POST', url: '/', headers: {}, body: jsonUrl }, function (error, req) {
        if (error) showError(error);
        else {
          //parse return timeStamp and file
          timeStamp = JSON.parse(req.responseText).name;
          window.open('/' + timeStamp);
        }
      })
    })
  }
)


function showError(e) {
  $('#error').text(e.toString()).slideDown();
}

function showurl(text) {
  $('#urlsInfo').after($('<p></p>').text(text));
}

function testUrl(text) {
  $('#error').slideUp();
  let match = /^http(s)?\:\/\/www\.youtube\.com/.exec(text);
  if (!match) throw new Error('Invalid url!');
  urlArray.urls.forEach(function (aUrl) {
    if (text == aUrl) throw new Error('This url already exists!');
  })
}
