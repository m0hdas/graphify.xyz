//Mouse Control Variables
let clickedNode = null;
let mouseHeld = false;
let nodeMoved = false;

//Mode/Settings Variables
let mode = "GRAPH";

// environment objects
let graph = new Graph();


//p5.js built-in func.
function setup() {
  //draw ellipses/circles from center
  ellipseMode(CENTER);
  
  myFont = loadFont('Rodina-Regular.otf');
  
  canvas = createCanvas(windowWidth, 0.91 * windowHeight);
  
  //attaching mouse event listeners to the canvas
  canvas.mousePressed(canvasPressed);
  canvas.mouseReleased(canvasReleased);
  canvas.mouseMoved(canvasMoved);
  //for mobile use
  canvas.touchStarted(canvasPressed);
  canvas.touchEnded(canvasReleased);
  canvas.touchMoved(canvasMoved);
  
  textSize(32);
  noLoop();
  
}

//p5.js built-in func.
function draw() {
  
  background(220);
  graph.draw();
  
  if (mode == "GRAPH" || mode == "DELETE") {
    
    
    if (clickedNode && !mouseHeld) {
      push();
      strokeWeight(6);
      line(clickedNode.x, clickedNode.y, mouseX, mouseY);
      clickedNode.draw(0, graph.numLabels);
      if(graph.isDirectional){
        translate(mouseX, mouseY);
        rotate(atan2(mouseY - clickedNode.y, mouseX - clickedNode.x));
        triangle(0, 7 / 2, 0, -7 / 2, 7, 0);
      }
      
      pop();
    }
  } else if(mode == "D-START"){
    
    push();
    textSize(35);
    textAlign(CENTER);
    textFont(myFont);
    text("Pick Starting Node", windowWidth/2, 35);
    pop();
  
  }else if(mode == "D-RUN"){
    
    push();
    textSize(35);
    textAlign(CENTER);
    textFont(myFont);
    text("Running...", windowWidth/2, 35);
    pop();
  
  }else if(mode == "D-FIN"){
    push();
    textSize(35);
    textAlign(CENTER);
    textFont(myFont);
    text("Click Node to Trace Shortest Route", windowWidth/2, 35);
    
    if(graph.dMinDist){
      text("Minimum Distance: " + graph.dMinDist, windowWidth/2, 0.75*windowHeight);
    }
    
    pop();
  }
}

function canvasPressed() {
  mouseHeld = true;
  let currentNode;
  switch (mode) {
    case "GRAPH":
      //check if mouse is on a node
      currentNode = graph.withinNode(mouseX, mouseY); //node mouse is on
      //if mouse is not on any node then it will simply be set to false
      if (currentNode) {
        if (clickedNode) {
          if (clickedNode != currentNode) {
            graph.addEdge(clickedNode, currentNode, 1);
          }
          clickedNode = null;
        } else {
          clickedNode = currentNode;
        }
        return 1; // to exit func
      }

      if (clickedNode) {
        clickedNode = null;
        return 0;
      }

      if (graph.editWeights(mouseX, mouseY)) {
        return 1;
      }

      graph.addNode(mouseX, mouseY);
      break;
    case "DELETE":
      //check if mouse is on a node
      currentNode = graph.withinNode(mouseX, mouseY); //node mouse is on
      //if mouse is not on any node then it will simply be set to false
      if(currentNode){
        graph.removeNode(currentNode);
      }else{
        mouseEdges = graph.withinEdge(mouseX, mouseY).forEach(e => graph.removeEdge(e));
      }
      break;
    case "D-START":
      //check if mouse is on a node
      currentNode = graph.withinNode(mouseX, mouseY); //false if mouse is not on it
      //look at explanation above
      if(currentNode){
        mode = "D-RUN"
        draw();
        graph.dijkstra(currentNode);
      }
      break;
    case "D-FIN":
      //check if mouse is on a node
      currentNode = graph.withinNode(mouseX, mouseY); //false if mouse is not on it
      //look at explanation above
      if(currentNode){
        graph.backtrace(currentNode);
      }
      break;
  }

}

function canvasReleased() {
  mouseHeld = false;
  if (nodeMoved == true) {
    nodeMoved = false;
    clickedNode = null;
  }
  
  updateTables();
  if(mode != "D-RUN"){
    draw();
  }
}

function canvasMoved() {
  if (mode == "GRAPH") {
    if (clickedNode && mouseHeld) {
      clickedNode.x = mouseX;
      clickedNode.y = mouseY;
      nodeMoved = true;
    }
    draw();
  }
}

function reset() {
  if (mode == "GRAPH") {
    mode = "DELETE";
    clickedNode = null;
    document.getElementById("trash").style.color = "Red";
  } else if (mode == "DELETE") {
    mode = "GRAPH";
    document.getElementById("trash").style.color = "White";
  } 
  
  draw();
}

function speedSlider(val){
  graph.algoSpeed = 5000 - val.value;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function dijkstra(){
  if(mode != "D-START" && mode != "D-FIN" && mode != "D-RUN"){
    mode = "D-START";
    document.getElementById("runbtn").style.color = "Green";
    document.getElementById("runbtn").onclick = dijkstra;
    document.getElementById("rundrpdwn").style.display = "none";
    document.getElementById("trash").style.color = "White";
    document.getElementById("spdslidercontainer").style.display = "block";
    document.getElementById("uploadJSON").style.display = "none";
  }else{
    mode = "GRAPH";
    document.getElementById("spdslidercontainer").style.display = "none";
    document.getElementById("runbtn").onclick = null;
    document.getElementById("runbtn").style.color = "White";
    document.getElementById("rundrpdwn").style.display = "block";
    document.getElementById("spdslider").value = 2750;
    graph.resetAlgoState();
  }
  draw();
}

function dijkstraEnd(){
  mode = "D-FIN";
  draw();
}

function weightsDropdown() {
  graph.showWeights = !graph.showWeights;
  document.getElementById("weightsdrp").innerText = (graph.showWeights ? "Hide" : "Show") + " Weights";
  draw();
}

function edgesDropdown(){
  graph.isDirectional = !graph.isDirectional;
  document.getElementById("edgesdrp").innerText = (graph.isDirectional ? "Undirected" : "Directed") + " Edges";
}

function labelsDropdown() {
  graph.numLabels = !graph.numLabels;
  document.getElementById("labelsdrp").innerText = (graph.numLabels ? "Lettered" : "Numbered") + " Labels";
  draw();
}

function windowResized() {
  resizeCanvas(windowWidth, 0.91 * windowHeight);
}
