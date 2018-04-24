var tag;
var name = "";
var container;
var id;

var dateObj = new Date();
var lastCheck = dateObj.getTime();
var checkMes = [];
var message = "test";

function checkMesUse(stamp) {
  for (var i = 0; i < checkMes.length; i++) {
    if (stamp == checkMes[i])
      return false;
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
    id = Math.floor((Math.random() * 9999) + 1);
    container.innerHTML = "<div class=\"scroll\" id=\"mes\"></div><br><input type=\"text\" id=\"chat\" class=\"chat\"><button class=\"send\" onClick=\"sendMessage()\">Send to #" + tag + "</button>";
  }
  setInterval(function() {
    getMessage();
  }, 1000).start;
}

function sendMessage() {
  if (message == "") {
    message = document.getElementById('chat').value;
    if (!message == "") {
      document.getElementById('chat').style = "color:red;";
      document.getElementById('chat').value = "Please Wait";
      $(".chat").attr("readonly", true);
    }
  }
}

function getMessage() {
  //Send info if the user is typing
  //if(!document.getElementById('chat').value==null) $.post("/sendType", {"tag":tag,"name":name});

  //Downloads messages of tag
  //$.getJSON("/getMessage", {"tag": tag}).done(function(data) {
  $.getJSON("/getMessage").done(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (checkMesUse(data[i].timeStamp)&&data[i].tag==tag) {
        //  if(!((data[i].name+data[i].id)==(name+id)))
        addText(data[i]);
        lastCheck = dateObj.getTime();
      }
    }
  }).fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
  });
  if (!message == "") {
    $.post("/sendMessage", {
      "message": message,
      "user": name,
      "tag": tag,
      "id": id
    });
    message = "";
    document.getElementById('chat').style = "color:black;";
    document.getElementById('chat').value = ""
    $(".chat").attr("readonly", false);
  }
}

function addText(data) {
  var messagerefined = data.message;
  var messagerefined = messagerefined.replace(":)", "😀");
  var messagerefined = messagerefined.replace(":D", "😁");
  var messagerefined = messagerefined.replace(";)", "😂");
  var messagerefined = messagerefined.replace(";(", "😭");
  var messagerefined = messagerefined.replace(":(", "😦");
  var messagerefined = messagerefined.replace(":P", "😛");
  var color="";
  if(data.id<=2000) {
    color="red";
  } else if(data.id<=4000) {
    color="blue";
  } else if(data.id<=6000) {
    color="purple";
  } else if(data.id<=8000) {
    color="yellow";
  } else if(data.id<=10000) {
    color="green";
  }
  document.getElementById('mes').innerHTML = document.getElementById('mes').innerHTML + data.user + "<span style=\"color:" + color + ";\">#" + data.id + "</span>: " + messagerefined + "<br />";
  var objDiv = document.getElementById("mes");
  objDiv.scrollTop = objDiv.scrollHeight;
}

document.addEventListener('keydown', function(event) {
  if (event.key == "Enter") {
    sendMessage();
  }
});
