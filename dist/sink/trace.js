"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("./base-draw");

var _require = require("../utils/draw-utils");

var getRandomColor = _require.getRandomColor;
var getHue = _require.getHue;
var hexToRGB = _require.hexToRGB;

var Trace = (function (_BaseDraw) {
  function Trace(previous, options) {
    _classCallCheck(this, Trace);

    var extendDefaults = {
      colorScheme: "none" // color, opacity
    };

    _get(_core.Object.getPrototypeOf(Trace.prototype), "constructor", this).call(this, previous, options);
    // create an array of colors according to the
    if (!this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  _inherits(Trace, _BaseDraw);

  _createClass(Trace, {
    process: {
      value: function process(time, frame) {
        this.scrollModeDraw(time, frame);
        _get(_core.Object.getPrototypeOf(Trace.prototype), "process", this).call(this, time, frame);
      }
    },
    drawCurve: {
      value: function drawCurve(frame, prevFrame, iShift) {
        var ctx = this.ctx;
        var color;

        var halfRange = frame[1] / 2;
        var mean = this.getYPosition(frame[0]);
        var min = this.getYPosition(frame[0] - halfRange);
        var max = this.getYPosition(frame[0] + halfRange);

        if (prevFrame) {
          var prevHalfRange = prevFrame[1] / 2;
          var prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
          var prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
        }

        switch (this.params.colorScheme) {
          case "none":
            ctx.fillStyle = this.params.color;
            break;
          case "hue":
            var gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

            if (prevFrame) {
              gradient.addColorStop(0, "hsl(" + getHue(prevFrame[2]) + ", 100%, 50%)");
            } else {
              gradient.addColorStop(0, "hsl(" + getHue(frame[2]) + ", 100%, 50%)");
            }

            gradient.addColorStop(1, "hsl(" + getHue(frame[2]) + ", 100%, 50%)");
            ctx.fillStyle = gradient;
            break;
          case "opacity":
            var rgb = hexToRGB(this.params.color);
            var gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

            if (prevFrame) {
              gradient.addColorStop(0, "rgba(" + rgb.join(",") + "," + prevFrame[2] + ")");
            } else {
              gradient.addColorStop(0, "rgba(" + rgb.join(",") + "," + frame[2] + ")");
            }

            gradient.addColorStop(1, "rgba(" + rgb.join(",") + "," + frame[2] + ")");
            ctx.fillStyle = gradient;
            break;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, mean);
        ctx.lineTo(0, max);

        if (prevFrame) {
          ctx.lineTo(-iShift, prevMax);
          ctx.lineTo(-iShift, prevMin);
        }

        ctx.lineTo(0, min);
        ctx.closePath();

        ctx.fill();
        ctx.restore();
      }
    }
  });

  return Trace;
})(BaseDraw);

;

module.exports = Trace;
//# sourceMappingURL=data:application/json;base64,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SSxDQUFDLENBQUM7QUFDcEIsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5CLFlBQUksU0FBUyxFQUFFO0FBQ2IsYUFBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3QixhQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlCOztBQUVELFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFaEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsV0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2Y7Ozs7U0FoRkcsS0FBSztHQUFTLFFBQVE7O0FBaUYzQixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL3RyYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFzZURyYXcgPSByZXF1aXJlKCcuL2Jhc2UtZHJhdycpO1xudmFyIHsgZ2V0UmFuZG9tQ29sb3IsIGdldEh1ZSwgaGV4VG9SR0IgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL2RyYXctdXRpbHMnKTtcblxuY2xhc3MgVHJhY2UgZXh0ZW5kcyBCYXNlRHJhdyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZXh0ZW5kRGVmYXVsdHMgPSB7XG4gICAgICBjb2xvclNjaGVtZTogJ25vbmUnIC8vIGNvbG9yLCBvcGFjaXR5XG4gICAgfTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGVcbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9yKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jb2xvciA9IGdldFJhbmRvbUNvbG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIHN1cGVyLnByb2Nlc3ModGltZSwgZnJhbWUpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICB2YXIgY29sb3I7XG5cbiAgICB2YXIgaGFsZlJhbmdlID0gZnJhbWVbMV0gLyAyO1xuICAgIHZhciBtZWFuID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0pO1xuICAgIHZhciBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSAtIGhhbGZSYW5nZSk7XG4gICAgdmFyIG1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdICsgaGFsZlJhbmdlKTtcblxuICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgIHZhciBwcmV2SGFsZlJhbmdlID0gcHJldkZyYW1lWzFdIC8gMjtcbiAgICAgIHZhciBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lWzBdIC0gcHJldkhhbGZSYW5nZSk7XG4gICAgICB2YXIgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSArIHByZXZIYWxmUmFuZ2UpO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMuY29sb3JTY2hlbWUpIHtcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2h1ZSc6XG4gICAgICAgIHZhciBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdoc2woJyArIGdldEh1ZShwcmV2RnJhbWVbMl0pICsgJywgMTAwJSwgNTAlKScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAnaHNsKCcgKyBnZXRIdWUoZnJhbWVbMl0pICsgJywgMTAwJSwgNTAlKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdoc2woJyArIGdldEh1ZShmcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgIHZhciByZ2IgPSBoZXhUb1JHQih0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgICAgIHZhciBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKCcgKyByZ2Iuam9pbignLCcpICsgJywnICsgcHJldkZyYW1lWzJdICsgJyknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgbWVhbik7XG4gICAgY3R4LmxpbmVUbygwLCBtYXgpO1xuXG4gICAgaWYgKHByZXZGcmFtZSkge1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiJdfQ==