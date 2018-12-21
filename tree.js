const canvasSketch = require('canvas-sketch');
const { renderPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: 'letter',
  orientation: 'portrait',
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'in',
};

const sketch = ({ context, width, height }) => {

  // page setup
  const margin = 0.75;
  const printWidth = width - (margin * 2);
  const printHeight = height - (margin * 2);

  // tree parameters
  const steps = random.rangeFloor(4,7);
  const treeHeight = printHeight;
  const segmentHeight = treeHeight / steps;
  const center = width / 2; // center of page
  const top = margin; // top of tree
  const angle = random.range(50, 70);
  const shift = random.range(0.1, 0.65);
  const trunkSize = random.range(0.1, .2) * steps;

  // drawing parameters
  context.lineWidth = 0.05;
  context.fillStyle = 'green'

  // context.fillRect(center, top, steps/5, steps/4)

  // loop variables
  let counter = 1;
  var startX, startY, x1, y1, x2, y2

  for (var i = steps; i >= 1; i--) {

    // loop parameters
    if (counter === 1) {
      startX = center;
      startY = top;
    } else {
      startY += shift;
    }
    // point A
    x1 = startX - (counter * Math.cos(math.degToRad(angle)))
    y1 = startY + (counter * Math.sin(math.degToRad(angle)))

    // point B
    x2 = startX + (counter * Math.cos(math.degToRad(angle)))
    y2 = startY + (counter * Math.sin(math.degToRad(angle)))


    triangle(startX, startY, x1, y1, x2, y2)

    counter++

    if (i === 1) {
      var trunkStart = startX - (trunkSize / 2);
      trunk(trunkStart, y1)
    }
  }

  function triangle(startX, startY, x1, y1, x2, y2) {
    // draw a triangle
    context.moveTo(startX, startY);
    context.lineTo(x1, y1)
    context.lineTo(x2, y2)
    context.closePath()
    context.fill()
  }
  function trunk(x,y) {
    context.fillStyle = 'brown'
    context.fillRect(x,y,trunkSize,trunkSize)
  }

  // Clip all the lines to a margin
  // const box = [ margin, margin, width - margin, height - margin ];
  // lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  // return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings);
