"use strict";

self.addEventListener("message", function (e) {
  process(e.data);
}, false);

function process(message) {

  var that = message.options;
  var hopSize = that.hopSize; // not used ?
  var frameSize = that.frameSize; // not used ?
  var blockSize = that.blockSize; // which difference with frameSize ?
  var sampleRate = that.sampleRate;
  var buffer = message.data;
  var length = buffer.length;

  var block = new Float32Array(blockSize);

  for (var index = 0; index < length; index += blockSize) {
    var copySize = length - index;

    if (copySize > blockSize) {
      copySize = blockSize;
    }

    var bufferSegment = buffer.subarray(index, index + copySize);

    block.set(bufferSegment, 0);

    for (var i = copySize; i < blockSize; i++) {
      block[i] = 0;
    }

    postMessage({ block: block, time: index / sampleRate });
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUFFLFNBQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUUxRSxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7O0FBRXhCLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDM0IsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQixNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQy9CLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDL0IsTUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNqQyxNQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRTNCLE1BQUksS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUV4QyxPQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDdEQsUUFBSSxRQUFRLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFOUIsUUFBSSxRQUFRLEdBQUcsU0FBUyxFQUFFO0FBQ3hCLGNBQVEsR0FBRyxTQUFTLENBQUM7S0FDdEI7O0FBRUQsUUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDOztBQUU3RCxTQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsU0FBSyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxXQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2Q7O0FBRUQsZUFBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxHQUFHLFVBQVUsRUFBRSxDQUFDLENBQUM7R0FDekQ7Q0FDRiIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHsgcHJvY2VzcyhlLmRhdGEpOyB9LCBmYWxzZSk7XG5cbmZ1bmN0aW9uIHByb2Nlc3MobWVzc2FnZSkge1xuXG4gIHZhciB0aGF0ID0gbWVzc2FnZS5vcHRpb25zO1xuICB2YXIgaG9wU2l6ZSA9IHRoYXQuaG9wU2l6ZTsgLy8gbm90IHVzZWQgP1xuICB2YXIgZnJhbWVTaXplID0gdGhhdC5mcmFtZVNpemU7IC8vIG5vdCB1c2VkID9cbiAgdmFyIGJsb2NrU2l6ZSA9IHRoYXQuYmxvY2tTaXplOyAvLyB3aGljaCBkaWZmZXJlbmNlIHdpdGggZnJhbWVTaXplID9cbiAgdmFyIHNhbXBsZVJhdGUgPSB0aGF0LnNhbXBsZVJhdGU7XG4gIHZhciBidWZmZXIgPSBtZXNzYWdlLmRhdGE7XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuXG4gIHZhciBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2tTaXplKTtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBibG9ja1NpemUpIHtcbiAgICB2YXIgY29weVNpemUgPSBsZW5ndGggLSBpbmRleDtcblxuICAgIGlmIChjb3B5U2l6ZSA+IGJsb2NrU2l6ZSkge1xuICAgICAgY29weVNpemUgPSBibG9ja1NpemU7XG4gICAgfVxuXG4gICAgdmFyIGJ1ZmZlclNlZ21lbnQgPSBidWZmZXIuc3ViYXJyYXkoaW5kZXgsIGluZGV4ICsgY29weVNpemUpO1xuXG4gICAgYmxvY2suc2V0KGJ1ZmZlclNlZ21lbnQsIDApO1xuXG4gICAgZm9yICh2YXIgaSA9IGNvcHlTaXplOyBpIDwgYmxvY2tTaXplOyBpKyspIHtcbiAgICAgIGJsb2NrW2ldID0gMDtcbiAgICB9XG5cbiAgICBwb3N0TWVzc2FnZSh7IGJsb2NrOiBibG9jaywgdGltZTogaW5kZXggLyBzYW1wbGVSYXRlIH0pO1xuICB9XG59Il19