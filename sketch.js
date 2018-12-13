const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2000, 2000 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    var hue = Math.floor(Math.random() * 254);
    var bg = `hsl(${hue}, 25%, 95%)`;
    context.fillStyle = bg;
    var black = "#555555"
    context.strokeStyle = black;
    context.fillRect(0, 0, width, height);

    // parameters
    var pageMargin = 200; // distance in pixels from edge of canvas to edge of first ornament
    var printWidth = width - (pageMargin * 2) // calculate the inner square where ornaments are drawn
    var cols = 6; // number of columns of ornaments in the print area
    var radius = 85; // radius of the ornaments
    var margin = (printWidth - (radius * cols * 2))/(cols - 1); // margin between the circles
    var diameter = radius * 2;
    var shards = 5 // number of random colors
    var shadow = 15; // shadowBlur setting

    // this loop uses the parameters above to lay out a grid of circles
    for (var i = radius + pageMargin; i < width - radius; i+= diameter + margin) {
      for (var j = radius + pageMargin; j < width - radius; j+= diameter + margin) {
        // draw the hooks
        //vertical line
        context.moveTo(i,j); // start drawing from the center of the bulb
        var endpoint = j - radius - (margin / 4); // set an offset endpoint
        context.lineTo(i, endpoint); // draw a line from the center to that endpoint
        context.stroke(); // apply a stroke to it

        // draw a hook half arc at the top of that line
        var hookScale = 4
        var hookCenterX = i - (radius / hookScale);
        var hookCenterY = endpoint;
        var hookRadius = radius / hookScale;
        var hookStart = 0 * (Math.PI / 180);
        var hookEnd = 180 * (Math.PI / 180);
        context.arc(hookCenterX, hookCenterY, hookRadius, hookStart,hookEnd,true)
        context.lineWidth = 10;
        context.stroke();

        // draw little bump on top of the ornament
        var bumpScale = 4
        draw(i, j - radius, radius/bumpScale, 0, 360, false, "fill", "black", 0, 0)
        // draw(i, j - radius, radius/bumpScale, 0, 360, false, "stroke", null, 5)

        // draw the main bulbs
        // draw fill that matches bg
        draw(i,j,radius,0,360,false,"fill", "bg", 10, shadow)

        // make random interior colors
        for (var k = 1; k <= shards; k++) {
          var start2 = Math.floor(Math.random() * 360) * (Math.PI / 180);
          var end2 = Math.floor(Math.random() * 360) * (Math.PI / 180);
          draw(i, j, radius, start2, end2, false, "fill", "color", 0, 0)
        }
        // trace the ornament after all the filling and drawing is done
        draw(i, j, radius, 0, 360, false, "stroke", null, 10, 0)
      }
    }

    function draw(x, y, radius, startAngle, endAngle, anticlockwise, drawType, fillType, strokeWidth, shadowSetting) {
      if (shadowSetting === 0) { // clear the shadow parameters for all draws except bg
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0
        context.shadowColor = null;
      } else {
        context.shadowBlur = shadowSetting * 3;
        context.shadowOffsetX = shadowSetting;
        context.shadowOffsetY = shadowSetting;
        context.shadowColor = "#999999";
      }
      context.shadowColor = null;
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, anticlockwise)
      // decide what kind of thing to draw
      if (drawType === "stroke") {
        strokePath(strokeWidth)
      } else if (drawType === "fill") {
        fillPath(fillType)
      }
    } // end draw()

    function strokePath (strokeWidth) {
      context.lineWidth = strokeWidth;
      context.stroke(); // do the stroke
    } // end strokePath()

    function fillPath (fillType) {
      if (fillType === "color") {
        // var low = random.range(50, 65) // darker
        var low = random.range(65, 85) // pastel-er

        var redOrGreen = random.boolean();

        if (redOrGreen === true) { // true is red
          // in HSL, red is between 0 - 20 and 340 - 360
          // so red needs two cases to decide which side of 360º is needed
          var whichRed = random.boolean()
          if (whichRed === true) {
            var red = random.range(0, 20);
          } else {
            var red = random.range(350, 360);
          }
          var shade = `hsl(${red}, ${low}%, ${low}%)`;
          context.fillStyle = shade;
        } else { // green is false
          // green just between 80 and 140
          var green = random.range(80, 140);
          var shade = `hsl(${green}, ${low}%, ${low}%)`;
          context.fillStyle = shade;
        } // end red vs green

      } else if (fillType === "bg") {
        context.fillStyle = bg;
      } else if (fillType === "black") {
        context.fillStyle = black;
      }
    context.fill(); // once you make all the choice above, then fill
    }
  }; // end canvas-sketch return
};

canvasSketch(sketch, settings);
