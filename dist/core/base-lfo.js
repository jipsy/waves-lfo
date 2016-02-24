'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var id = 0;

var BaseLfo = (function () {
  function BaseLfo() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseLfo);

    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0
    };

    this.params = _Object$assign({}, defaults, options);
    this.children = [];
  }

  // WebAudioAPI `connect` like method

  _createClass(BaseLfo, [{
    key: 'connect',
    value: function connect(child) {
      if (this.streamParams === null) {
        throw new Error('cannot connect to a dead lfo node');
      }

      this.children.push(child);
      child.parent = this;
    }

    // define if suffiscient
  }, {
    key: 'disconnect',
    value: function disconnect() {
      // remove itself from parent children
      var index = this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
      // this.parent = null;
      // this.children = null;
    }

    // initialize the current node stream and propagate to it's children
  }, {
    key: 'initialize',
    value: function initialize() {
      if (this.parent) {
        // defaults to inherit parent's stream parameters
        this.streamParams = _Object$assign(this.streamParams, this.parent.streamParams);
      }

      // entry point for stream params configuration in derived class
      this.configureStream();
      // create the `outFrame` arrayBuffer
      this.setupStream();

      // propagate initialization in lfo chain
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].initialize();
      }
    }

    // sources only
    // start() {
    //   this.initialize();
    //   this.reset();
    // }

    /**
     * override inherited streamParams, only if specified in `params`
     */
  }, {
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }

      if (this.params.frameRate) {
        this.streamParams.frameRate = this.params.frameRate;
      }

      if (this.params.sourceSampleRate) {
        this.streamParams.sourceSampleRate = this.params.sourceSampleRate;
      }
    }

    /**
     * create the outputFrame according to the `streamParams`
     * @NOTE remove commented code ?
     */
  }, {
    key: 'setupStream',
    value: function setupStream() /* opts = {} */{
      // if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
      // if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
      // if (opts.sourceSampleRate) { this.streamParams.sourceSampleRate = opts.sourceSampleRate; }
      this.outFrame = new Float32Array(this.streamParams.frameSize);
    }

    // reset `outFrame` and call reset on children
  }, {
    key: 'reset',
    value: function reset() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].reset();
      }

      // sinks have no `outFrame`
      if (!this.outFrame) {
        return;
      }

      // this.outFrame.fill(0); // probably better but doesn't work yet
      for (var i = 0, l = this.outFrame.length; i < l; i++) {
        this.outFrame[i] = 0;
      }
    }

    // fill the on-going buffer with 0 (is done)
    // output it, then call reset on all the children (sure ?)
    // @NOTE: `reset` is called in `sources.start`,
    //  if is called here, it will be called more than once in a child node
    //  is this a problem ?
  }, {
    key: 'finalize',
    value: function finalize() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].finalize();
      }
    }

    // forward the current state (time, frame, metaData) to all the children
  }, {
    key: 'output',
    value: function output() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? this.time : arguments[0];
      var outFrame = arguments.length <= 1 || arguments[1] === undefined ? this.outFrame : arguments[1];
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? this.metaData : arguments[2];

      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].process(time, outFrame, metaData);
      }
    }

    // main function to override, defaults to noop
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.time = time;
      this.outFrame = frame;
      this.metaData = metaData;

      this.output();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // call `destroy` in all it's children
      var index = this.children.length;

      while (index--) {
        this.children[index].destroy();
      }

      // delete itself from the parent node
      if (this.parent) {
        var _index = this.parent.children.indexOf(this);
        this.parent.children.splice(_index, 1);
      }

      // cannot use a dead object as parent
      this.streamParams = null;

      // clean it's own references / disconnect audio nodes if needed
    }
  }]);

  return BaseLfo;
})();

