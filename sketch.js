const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2000, 2000 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    /*
          parameters
    */
    // page layout
    var pageMargin = 200; // distance in pixels from edge of canvas to edge of first ornament
    var printWidth = width - (pageMargin * 2) // calculate the inner square where ornaments are drawn
    var cols = 6; // number of columns of ornaments in the print area
    var radius = 85; // radius of the ornaments
    var margin = (printWidth - (radius * cols * 2))/(cols - 1); // margin between the circles
    var diameter = radius * 2;

    // ornament design
    var shards = random.range(1,20) // number of random colors
    var shadow = 15; // shadowBlur setting
    var bumpScale = 4 // the ratio between the ornament radius and the hook holder radius
    var hookScale = 4 // the ratio between the ornament radius and the hook radius

    // helper variables for circle drawing
    var zero = math.degToRad(0);
    var three60 = math.degToRad(360);
    var one80 = math.degToRad(180);

    // set global drawing settings
    var bghue = random.range(0,254);
    var bg = `hsl(${bghue}, 25%, 95%)`;
    var black = "#555555"
    var shadowColor = "rgba(0,0,0,0.25)";
    context.strokeStyle = black;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height); // draw the background rectangle

    /*
          this loop uses the parameters above to lay out a grid of circles
    */
    for (var i = radius + pageMargin; i < width - radius; i+= diameter + margin) {
      // i ends up being the x coordinate center of the circles
      for (var j = radius + pageMargin; j < width - radius; j+= diameter + margin) {
        // j ends up being the y coordinate center of the circles
        // the origin is top-left and it moves down then over
        /*
              draw the hooks
        */
        //vertical line
        context.moveTo(i,j); // start drawing from the center of the bulb
        var endpoint = j - radius - (margin / 4); // set an offset endpoint
        context.lineTo(i, endpoint); // draw a line from the center to that endpoint
        context.stroke(); // apply a stroke to it

        // draw a hook half arc at the top of that line
        var hookCenterX = i - (radius / hookScale); // the center has to be offset from the above endpoint
        var hookCenterY = endpoint;
        var hookRadius = radius / hookScale;
        context.arc(hookCenterX, hookCenterY, hookRadius, zero, one80, true)
        context.lineWidth = 10;
        context.stroke();

        // draw little bump on top of the ornament
        draw(i, j - radius, radius/bumpScale, zero, three60, false, "fill", "black", 0, 0)

        /*
              draw the main bulbs
        */
        // draw fill that matches bg
        draw(i, j, radius, zero, three60, false, "fill", "bg", 10, shadow)

        // make random interior colors
        for (var k = 1; k <= shards; k++) {
          var shardStart = math.degToRad(random.range(0,360));
          var shardEnd = math.degToRad(random.range(0,360));
          draw(i, j, radius, shardStart, shardEnd, false, "fill", "color", 0, 0)
        }
        // trace the ornament after all the filling and drawing is done
        draw(i, j, radius, zero, three60, false, "stroke", null, 10, 0)
      }
    }

    function draw(x, y, radius, startAngle, endAngle, anticlockwise, drawType, fillType, strokeWidth, shadowSetting) {
      if (shadowSetting === 0) { // clear the shadow parameters for all draws except bg fill
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0
      } else {
        context.shadowBlur = shadowSetting * 3;
        context.shadowOffsetX = shadowSetting;
        context.shadowOffsetY = shadowSetting;
        context.shadowColor = shadowColor;
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
