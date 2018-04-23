var express = require('express');
const path = require('path');
var dateObj = new Date();
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var messages = [];

function log(source, message) {
  console.log(dateObj.getUTCDate() + " " + source + ": " + message);
}

app.use(express.static(path.join(__dirname, '/views')));

app.post('/sendMessage', function(req, res) {
  messages.push({
    "tag": req.body.tag,
    "name": req.body.name,
    "id": req.body.id,
    "message": req.body.message,
    "timeStamp": dateObj.getTime()*Math.floor((Math.random() * 9999) + 1),
    "tag": req.body.tag
  });
  log("sendMessage", "Message sent from: " + req.body.name + ":" + req.body.id + " Message sent: " + req.body.message);
});

app.get("/getMessage", function(req, res) {
  log("getMessage", JSON.stringify(messages));
  log("getMessage", JSON.stringify(req.query));
  var compile = [];
  for (var i = 0; i < messages.length; i++) {
    if (messages[i].tag === req.query.tag) {
      compile.push(messages[i]);
      //if ((messages[i].timeStamp - dateObj.getTime()) > 5000)
        //messages.splice(i, 1);
      }
    }
  res.send(compile);
});

app.get('/', function(req, res) {
  res.sendFile('views/index.html', {root: __dirname})
});

setInterval(function() {
  messages=[];
}, 60000);

app.listen(80);

log("Body", "Completed Startup");
