const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1500, 2000 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    // page setup
    const pageMargin = 100;
    const cellBuffer = 25 // space between cells in which trees are drawn
    const printWidth = width - (pageMargin * 2);
    const printHeight = height - (pageMargin * 2);


    // grid setup
    const rows = random.rangeFloor(2,5);
    const cols = random.rangeFloor(2,5);
    console.log(`rows: ${rows}, cols: ${cols}`);
    const cellWidth = (printWidth / cols) - cellBuffer;
    const cellHeight = (printHeight / rows) - cellBuffer;
    const cellInnerMargin = 25

    // drawing parameters
    var bghue = random.range(0,254); // pick a random background color
    var bg = `hsl(${bghue}, 25%, 95%)`; // make it super light
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height); // draw the background rectangle

    // variables used throughout the loops
    var startX, startY, x1, y1, x2, y2, r, shift
    var peakX, peakY

    for (var i = pageMargin; i <= printWidth ; i+= cellWidth + cellBuffer) {
      // counter for columns (y)
      // both loops iterate based on the size of the cells
      // the first coordinate is the top-left of the first cell
      for (var j = pageMargin; j <= printHeight; j+= cellHeight + cellBuffer) {
        // loop for the rows (x)

        // draw a grid of boxes which hold the trees (helps with layout)
        // context.strokeRect(i, j, cellWidth, cellHeight)

        // random tree parameters
        const steps = random.rangeFloor(10,20); // number of triangles on the tree
        const angle = random.range(60, 60); // the top angle of the triangle

        // set a unique color for each tree
        var sat = random.range(40, 80) // saturation. higher is pastel-er
        var light = random.range(40, 60) // lightness. higher is pastel-er
        var green = random.range(105, 130); // green hues
        var brown = random.range(25, 40); // brown hues
        var treeGreen = `hsla(${green}, ${sat}%, ${light}%, 1)`;
        var trunkBrown = `hsl(${brown}, 100%, 40%)`;


        var treeHeight = cellHeight * 1.75
        var overlap = 0.5;
        var treeWidth = cellWidth - (cellInnerMargin * 2)
        startX = i + (cellWidth / 2); // this is only set once per tree
        peakX = startX

        for (var k = 1; k <= steps; k++) {
          var segmentWidth = k / steps * treeWidth;
          var segmentHeight = treeHeight / steps;

          if (k === 1) {
            startY = j;
            peakY = startY
          } else {
            startY += segmentHeight * overlap;
          }

          y1 = startY + segmentHeight
          x1 = startX - (segmentWidth / 2)

          y2 = startY + segmentHeight
          x2 = startX + (segmentWidth / 2)

          triangle(startX, startY, x1, y1, x2, y2, treeGreen);

          if (k === steps) {
            var bottom = j + cellHeight;
            var trunkHeight = bottom - y2;
            var trunkWidth = (cellWidth - (cellInnerMargin * 2)) / 6
            var trunkStart = startX - (trunkWidth / 2);
            trunk(trunkStart, y1, trunkWidth, trunkHeight, trunkBrown)
            ornamentSort(peakX, peakY, x1, y1, x2, y2)
          };
        };

        /*
          this loop draws the tree

          calculates the coordinates of each triangle, starting at the top

                                  * (startX, startY)


                    (A) *                     * (B)

          the distance between the stars is the radius
        */
        /*
        for (var k = 1; k <= steps; k++) {
          if (k === 1) { // on the first triangle, variables are set differently
            shift = (cellWidth / steps);
            startX = i + (cellWidth / 2); // this is only set once per tree
            startY = j;
          } else {
            shift = ((cellHeight - cellInnerMargin) / steps / 1.675);
            startY += shift;
          }
          r = k * shift
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
            var trunkWidth = (cellWidth - (cellInnerMargin * 2)) / 6
            // trunkHeight = cellHeight - cellInnerMargin - startX;
            var trunkStart = startX - (trunkWidth / 2);
            trunk(trunkStart, y1, trunkWidth, trunkHeight, trunkBrown)
          }
        }
          */
      }
    }

    function triangle(startX, startY, x1, y1, x2, y2, treeGreen) {
      context.fillStyle = treeGreen;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(x1, y1)
      context.lineTo(x2, y2);
      context.closePath();
      context.fill();
    };

    function trunk(x, y, trunkWidth, trunkHeight, trunkBrown) {
      context.fillStyle = trunkBrown;
      context.fillRect(x, y, trunkWidth, trunkHeight);
    };

    function ornamentSort(peakX, peakY, x1, y1, x2, y2) {
      var ornCount = 200
      var ornCoordsX = [];
      var ornCoordsY = [];
      var ornCoords = []
      // make random x and y values
      for (var i = 0; i < ornCount; i++) {
        ornCoordsX.push(random.rangeFloor(x1,x2))
        ornCoordsY.push(random.rangeFloor(peakY,y1))
      }

      for (var i = 0; i < ornCoordsX.length; i++) {
        var valid = []
        var xa = ornCoordsX[i]
        var ya = ornCoordsY[i]
        // evaluate left edge of triangle
        var l = ((peakY - y1)/(peakX - x1))*(xa-x1)+y1
        // evaluate right edge of triangle
        var r = ((peakY - y2)/(peakX - x2))*(xa-x2)+y2
        // if the coordinate is less than both
        if (ya > l && ya > r) {
          valid.push(ornCoordsX[i], ornCoordsY[i])
          ornCoords.push(valid)
        }
      }
      if (ornCoords.length != 0) {
        for (var i = 0; i <= 20; i++) {
          ornamentDraw(ornCoords[i])
        }
      }
    };

    function ornamentDraw(coords) {
      var radius = 10;
      var startAngle = math.degToRad(0);
      var endAngle = math.degToRad(360)

      var x = coords[0]
      var y = coords[1]

      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, true);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
