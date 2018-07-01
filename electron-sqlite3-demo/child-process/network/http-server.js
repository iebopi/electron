const express = require('express');
const http = require('http');
const path = require('path')
const httpServer = express();

httpServer.get('/download/*', function (req, res, next) {
  var f = req.params[0];
  f = path.resolve('D:/media/' + f);
  console.log('Download file: %s', f);
  res.download(f);
  process.send({'message':req.host})
});

http.createServer(httpServer).listen(80);