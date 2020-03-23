function hough(arr) {
  const MIN = int(document.getElementById('radiusslider').value); //minumim radius
  const MAX = int(MIN) + 10; //maximum radius
  const STEPS = int(document.getElementById('stepsslider').value);
  const THRESH = float(document.getElementById('thresholdslider').value) / 100;
  
  let points = [{
    r: MIN,
    a: ~~(r * Math.cos(0)),
    b: ~~(r * Math.sin(0))
  }];
  
  //splitting up the grid into "buckets"
  for (let r = MIN; r <= MAX; r++) {
    for (let t = 0; t < STEPS; t++) {
      let theta = (2 * PI * t) / STEPS;
      let a = ~~(r * cos(theta));
      let b = ~~(r * sin(theta));

      let lastPoint = points[points.length - 1];
      if(lastPoint.r != r || lastPoint.a != a || lastPoint.b != b){
        points.push({r:r, a:a, b:b});
      }
    }
  }
  
  //initilaise 3D accumulator with zeros
  let acc = Array.from(Array(arr.length), () => Array.from(Array(arr[0].length), () => Array(points.length).fill(0)));

  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[0].length; y++) {
      for (let p of points) {
        if (arr[x][y] == 255) {
          try{
            acc[p.r][x - p.a][y - p.b] += 1;
          }catch(err){}
        }
      }
    }
  }


  let circles = [];

  for (let [r, rs] of acc.entries()) {
    for (let [a, as] of rs.entries()) {
      for (let [b, v] of as.entries()) {

        if (v / STEPS > THRESH) {
          if (circles.every((c) => ((a - c[1]) ** 2 + (b - c[2]) ** 2 > c[0] ** 2))) {
            //check circle is not within any circle
            circles.push([r, a, b]);
          }
        }
      }
    }
  }

  return circles;

}
