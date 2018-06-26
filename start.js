require('dotenv').config();

var http = require('http');
var httpProxy = require('http-proxy');
var HttpProxyRules = require('http-proxy-rules');
var rules = require('./rules');
var port = process.env.GATEWAY_PORT;
var proxyRules = new HttpProxyRules({ rules });

var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

var server = http.createServer((req, res) => {
    var target = proxyRules.match(req);
    if (target) return proxy.web(req, res, { target });

    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('The request url and path did not match any of the listed rules!');
});

console.log(`listening on port ${port}`)
server.listen(port);
