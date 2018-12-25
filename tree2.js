const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1500, 2000 ],
  flush: true
};

const sketch = () => {
  return ({ context, width, height }) => {
    // page setup
    const pageMargin = 100;
    const margin = 25
    const printWidth = width - (pageMargin * 2);
    const printHeight = height - (pageMargin * 2);


    // grid setup
    const rows = 6;
    const cols = 6;
    const cellWidth = (printWidth / cols) - margin;
    const cellHeight = (printHeight / rows) - margin;
    const cellpageMargin = 25

    // drawing parameters
    context.lineWidth = 1;
    var bghue = random.range(0,254); // pick a random background color
    var bg = `hsla(${bghue}, 25%, 95%, 1)`; // make it super light
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height); // draw the background rectangle

    // loop variables
    var startX, startY, x1, y1, x2, y2, r, trunkSize, shift

    for (var i = pageMargin; i <= printWidth ; i+= cellWidth + margin) {
      // x var
      for (var j = pageMargin; j <= printHeight; j+= cellHeight + margin) {
        // draw the grid
        // context.strokeRect(i, j, cellWidth, cellHeight)

        // random tree parameters
        const steps = random.rangeFloor(5,8);
        const angle = random.range(50, 60);

        // saturation and lightness vars to use in each color
        var sat = random.range(40, 80) // higher is pastel-er
        var light = random.range(40, 80) // higher is pastel-er
        var green = random.range(105, 130);
        var brown = random.range(25, 40);
        var treeGreen = `hsl(${green}, ${sat}%, ${light}%)`;
        var trunkBrown = `hsl(${brown}, 100%, 40%)`;

        // draw the tree
        for (var k = 1; k <= steps; k++) {

          if (k === 1) {
            shift = (cellWidth / steps);
            startX = i + (cellWidth / 2);
            startY = j + cellpageMargin;
          } else {
            shift = ((cellWidth - (cellpageMargin * 2)) / steps);
            startY += shift;
          }
          r = shift * k
          // point A
          x1 = startX - (r * Math.cos(math.degToRad(angle)))
          y1 = startY + (r * Math.sin(math.degToRad(angle)))

          // point B
          x2 = startX + (r * Math.cos(math.degToRad(angle)))
          y2 = startY + (r * Math.sin(math.degToRad(angle)))


          triangle(startX, startY, x1, y1, x2, y2, treeGreen);

          if (k === steps) {
            var bottom = j + cellHeight;
            var trunkHeight = bottom - y2;
            var trunkWidth = (cellWidth - (cellpageMargin * 2)) / 6
            // trunkHeight = cellHeight - cellpageMargin - startX;
            var trunkStart = startX - (trunkWidth / 2);
            trunk(trunkStart, y1, trunkWidth, trunkHeight, trunkBrown)
          }
        }

      }
    }

    function triangle(startX, startY, x1, y1, x2, y2, treeGreen) {
      context.fillStyle = treeGreen;
      // draw a triangle
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(x1, y1)
      context.lineTo(x2, y2)
      context.closePath()
      context.fill()
    }
    function trunk(x, y, trunkWidth, trunkHeight,trunkBrown) {
      context.fillStyle = trunkBrown
      context.fillRect(x, y, trunkWidth, trunkHeight)
    }
  };
};

canvasSketch(sketch, settings);
