class Node{
  
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.idx = null;
    
    this.algoCol = 0;
    this.algoText = "";
  }
    
  draw(col, numLabels){
  
    push();
    stroke(0);
    
    if(this.algoCol == 0){
      fill(col);
    }else{
      fill(this.algoCol);
    }
    
    circle(this.x, this.y, 50);
    
    this.drawLabel(255, numLabels);
    pop();
  }
  
  drawLabel(col, numLabels){
    push();
    fill(col);
    noStroke();
    textAlign(CENTER);
    textFont(myFont);
    
    let label = numLabels ? this.idx : String.fromCharCode(this.idx + 65);
    if(this.algoCol == 0 || this.algoText === ""){
      textSize(38);
      text(label, this.x, this.y + 10);
    }else if(this.algoText == "source"){
      textSize(16);
      text(label, this.x, this.y - 5);
      textSize(16);
      text(this.algoText, this.x, this.y + 5);
    }else{
      textSize(24);
      text(label, this.x, this.y - 5);
      textSize(22);
      text(this.algoText, this.x, this.y + 15);
    }
    
    
    pop(); 
  }
  
  resetAlgoState(){
    this.algoCol = 0;
    this.algoText = "";
  }
  
}