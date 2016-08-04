function request(paras, options, callback) {
  let req = new XMLHttpRequest();
  req.open(paras[0], paras[1], true);
  for (let prop in options) {
    req.setRequestHeader(prop, options[prop]);
  }
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
  req.send(paras[2] || null);
}

let errorPara = document.getElementById('error');
let urlArray = [];
let textarea = document.getElementById('textarea');
let urlsPara = document.getElementById('urls');
let addButton = document.getElementById('addButton');
let urlsInfo = document.getElementById('urlsInfo');
let submit = document.getElementById('submitButton');

addButton.addEventListener('click', function (event) {
  clearError();

  try {
    let singleUrl = textarea.value;
    //validate singleUrl:
    let validationReg = /^(http|https)\:\/\/www\.youtube\.com\/.+/;
    if (!validationReg.exec(singleUrl)) throw new Error('Invalid youtube url!');
    let childs = urlsPara.childNodes;
    //see if the url already exists:
    for (i in childs) {
      if (singleUrl == childs[i].textContent) throw new Error('This url exists!');
    }
    // append the new url node to urlsPara..
    let new_url_node = document.createElement('p');
    new_url_node.textContent = singleUrl;
    urlArray.push(singleUrl);
    urlsPara.appendChild(new_url_node);

  } catch (e) {
    displayError(e.toString())
  }

});

function displayError(errorString) {
  errorPara.textContent = errorString.toString();
}

function clearError() {
  errorPara.textContent = "";
}

submit.addEventListener('click', function (event) {
  clearError();
  let json_url = { 'urls': urlArray };

  request(["POST", '/', JSON.stringify(json_url)], {}, function (error, response) {
    if (urlArray.length == 0) {
      displayError(new Error("Empty url!"));
    } else if (error) {
      displayError(error.toString());
    } else {
      timeStamp = JSON.parse(response).name;
      // console.log(timeStamp);
      window.open('/' + timeStamp);
    }
  });
});
