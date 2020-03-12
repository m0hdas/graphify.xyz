function hysteresis(arr) {
  const WEAK = 32;
  const STRONG = 255;

  let w = arr.length;
  let h = arr[0].length;

  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {
      let found = false;
      if (arr[x][y] == WEAK) {
        if(strongAdjacent(arr, x, y, STRONG)){
          arr[x][y] = STRONG;
        }else{
          arr[x][y] = 0;
        }
      }
    }
  }
  return arr;
}

function strongAdjacent(arr, x, y, STRONG) {
  for (let i = -1; i <= 1 ; i++) {
    for (let j = -1; j <= 1; j++) {
      if (arr[x + i][y + j] == STRONG) {
        return true;
      }
    }
  }
  return false;
}

//works only on grayscale
function imgFromArr(arr) {
  let img = createImage(arr.length, arr[0].length);
  img.loadPixels();
  const loc = (x, y) => 4 * (x + arr.length * y);
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[0].length; y++) {
      img.pixels[loc(x, y)] = img.pixels[loc(x, y) + 1] = img.pixels[loc(x, y) + 2] = arr[x][y];
      img.pixels[loc(x, y) + 3] = 255;
    }
  }
  img.updatePixels();
  return img;
}