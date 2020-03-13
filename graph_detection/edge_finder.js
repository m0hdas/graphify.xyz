function edgeFinder(imgArr, circs) {
  let arr = drawCircles(imgArr, circs);
  let edges = [];
  for (let i = 0; i < circs.length; i++) {
    for (let j = 0; j < circs.length; j++) {
      if (i < j) {
        let connected = astar(circs[i][1], circs[i][2], circs[j][1], circs[j][2], circs[j][0], arr , circs);
        if (connected) {
          edges.push([i, j]);
        }
      }
    }
  }
  
  return edges;
}

function drawCircles(arr, circs) {
  //color circles
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[0].length; y++) {
      for (let c of circs) {
        if ((x - c[1]) ** 2 + (y - c[2]) ** 2 < (c[0] + 10) ** 2) {
          arr[x][y] = 255;
        }
      }
    }
  }
  return arr;
}

function astar(sx, sy, ex, ey, r, arr, circs) {
  //sx, sy: start x and y --- ex, ey: end x and y
  //r: radius of target node
  //arr edge array

  //priority queue implementation
  let pq = new PriorityQueue();

  //initialisation
  let grid = Array.from(Array(arr.length), () => new Array(arr[0].length));

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      grid[i][j] = new GridNode(i, j);
    }
  }

  grid[sx][sy].g = 0;
  grid[sx][sy].f = (sx - ex) ** 2 + (sy - ey) ** 2;
  pq.enqueue(grid[sx][sy], 0);

  while (!pq.isEmpty()) {
    
    let minNode = pq.dequeue().value; //[x, y]
    //IF DIST < THRESH -> ADD EDGE THEN RETURN;
    for (let n of gridNeighbours(minNode.x, minNode.y, arr)) {
    
      //neighbour
      let nx = n[0];
      let ny = n[1];

      let nval = arr[nx][ny];
      
      //ignore if black/wall or within a circle
      if (nval == 0 || withinCircle(nx, ny, sx, sy, ex, ey, circs) ) { 
        continue;
      }

      //heuristic: squared eucledian distance
      let h = (ex - nx) ** 2 + (ey - ny) ** 2;
      
      if ((ex == nx && ey == ny) || h < (r + 10) ** 2) {
        return true; //wayhey found
      }

      let f = grid[minNode.x][minNode.y].g + h; //+heuristic(dist. from tgt)

      if (f < grid[nx][ny].g) {
        grid[nx][ny].g = f;
        if(pq.isIn(grid[nx][ny])){
          pq.changePriority(grid[nx][ny], f);
        }else{
          pq.enqueue(grid[nx][ny], f);
        }
      }
    }
  }

  return false;

}

function withinCircle(x, y, sx, sy, ex, ey, circs){

  for(let c of circs){
    if(c[1] == ex && c[2] == ey){
      continue
    }
    if(c[1] == sx && c[2] == sy){
      continue
    }
      
    if( (c[1] - ex) ** 2 + (c[2] - ey) ** 2 < (c[0] + 10) ** 2){
      return true;
    }
  }
    
  return false;
}

class GridNode {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.g = Infinity;
    this.f = Infinity;
  }

}

function gridNeighbours(x, y, arr) {
  let nbrs = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (0 <= (x + i) && (x + i) < arr.length) {
        if (0 <= (y + j) && (y + j) < arr[0].length) {
          if(!(i == 0 && j == 0)){
            nbrs.push([x + i, y + j]);
          }
        }
      }
    }
  }
  
  return nbrs;
}
