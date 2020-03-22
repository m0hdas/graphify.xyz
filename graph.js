class Graph {

  constructor() {
    this.nodes = [];
    this.edges = [];
    this.adjList = new AdjList();
    this.mat = new Matrix();
    this.isDirectional = false;
    this.showWeights = false;
    this.numLabels = false;

    //algorithim control variables
    this.run = false;
    this.algoSpeed = 2750;
    this.algoSrc = undefined;
    this.dDist = undefined;
    this.dPrev = undefined;
    this.dMinDist = undefined;
  }

  addNode(x, y) {
    if (this.nodes.length < 26) {
      let newNode = new Node(x, y);
      newNode.idx = this.nodes.length;

      this.nodes.push(newNode); //node list
      this.mat.addNode(); //adj matrix
      this.adjList.addNode();
    }
  }

  addEdge(orig, dist, w) {
    if (this.mat.mat[orig.idx][dist.idx] != Infinity) {
      return 0;
    }
    let newEdge = new Edge(orig, dist, w);

    this.edges.push(newEdge);
    this.mat.addEdge(newEdge);
    this.adjList.addEdge(newEdge);

    if (!this.isDirectional) {
      this.isDirectional = true;
      this.addEdge(dist, orig, w);
      this.isDirectional = false;
    }

  }

  draw() {
    //draw edges
    for (let edge of this.edges) {
      let isDirected = this.mat.mat[edge.from.idx][edge.to.idx] != this.mat.mat[edge.to.idx][edge.from.idx];
      edge.draw(this.showWeights, isDirected);
    }

    //draw nodes
    this.nodes.forEach(node => node.draw(0, this.numLabels));
  }

  neighbours(node) {
    let neighbours = [];
    for (let e of this.adjList.adj[node.idx]) {
      if (e != node) {
        neighbours.push(e[0]);
      }
    }
    return neighbours;
  }

  withinNode(x, y) {
    for (let node of this.nodes) {
      if ((x - node.x) ** 2 + (y - node.y) ** 2 < 625) {
        return node;
      }
    }
    return false;
  }

  withinEdge(x, y) {
    let within = []; //edges that the x,y is on.
    for (let edge of this.edges) {
      let area = abs(x * (edge.from.y - edge.to.y) + edge.from.x * (edge.to.y - y) + edge.to.x * (y - edge.from.y));
      let dist = sqrt((edge.from.x - edge.to.x) ** 2 + (edge.from.y - edge.to.y) ** 2);
      if (area / dist < 4) {
        if (edge.from.x < x && x < edge.to.x || edge.to.x < x && x < edge.from.x) {
          within.push(edge);
        }
      }
    }

    return within;
  }

  getEdge(from, to) {
    for (let e of this.edges) {
      if (e.from == from && e.to == to) {
        return e;
      }
    }
    return false;
  }

  editWeights(x, y) {
    let nearEdges = this.edges.filter(x => x.isMouseNear);
    nearEdges.forEach(edge => edge.editWeight(x, y));
    nearEdges.forEach(edge => this.mat.editWeight(edge));
    nearEdges.forEach(edge => this.adjList.editWeight(edge));
    if (nearEdges.length > 0) {
      return true;
    }
  }

  removeNode(node) {
    //remove node from list
    this.nodes.splice(node.idx, 1);
    //remove all edges connected to the node
    this.edges = this.edges.filter(e => (e.from != node && e.to != node));

    //remove from adj. matrix
    this.mat.removeNode(node);
    //remove from adj. list
    this.adjList.removeNode(node);
    //relabel nodes
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].idx = i;
    }

  }

  removeEdge(edge) {

    //remove from edges
    this.edges.splice(this.edges.indexOf(edge), 1);
    //remove from adj. matrix
    this.mat.removeEdge(edge);
    //remove from adj. list
    this.adjList.removeEdge(edge);

  }

  getSaveObj() {
    let obj = {
      nodes: this.nodes,
      edges: this.edges,
      isDirectional: this.isDirectional,
      showWeights: this.showWeights,
      numLabels: this.numLabels
    };

    return obj;
  }

  uploadGraph(newGraph) {

    try {
      //if one of the doesn't exist it should return error at some point
      let newNodes = newGraph.nodes;
      let newEdges = newGraph.edges;
      let isDirectional = newGraph.isDirectional;
      let showWeights = newGraph.showWeights;
      let numLabels = newGraph.numLabels;
      
      if(!(newNodes && newEdges)){ //if undefined
        document.getElementById("uploadtxt").style.color = "Red";
        document.getElementById("uploadtxt").innerHTML = "Wrong File Format!";
        return 0;
      }
      
      //clear canvas
      this.reset();
      this.draw();
      
      //copy properties accross
      this.showWeights = showWeights;
      this.numLabels = numLabels;
      
      //set to directional so it works both ways
      this.isDirectional = true;
      
      //draw nodes
      for (let n of newGraph.nodes) {
        this.addNode(n.x, n.y);
      }

      //draw edges
      for (let e of newGraph.edges) {
        this.addEdge(this.nodes[e.from.idx], this.nodes[e.to.idx], e.w);
      }
      
      //reset isDirectional afterwards
      this.isDirectional = isDirectional;
      edgesDropdown(); //makes sure dropdown button
      edgesDropdown(); // is in the right place by toggling it off and on
      
      //tell user its fine
      document.getElementById("uploadtxt").style.color = "Green";
      document.getElementById("uploadtxt").innerHTML = "Graph uploaded!";
      this.draw();
    } catch (err) {
      //something went wrong
      document.getElementById("uploadtxt").style.color = "Red";
      document.getElementById("uploadtxt").innerHTML = "Wrong File Format!";
      return 0;
    }

  }

  async dijkstra(src) {
    //initialisation
    this.run = true;
    let dist = {};
    this.algoSrc = src;
    dist[src.idx] = 0;
    src.algoText = "source";
    // Stores the reference to previous nodes
    let prev = {};
    //priority queue implementation
    let pq = new PriorityQueue();

    //initialising everything 
    for (let n of this.nodes) {
      if (n != src) {
        dist[n.idx] = Infinity; // Unkown distance from e.
        prev[n.idx] = undefined; //predecessor of e.
        n.algoCol = 1;
        n.algoText = "inf, ?";
      }

      pq.enqueue(n, dist[n.idx]);

    }
    this.draw();
    await delay(500);

    while (!pq.isEmpty()) {
      if (!this.run) {
        this.resetAlgoState();
        return 0;
      }
      
      let minNode = pq.dequeue();
      minNode.value.algoCol = 100;
      
      if(minNode.priority == Infinity){
        //no need to explore if we cannot even get there
        minNode.value.algoCol = 185;
        continue;
      }
      
      for (let n of this.neighbours(minNode.value)) {
        if (pq.isIn(n)) {
          //draw coloured node if still in queue
          //yet to be completely discovered
          n.algoCol = 75;
          draw();

          let edge = this.getEdge(minNode.value, n);
          edge.algoCol = 200;
          let otherEdge;
          if (this.mat.mat[edge.from.idx][edge.to.idx] == this.mat.mat[edge.to.idx][edge.from.idx]) {
            otherEdge = this.getEdge(n, minNode.value);
            otherEdge.algoText = "";
            otherEdge.algoCol = 200;
          }


          let alt = dist[minNode.value.idx] + this.mat.mat[minNode.value.idx][n.idx];

          edge.algoText = alt + " < " + dist[n.idx];
          if (alt < dist[n.idx]) {

            dist[n.idx] = alt;
            prev[n.idx] = minNode.value;
            pq.changePriority(n, alt);
            let p = this.numLabels ? minNode.value.idx : String.fromCharCode(minNode.value.idx + 65);
            n.algoText = alt + ", " + p;
            edge.algoTCol = color(10, 200, 10);
          } else {
            edge.algoTCol = color(200, 10, 10);
          }

          draw();
          await delay(this.algoSpeed);

          edge.algoCol = 0;
          if (otherEdge) {
            otherEdge.algoCol = 0;
          }

        }
      }

      minNode.value.algoCol = 185;
      draw();

    }
    this.dDist = dist;
    this.dPrev = prev;
    dijkstraEnd();

  }

  backtrace(target) {
    //initialises before recursion
    let currentNode = target;
    this.dMinDist = this.dDist[target.idx];
    this.edges.forEach(e => e.resetAlgoState());
    this.trace(currentNode);
  }

  trace(currentNode) {
    //traverses linked list
    if (currentNode == this.algoSrc) {
      return 0; //base case -- exits recursion
    }
    let previousNode = this.dPrev[currentNode.idx];
    if (!previousNode) { //returns false if node doesnt exist
      return 0; // exits if there is no way to get to that node
    }
    this.getEdge(previousNode, currentNode).algoCol = color(30, 30, 200);
    
    if (this.getEdge(currentNode, previousNode)) { //if it exists in the first place
      this.getEdge(currentNode, previousNode).algoCol = color(30, 30, 200);
    }
    this.trace(previousNode);
  }

  resetAlgoState() {
    this.run = false
    this.algoSpeed = 2750;
    this.algoSrc = undefined;
    this.dDist = undefined;
    this.dPrev = undefined;
    this.dMinDist = undefined;

    this.edges.forEach(e => e.resetAlgoState());
    this.nodes.forEach(n => n.resetAlgoState());

    this.draw();
  }

  reset() {
    this.nodes = [];
    this.edges = [];
    this.adjList = new AdjList();
    this.mat = new Matrix();
    this.isDirectional = false;
    this.showWeights = false;
    this.numLabels = false;

    //algorithim control variables
    this.run = false;
    this.algoSpeed = 2750;
    this.algoSrc = undefined;
    this.dDist = undefined;
    this.dPrev = undefined;
    this.dMinDist = undefined;
  }
}
