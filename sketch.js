//Mouse Control Variables
let clickedNode = null;
let mouseHeld = false;
let nodeMoved = false;

//Mode/Settings Variables
let mode = "GRAPH";

// environment objects
let graph = new Graph();

function preload(){
  myFont = loadFont('Rodina-Regular.otf');
}

function setup() {
  //draw ellipses/circles from center
  ellipseMode(CENTER);
  
  canvas = createCanvas(windowWidth, 0.91 * windowHeight);
  
  
  canvas.mousePressed(canvasPressed);
  canvas.mouseReleased(canvasReleased);
  canvas.mouseMoved(canvasMoved);
  textSize(32);
  noLoop();
  
}

function draw() {
  background(220);

  if (mode == "GRAPH" || mode == "DELETE") {
    graph.draw();
    
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
    graph.draw();
    push();
    textSize(35);
    textAlign(CENTER);
    textFont(myFont);
    text("Pick Starting Node", windowWidth/2, 35);
    pop();
  }else if(mode == "D-RUN"){
    graph.draw();
    push();
    textSize(35);
    textAlign(CENTER);
    textFont(myFont);
    text("Running...", windowWidth/2, 35);
    pop();
  }else if(mode == "D-FIN"){
    graph.draw();
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

function updateTables(){
  document.getElementById("mattext").innerHTML = graph.mat.html();
  document.getElementById("adjtext").innerHTML = graph.adjList.html();
}

//trashcan button deletes everything on the screen
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

function saveGraph(){
  let obj = {nodes:graph.nodes, edges:graph.edges};
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download",  "Graph.json");  
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

async function uploadGraph(){
  if(mode[0] == "D"){
    dijkstra(); //exit running
  }
  
  let file = document.getElementById("json-file").files[0];
  
  if(file == undefined){
    document.getElementById("uploadtxt").style.color = "Red";
    document.getElementById("uploadtxt").innerHTML = "Choose a file first!";
    return 0;
  }
  if(file.type != "application/json"){
    document.getElementById("uploadtxt").style.color = "Red";
    document.getElementById("uploadtxt").innerHTML = "Wrong File Format!";
    return 0;
  }
  
  var text = await file.text();
  graph.uploadGraph(JSON.parse(text));
  
}

function detectGraph(){
  
  let img = readImage();

  //blurring and gray scaling
  let mult = floor(200/img.width);
  img.resize(mult * img.width, mult * img.height);
  img.filter(GRAY);
  img.filter(BLUR, 1);

  img.loadPixels();
  
  //canny edge detection
  img = compute_gradient(img);
  img = supress_non_max(img);
  img = threshold(img);
  img = hysteresis(img);
  
  
  let h = hough(img);
  
  image(imgFromArr(drawCircles(img, h)), 200, 200)
  
  if(h.length > 0){
    graph.reset();
    
    for(let c of h){
      graph.addNode(c[1] + 0.25 * windowWidth, c[2] + 0.25 * windowHeight);
      //find edges
    }
    
    for(let e of edgeFinder(img, h)){
      graph.addEdge(graph.nodes[e[0]], graph.nodes[e[1]], 1);
    }
    
    graph.draw();
    document.getElementById("uploadimgtxt").innerHTML = "Done! " + h.length + " nodes found." ;
  }else{
   //error message
    document.getElementById("uploadimgtxt").innerHTML = "No Circles Found! <br> maybe change the parameters.";
  }  

}

function windowResized() {
  resizeCanvas(windowWidth, 0.91 * windowHeight);
}
