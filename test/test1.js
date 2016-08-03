var BreakpointEnvelope = require('../index.js');

var be1 = new BreakpointEnvelope();
var bp1 = be1.add(0, 0);
var bp2 = be1.add(1, 1);

console.log(be1.pick(0.75));