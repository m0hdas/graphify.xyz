function compute_gradient(img) {
  let gradient = Array.from(Array(img.width), () => new Array(img.height));
  let direction = Array.from(Array(img.width), () => new Array(img.height));

  const loc = (x, y) => 4 * (x + img.width * y);
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      if ((0 < x && x < img.width - 1) && (0 < y && y < img.height - 1)) {
        magX = img.pixels[loc(x + 1, y)] - img.pixels[loc(x - 1, y)];
        magY = img.pixels[loc(x, y + 1)] - img.pixels[loc(x, y - 1)]
        gradient[x][y] = sqrt((magX) ** 2 + (magY) ** 2);
        direction[x][y] = atan2(magY, magX);
      } else {
        gradient[x][y] = 0;
        direction[x][y] = 0;
      }
    }
  }

  //normalise
  let mx = max(gradient.map(x => max(x)));
  gradient = gradient.map(a => a.map(b => (255 / mx) * b));

  return [gradient, direction];
}




//get the gradient image for testing and debugging 
function gradientImg(img) {

  let g = createImage(img.width, img.height);
  g.loadPixels();

  const loc = (x, y) => 4 * (x + img.width * y);

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      magX = img.pixels[loc(x + 1, y)] - img.pixels[loc(x - 1, y)];
      magY = img.pixels[loc(x, y + 1)] - img.pixels[loc(x, y - 1)]

      g.pixels[loc(x, y + 1)] = g.pixels[loc(x, y + 1) + 1] = g.pixels[loc(x, y + 1) + 2] = sqrt((magX) ** 2 + (magY) ** 2);
      g.pixels[loc(x, y + 1) + 3] = 255;
    }
  }

  g.updatePixels();
  return g
}
