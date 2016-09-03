var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.render('index', { 'keyword': '', followers: [], error: ''});
});

app.post('/', function(req, res){
  var user = req.body.user;
  getList(user, function(followers, error){
    res.render('index', { 'keyword': user, 'followers': followers, 'error': error});
  });
});

app.listen(8080, function () {
  console.log('App listening on port 8080!');
});

function getList(user, callback) {
  var options = {
    method: 'GET',
    url: 'https://api.github.com/users/'+ user +'/followers',
    headers: {'user-agent': 'node.js'}
  };
  //pichaya
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) { // Success
      var followers = JSON.parse(body);
      return callback(followers);
    }else { // fail
      console.log(body);
      return callback([], body);
    }


  })
}
