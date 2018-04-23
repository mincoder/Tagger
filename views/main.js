var tag;
var name;
var container;
var id;

var dateObj = new Date();
var lastCheck = dateObj.getTime();
var checkMes = [];

function checkMesUse(stamp) {
  for(var i=0;i<checkMes.length;i++) {
    if(stamp==checkMes[i]) return false;
  }
  checkMes.push(stamp);
  return true;
}

function checkIn() {
  container = document.getElementById('main');
  tag = document.getElementById('tag').value;
  name = document.getElementById('name').value;
  console.log(document.getElementById('name').value);

  if (tag == "" || name == "") {
    document.getElementById('message').innerHTML = "Please enter valid name and tag.";
  } else {
    name = name
    id = "#" + Math.floor((Math.random() * 9999) + 1);
    container.innerHTML = "<div class=\"scroll\" id=\"mes\"></div><br><input type=\"text\" id=\"chat\" class=\"chat\"><button class=\"send\" onClick=\"sendMessage()\">Send to #" + tag + "</button>";
  }
}

function sendMessage() {
  var message = document.getElementById('chat').value;
  if(!message=="") {
    document.getElementById('chat').value="";
    console.log(message);
    $.post("/sendMessage", {
      "message": message,
      "user": name,
      "tag": tag,
      "id": id
    });
  /*  addText({
      "message": message,
      "user": name,
      "tag": tag,
      "id": id
    });*/
  }
}

function getMessage() {
  //Send info if the user is typing
  //if(!document.getElementById('chat').value==null) $.post("/sendType", {"tag":tag,"name":name});

  //Downloads messages of tag
  $.getJSON("/getMessage", {"tag": tag}).done(function(data) {
    for(var i=0;i<data.length;i++) {
      if(checkMesUse(data[i].timeStamp)) {
      //  if(!((data[i].name+data[i].id)==(name+id)))
        addText(data[i]);
        lastCheck = dateObj.getTime();
      }
    }
  }).fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
  });
}

function addText(data) {
  document.getElementById('mes').innerHTML = document.getElementById('mes').innerHTML + data.name + "<span style=\"color:red;\">" + data.id + "</span>: " + data.message + "<br />";
}

document.addEventListener('keydown', function(event) {
  if(event.key == "Enter") {
    sendMessage();
  }
});

setInterval(function() {getMessage();}, 250).start;
