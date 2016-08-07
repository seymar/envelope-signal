var util = require('util');

var BreakpointEnvelope = require('../index.js');

var signal1 = new BreakpointEnvelope([
  [0, 0],
  [1, 1],
  [2, 1],
  [4, 0]
]);
var signal2 = new BreakpointEnvelope([
  [1, 0],
  [3, 1],
  [5, 0]
]);
var result = signal1.add(signal2);
console.log(result);
console.log(result.invert(1.5));