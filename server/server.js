'use strict';

var express = require('express');
var app = express();

app.use('/bower_components/', express.static('../bower_components'));
app.use(express.static('../client'));

app.route('/*').get(function (req, res) {
    res.status(404).send('404 Page Not Found');
});

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
