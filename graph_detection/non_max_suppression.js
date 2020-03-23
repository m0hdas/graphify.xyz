function supress_non_max(g) {
  //g : array returned from matrix
  // g[0]: gradient image
  // g[1]: gradient direction array
  
  //initialise new image
  let Z = Array.from(Array(g[0].length), () => new Array(g[0][0].length).fill(0));
  let img = g[0];

  let dir = g[1];
  let w = g[0].length;
  let h = g[0][0].length;

  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {
      
      //no negative angles
      let a = dir[x][y] >= 0 ? dir[x][y] : dir[x][y] + PI;
      
      a = round(a / QUARTER_PI); //which quarter 

      q = 255; //adjacent pixel in positive direction
      r = 255; //adjacent pixel in negative direction

      if (a == 0|| a == 4) {
        q = img[x + 1][y];
        r = img[x - 1][y];
      } else if (a == 1) {
        q = img[x + 1][y + 1];
        r = img[x - 1][y - 1];
      } else if (a == 2) {
        q = img[x][y + 1];
        r = img[x][y - 1];
      } else if (a == 3) {
        q = img[x + 1][y - 1];
        r = img[x - 1][y + 1];
      }


      if (img[x][y] >= q && img[x][y] >= r) {
        Z[x][y] = img[x][y];
      } else {
        //pixel is suppressed
        Z[x][y] = 0;
      }
    }
  }
  return Z;
}
