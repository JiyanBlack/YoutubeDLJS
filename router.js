var Router = function () {
  this.routers = [];
}

Router.prototype.add = function (method, url, handler) {
  this.routers.push({ method: method, url: url, handler: handler });
}

Router.prototype.routing = function (request, response) {
  let path = require('url').parse(request.url).pathname;

  return this.routes.some(function (aRouter) {
    let match = aRouter.url.exec(path);
    if (!match || aRouter.method != request.method)
      return false;

    let urlExtraction = match.slice(1).map(decodeURIComponent);
    aRouter.handler(request, response, ...urlExtraction);
    return true;
  })
}

module.exports = Router;
