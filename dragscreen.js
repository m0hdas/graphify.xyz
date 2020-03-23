// Make the DIV element draggable:
dragElement(document.getElementById("adjlist"));
dragElement(document.getElementById("adjmat"));
dragElement(document.getElementById("uploadJSON"));
dragElement(document.getElementById("uploadImg"));
dragElement(document.getElementById("help"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {

    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function hide(e) {
  e.parentNode.parentNode.style.display = 'none';
}
var openFile = function(file) {
  var input = file.target;
  
  var reader = new FileReader();
  reader.onload = function() {
    var dataURL = reader.result;
    var output = document.getElementById('output');
    
    //show user uploaded image
    output.src = dataURL;
  };
  try{
    reader.readAsDataURL(input.files[0]);
    document.getElementById('uploadcontrols').style.display = "block";
  }catch(err){}
};

function updateTables(){
  //makes sure tables are updated
  document.getElementById("mattext").innerHTML = graph.mat.html();
  document.getElementById("adjtext").innerHTML = graph.adjList.html();
}
