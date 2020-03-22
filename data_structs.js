class Matrix {

  constructor() {
    this.mat = [];
  }

  addNode() {
    this.mat = this.mat.map(r => r.concat([Infinity]));
    this.mat.push(Array(this.mat.length + 1).fill(Infinity));
    this.mat[this.mat.length - 1][this.mat.length - 1] = 0;
  }
  
  removeNode(node){
    
    this.mat.splice(node.idx, 1);
    
    for(let x of this.mat){
      x.splice(node.idx, 1);
    }
    
  }

  addEdge(edge) {
    
    this.mat[edge.from.idx][edge.to.idx] = edge.w;
    
  }
  
  removeEdge(edge){
    
    this.mat[edge.from.idx][edge.to.idx] = Infinity;
  
  }
  
  editWeight(edge){
    
    this.mat[edge.from.idx][edge.to.idx] = edge.w;
  
  }
  
  html(){
    let html = ""
  
    for(let i of this.mat){
      for(let j of i){
        
        if(j == Infinity){
          html += "&infin;&nbsp;";
        }else{
          html += j + "&nbsp;" 
        }
      }
      html += "<br>" //end line
    }
    
    return html
  }

}


class AdjList {

  constructor() {
    this.adj = [];
  }

  addNode() {
    this.adj.push([]);
  }
  
  removeNode(node){
    this.adj.splice(node.idx, 1);
    this.adj = this.adj.map(l => l.filter(x => x[0] != node));
  }

  addEdge(edge) {
    
    this.adj[edge.from.idx].push([edge.to, edge.w]);
  
  }
  
  removeEdge(edge){

    for(let i = 0; i < this.adj[edge.from.idx].length; i++){
      if(this.adj[edge.from.idx][i][0].idx == edge.to.idx){
        this.adj[edge.from.idx].splice(i, 1)
        return true;
      }
    }

  }
  
  editWeight(edge){
    
    for(let e of this.adj[edge.from.idx]){
      if(e[0] == edge.to){
        e[1] = edge.w;
      }
    }
    
  }
  
  html(){
    let html = "";
  
    for(let i = 0; i < this.adj.length; i++){
      html += graph.numLabels ? i : String.fromCharCode(i + 65);
      html += "&nbsp;:&nbsp;"
      
      for(let j of this.adj[i]){
        html += "[";
        html += graph.numLabels ? j[0].idx : String.fromCharCode(j[0].idx + 65);
        html += ",&nbsp;"
        html += j[1] + "&nbsp;" 
        html += "]&nbsp;"
      }
      html += "<br>"
    }
    
    return html
  }

}
class QElement{
  constructor(val, p){
    this.value = val;
    this.priority = p;
  }
}

class PriorityQueue extends Array {

  enqueue(val, p) {
    let elem = new QElement(val, p);
    let contain = false;

    // iterating through the entire 
    // item array to add element at the 
    // correct location of the Queue 
    for (let i = 0; i < this.length; i++) {
      if (this[i].priority > elem.priority) {
        // Once the correct location is found it is 
        // enqueued 
        this.splice(i, 0, elem);
        contain = true;
        break;
      }
    }

    // if the element has the highest priority 
    // it is appended to the end of the queue
    if (!contain) {
      this.push(elem);
    }

  }

  changePriority(val, newP) {
    //remove the value and enqueue with new p

    //search for val
    for (let i = 0; i < this.length; i++) {
      if (this[i].value == val) {
        //remove it, if found
        this.splice(i, 1);
        this.enqueue(val, newP);
        return 1; //exit func. no more searching required
      }
    }
  }

  isIn(val) {
    //does a linear search for a value
    //returns true if it exists in the queue
    //returns false if its not in the queue
    for (let i = 0; i < this.length; i++) {
      if (this[i].value == val) {

        return true;
      }
    }
    return false;
  }

  dequeue() {
    return this.shift();
  }

  isEmpty() {
    return this.length == 0;
  }
}

