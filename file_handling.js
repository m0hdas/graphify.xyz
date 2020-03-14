function saveGraph(){
  let obj = graph.getSaveObj();
  
  //creating a hidden download anchor and making it download a file
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download",  "Graph.json");  
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  draw();
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

function openFile(file) {
  var input = file.target;

  var reader = new FileReader();
  reader.onload = function() {
    var dataURL = reader.result;
    var output = document.getElementById('output');

    output.src = dataURL;
  };
  try{
    reader.readAsDataURL(input.files[0]);
    document.getElementById("uploadimgtxt").innerHTML = "";
    document.getElementById('uploadcontrols').style.display = "block";
  }catch(err){}
};


function readImage(){
  //create invisible canvas
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let img = document.getElementById('output');
  
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  context.drawImage(img, 0, 0);
  let imgData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
  
  let uploadedImg = createImage(img.naturalWidth, img.naturalHeight);
  
  uploadedImg.loadPixels();
  //copy the pixels
  for(let i = 0; i < uploadedImg.pixels.length; i++){
    uploadedImg.pixels[i] = imgData.data[i];
  }
  
  uploadedImg.updatePixels();
  
  return uploadedImg;
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
  
  //images detected by hough transform
  let h = hough(img);
  
  if(h.length > 0){
    graph.reset();
    
    //add the nodes found
    for(let c of h){
      graph.addNode(c[1] + 0.25 * windowWidth, c[2] + 0.25 * windowHeight);
    }
    
    //detect connections for all edge
    for(let e of edgeFinder(img, h)){
      graph.addEdge(graph.nodes[e[0]], graph.nodes[e[1]], 1);
    }
    
    //show the user the graph found
    draw();
    //tell user edges detected
    document.getElementById("uploadimgtxt").innerHTML = "Done! " + h.length + " nodes found." ;
  }else{
   //error message
    document.getElementById("uploadimgtxt").innerHTML = "No Circles Found! <br> maybe change the parameters.";
  }  

}