exports['default'] = BaseLfo;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QVEsRUFBRTtBQUM3QixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDOztBQUVqQyxhQUFPLEtBQUssRUFBRSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNoQzs7O0FBR0QsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBTSxNQUFLLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDdkM7OztBQUdELFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7S0FHMUI7OztTQWxKa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiZXM2L2NvcmUvYmFzZS1sZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaWQgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCBkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMCxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgLy8gV2ViQXVkaW9BUEkgYGNvbm5lY3RgIGxpa2UgbWV0aG9kXG4gIGNvbm5lY3QoY2hpbGQpIHtcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGNvbm5lY3QgdG8gYSBkZWFkIGxmbyBub2RlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgLy8gZGVmaW5lIGlmIHN1ZmZpc2NpZW50XG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgLy8gcmVtb3ZlIGl0c2VsZiBmcm9tIHBhcmVudCBjaGlsZHJlblxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIC8vIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAvLyB0aGlzLmNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIGN1cnJlbnQgbm9kZSBzdHJlYW0gYW5kIHByb3BhZ2F0ZSB0byBpdCdzIGNoaWxkcmVuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAvLyBkZWZhdWx0cyB0byBpbmhlcml0IHBhcmVudCdzIHN0cmVhbSBwYXJhbWV0ZXJzXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24odGhpcy5zdHJlYW1QYXJhbXMsIHRoaXMucGFyZW50LnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuXG4gICAgLy8gZW50cnkgcG9pbnQgZm9yIHN0cmVhbSBwYXJhbXMgY29uZmlndXJhdGlvbiBpbiBkZXJpdmVkIGNsYXNzXG4gICAgdGhpcy5jb25maWd1cmVTdHJlYW0oKTtcbiAgICAvLyBjcmVhdGUgdGhlIGBvdXRGcmFtZWAgYXJyYXlCdWZmZXJcbiAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG5cbiAgICAvLyBwcm9wYWdhdGUgaW5pdGlhbGl6YXRpb24gaW4gbGZvIGNoYWluXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc291cmNlcyBvbmx5XG4gIC8vIHN0YXJ0KCkge1xuICAvLyAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAvLyAgIHRoaXMucmVzZXQoKTtcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBvdmVycmlkZSBpbmhlcml0ZWQgc3RyZWFtUGFyYW1zLCBvbmx5IGlmIHNwZWNpZmllZCBpbiBgcGFyYW1zYFxuICAgKi9cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZnJhbWVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5mcmFtZVJhdGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgdGhlIG91dHB1dEZyYW1lIGFjY29yZGluZyB0byB0aGUgYHN0cmVhbVBhcmFtc2BcbiAgICogQE5PVEUgcmVtb3ZlIGNvbW1lbnRlZCBjb2RlID9cbiAgICovXG4gIHNldHVwU3RyZWFtKC8qIG9wdHMgPSB7fSAqLykge1xuICAgIC8vIGlmIChvcHRzLmZyYW1lUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTsgfVxuICAgIC8vIGlmIChvcHRzLmZyYW1lU2l6ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBvcHRzLmZyYW1lU2l6ZTsgfVxuICAgIC8vIGlmIChvcHRzLnNvdXJjZVNhbXBsZVJhdGUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IG9wdHMuc291cmNlU2FtcGxlUmF0ZTsgfVxuICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyByZXNldCBgb3V0RnJhbWVgIGFuZCBjYWxsIHJlc2V0IG9uIGNoaWxkcmVuXG4gIHJlc2V0KCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucmVzZXQoKTtcbiAgICB9XG5cbiAgICAvLyBzaW5rcyBoYXZlIG5vIGBvdXRGcmFtZWBcbiAgICBpZiAoIXRoaXMub3V0RnJhbWUpIHsgcmV0dXJuIH1cblxuICAgIC8vIHRoaXMub3V0RnJhbWUuZmlsbCgwKTsgLy8gcHJvYmFibHkgYmV0dGVyIGJ1dCBkb2Vzbid0IHdvcmsgeWV0XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gZmlsbCB0aGUgb24tZ29pbmcgYnVmZmVyIHdpdGggMCAoaXMgZG9uZSlcbiAgLy8gb3V0cHV0IGl0LCB0aGVuIGNhbGwgcmVzZXQgb24gYWxsIHRoZSBjaGlsZHJlbiAoc3VyZSA/KVxuICAvLyBATk9URTogYHJlc2V0YCBpcyBjYWxsZWQgaW4gYHNvdXJjZXMuc3RhcnRgLFxuICAvLyAgaWYgaXMgY2FsbGVkIGhlcmUsIGl0IHdpbGwgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIGluIGEgY2hpbGQgbm9kZVxuICAvLyAgaXMgdGhpcyBhIHByb2JsZW0gP1xuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZm9yd2FyZCB0aGUgY3VycmVudCBzdGF0ZSAodGltZSwgZnJhbWUsIG1ldGFEYXRhKSB0byBhbGwgdGhlIGNoaWxkcmVuXG4gIG91dHB1dCh0aW1lID0gdGhpcy50aW1lLCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhID0gdGhpcy5tZXRhRGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucHJvY2Vzcyh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1haW4gZnVuY3Rpb24gdG8gb3ZlcnJpZGUsIGRlZmF1bHRzIHRvIG5vb3BcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBmcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjYWxsIGBkZXN0cm95YCBpbiBhbGwgaXQncyBjaGlsZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baW5kZXhdLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9ICB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBjYW5ub3QgdXNlIGEgZGVhZCBvYmplY3QgYXMgcGFyZW50XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuXG4gICAgLy8gY2xlYW4gaXQncyBvd24gcmVmZXJlbmNlcyAvIGRpc2Nvbm5lY3QgYXVkaW8gbm9kZXMgaWYgbmVlZGVkXG4gIH1cbn1cbiJdfQ==