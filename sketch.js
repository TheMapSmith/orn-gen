const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2000, 2000 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    var hue = Math.floor(Math.random() * 254);
    context.fillStyle = `hsl(${hue}, 25%, 95%)`;
    var black = "#555555"
    context.strokeStyle = black;
    context.fillRect(0, 0, width, height);

    var pageMargin = 200;
    var printWidth = width - (pageMargin * 2)
    var cols = 6;
    var radius = 85;
    var margin = (printWidth - (radius * cols * 2))/(cols - 1);
    var diameter = radius * 2;

    for (var i = radius + pageMargin; i < width - radius; i+= diameter + margin) {
      for (var j = radius + pageMargin; j < width - radius; j+= diameter + margin) {
        // draw the hooks

        //vertical parts
        context.moveTo(i,j);
        var endpoint = j - radius - (margin / 4);
        context.lineTo(i, endpoint);
        context.stroke();

        // hook half arc
        var hookScale = 4
        var hookCenterX = i - (radius / hookScale);
        var hookCenterY = endpoint;
        var hookRadius = radius / hookScale;
        var hookStart = 0 * (Math.PI / 180);
        var hookEnd = 180 * (Math.PI / 180);
        context.arc(hookCenterX, hookCenterY, hookRadius, hookStart,hookEnd,true)
        context.lineWidth = 10;
        context.stroke();

        // draw little bump on top
        var bumpScale = 5
        draw(i,j - radius,radius/bumpScale,0,360,false,"black")
        draw(i,j - radius,radius/bumpScale,0,360,false,"stroke", 5)

        // draw the bulbs
        // draw fill that matches bg
        draw(i,j,radius,0,360,false,"bg")
        // random interior color
        var shards = 10
        for (var k = 1; k <= shards; k++) {
          var start2 = Math.floor(Math.random() * 360) * (Math.PI / 180);
          var end2 = Math.floor(Math.random() * 360) * (Math.PI / 180);
          draw(i,j,radius,start2,end2,false,"fill")
        }
        // draw outlines
        draw(i,j,radius,0,360,false,"stroke", 10)
      }
    }

    function draw(x, y, radius, startAngle, endAngle, anticlockwise, drawType, strokeWidth) {
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, anticlockwise)

      // decide if the stroke will be small or big
      if (drawType === "stroke") {
        if (strokeWidth === 5) { context.lineWidth = 10; }
        else { context.lineWidth = 10; }
        // do the stroke
        context.stroke();

      } else if (drawType === "fill") {
        // in HSL, red is between 0 - 20 and 340 - 360
        // green between 80 and 140

        var whichRed = random.boolean()
        if (whichRed === true) {
          var red = random.range(0, 20);
        } else {
          var red = random.range(350, 360);
        }

        var green = random.range(80, 140);

        // var low = random.range(50, 65) // darker
        var low = random.range(65, 85) // pastel-er

        var redOrGreen = random.boolean();

        if (redOrGreen === true) {
          var shade = `hsl(${red}, ${low}%, ${low}%)`;
          context.fillStyle = shade;
        } else {
          var shade = `hsl(${green}, ${low}%, ${low}%)`;
          context.fillStyle = shade;
        }
        context.fill();
      } else if (drawType === "black") {
        context.fillStyle = black;
        context.fill();
      } else {
        // fill with background color
        context.fill();
      }

    }
  };
};

canvasSketch(sketch, settings);
