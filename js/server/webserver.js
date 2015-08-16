var express = require('express');
var app = express();

app.use(express.static('css'));
app.use(express.static('js'));

app.get('/', function (req, res) {
  res.sendFile('index.html',{ root: '/Users/John/Documents/GitHub/MetroApp' });
});

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
