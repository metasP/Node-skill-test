var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var html = '<form action="/" method="post">'+
'Github user:<br>'+
'<input type="text" name="user">'+
'<input type="submit" value="Submit"></form>';

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send(html);
});

app.post('/', function(req, res){
  var user = req.body.user;
  getList(user, res);
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

function getList(user, res) {
  var options = {
    method: 'GET',
    url: 'https://api.github.com/users/'+ user +'/followers',
    headers: {'user-agent': 'node.js'}
  };
  //pichaya
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) { // Success
      console.log(body)
      var table = '<table>'+
      '<tr><th>avatar</th><th>login</th><th>url</th></tr>';
      var followers = JSON.parse(body);
      console.log(followers);
      for(var i in followers){
        var follower = followers[i];
        console.log(follower);
        var image = '<img src="'+follower.avatar_url+'" width="50" height="50">';
        var url = '<a href="'+follower.url+'">'+follower.url+'</a>';
        var login = follower.login;
        table += '<tr><td>'+image+'</td><td>'+login+'</td><td>'+url+'</td></tr>'
      }
      table += '</table>';
      res.send(html+'<br>'+table);
    }else { // fail
      res.send(html+'<br>'+error);
    }


  })
}
