class Edge {

  constructor(from, to, weight) {
    this.from = from;
    this.to = to;
    this.w = weight;
    this.isMouseNear = false;
    
    //for algorthim visualisation
    this.algoCol = 0; 
    this.algoText = "";
    this.algoTCol = 0;
  }

  draw(showWeights, isDirectional) {
    push();
    stroke(this.algoCol);
    strokeWeight(6);
    line(this.from.x, this.from.y, this.to.x, this.to.y);
    pop();
    
    if(isDirectional){
      push();
      fill(255, 0, 0);
      stroke(7);
      strokeWeight(7);
      let vx = this.to.x - this.from.x;
      let vy = this.to.y - this.from.y;
      let dist = sqrt(vx ** 2 + vy ** 2);
      let mult = 1 - (37 / dist);
      translate(this.from.x + vx * mult, this.from.y + vy * mult); //go to the end;
      rotate(atan2(vy, vx));
      triangle(0, 7 / 2, 0, -7 / 2, 7, 0);
      pop();
    }
    
    //draw weights
    if (showWeights || this.algoCol != 0) {
      push();
      fill(0);
      textSize(30);
      let midpointX = (this.from.x + this.to.x) / 2;
      let midpointY = (this.from.y + this.to.y) / 2;
      translate(midpointX, midpointY);
      rotate(atan((this.from.y - this.to.y) / (this.from.x - this.to.x)));
      textAlign(CENTER, BOTTOM);
      
      if(this.algoCol == 0){ //i.e. algorithim is not running
        text(this.w, 0, 0);
      }else{
        textSize(18);
        fill(this.algoTCol);
        text(this.algoText, 0, 0);
        fill(0);
      }
      
      this.isMouseNear = false;
      if(mode == "GRAPH" && (mouseX - midpointX) ** 2 + (mouseY - midpointY) ** 2 < 1444) {
        this.isMouseNear = true;
        //plus sign
        if (this.w < 99) {
          push();
          translate(25, -18)
          ellipse(0, 0, 12);
          strokeWeight(2);
          stroke(255);
          line(0, -5, 0, 5);
          line(-5, 0, 5, 0);
          pop();
        }

        //minus sign
        if (this.w > 0) {
          push();
          translate(-25, -18)
          ellipse(0, 0, 12);
          strokeWeight(2);
          stroke(255);
          line(-5, 0, 5, 0);
          pop();
        }
      }
      pop();
    }
  }
  
  drawOnWeight(txt, col){
    push();
    fill(col);
    textSize(30);
    let midpointX = (this.from.x + this.to.x) / 2;
    let midpointY = (this.from.y + this.to.y) / 2;
    translate(midpointX, midpointY);
    rotate(atan((this.from.y - this.to.y) / (this.from.x - this.to.x)));
    textAlign(CENTER, BOTTOM);
    text(txt, 0, 0);
    pop();
  }
  
  editWeight(mX, mY){
    if(!this.isMouseNear){
      return 0;
    }
    
    let midpointX = (this.from.x + this.to.x) / 2;
    let midpointY = (this.from.y + this.to.y) / 2;
    let theta = atan((this.from.y - this.to.y) / (this.from.x - this.to.x));
    
    //get transformed mouse location
    mX -= midpointX;
    mY -= midpointY;
    let x = (mX * cos(theta)) + (mY * sin(theta));
    let y = (mY * cos(theta)) - (mX * sin(theta));
    
    if((x - 25) ** 2 + (y + 18) ** 2 < 36 && this.w < 99){
      this.w += 1;
    }else if((x + 25) ** 2 + (y + 18) ** 2 < 36 && this.w > 0){
      this.w -= 1
    }
  }
  
  resetAlgoState(){
    this.algoCol = 0;
    this.algoText = "";
    this.algoTCol = 0;
  }
}