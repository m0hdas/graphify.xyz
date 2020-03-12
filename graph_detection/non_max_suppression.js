function supress_non_max(g) {
  let Z = Array.from(Array(g[0].length), () => new Array(g[0][0].length).fill(0));
  let img = g[0];

  let dir = g[1];
  let w = g[0].length;
  let h = g[0][0].length;

  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {

      let a = dir[x][y] >= 0 ? dir[x][y] : dir[x][y] + PI;
      a = round(a / QUARTER_PI);

      q = 255;
      r = 255;

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
        Z[x][y] = 0;
      }
    }
  }
  return Z;
}
