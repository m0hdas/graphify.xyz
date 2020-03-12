function threshold(arr) {
  let mx = max(arr.map(x => max(x)));

  let highThresh = 0.22 * mx;
  let lowThresh = highThresh * 0.85;

  const STRONG = 255;
  const WEAK = 32;

  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[0].length; y++) {
      
      if (arr[x][y] >= highThresh) {
        arr[x][y] = STRONG;
      } else if (lowThresh <= arr[x][y] && arr[x][y] < highThresh) {
        arr[x][y] = WEAK;
      } else {
        arr[x][y] = 0;
      }
      
    }
  }

  return arr;
}