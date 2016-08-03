"use strict";
/**
 * Universal signal creation using a breakpoint envelope and manipulation functions.
 * Can be used for gradients, animations, real life signal generation, sequencing.
 * @module breakpoint-envelope
 */

/**
 * Breakpoint class
 * @constructor
 * @param {number} position - Breakpoint position
 * @param {number} value - Breakpoint value
 */
function Breakpoint(position, value) {
  if(typeof position == 'undefined') throw new Error('Parameter position required');
	if(typeof value == 'undefined') throw new Error('Parameter value required');

	this.position = position;
	this.value = value;
}

/**
 * Breakpoint class
 * @constructor
 * @param {array} breakpoints - Initial breakpoints as arrays: [[0,0],[1,1], ...]
 * @param {array} breakpoints - Initial breakpoints as objects: [{position: 0, value: 0.5}, ...]
 */
function BreakpointEnvelope(breakpoints) {
	this.breakpoints = [];
  this.defaultValue = 0;

  // Initialize initial breakpoints
}
  /**
   * Picks the value at a certain position on the envelope
   * @param {number} position - Position of breakpoint
   */
  BreakpointEnvelope.prototype.pick = function(position) {
    // Find closest breakpoint on left
    var left = new Breakpoint(-Infinity, this.defaultValue);
    for(var i in this.breakpoints) {
      var breakpoint = this.breakpoints[i];
      if(breakpoint.position > left.position && breakpoint.position <= position) {
        left = this.breakpoints[i];
      }
    }

    // Find closest breakpoint on left
    var right = new Breakpoint(Infinity, this.defaultValue);
    for(var i in this.breakpoints) {
      var breakpoint = this.breakpoints[i];
      if(breakpoint.position < right.position && breakpoint.position >= position) {
        right = this.breakpoints[i];
      }
    }

    if(left.position == -Infinity) return right.value;
    if(right.position == Infinity) return left.value;
    
    var factor = (position-left.position)/Math.abs(right.position-left.position);
    return left.value*(1-factor)+right.value*factor;
  }

  /**
   * Add a breakpoint
   * @param {number} position - Position of breakpoint
   * @param {number} value - Value of breakpoint
   */
	BreakpointEnvelope.prototype.add = function(position, value) {
    // If no value is specified add the breakpoint on the current envelope
    if(typeof value == 'undefined') value = this.pick(position);

    if(this.exists(position)) return false;
    
    var newBreakpoint = new Breakpoint(position, value);

		this.breakpoints.push(newBreakpoint);

    return newBreakpoint;
	}

  /**
   * Delete a breakpoint
   * @param {number} breakpoint - Index of breakpoint object in breakpoints array
   * @param {Breakpoint} breakpoint - The breakpoint object to delete
   */
  BreakpointEnvelope.prototype.delete = function(breakpoint) {
    if(typeof breakpoint == 'number') {
      this.breakpoints.splice(1, breakpoint);      

      return true;
    }

    if(typeof breakpoint == 'object') {
      this.breakpoints.splice(1, this.breakpoints.indexOf(breakpoint));

      return true;
    }

    return false;
  }

  /**
   * Check if a breakpoint already exists at a particular position
   * @param {number} position - Position of breakpoint
   */
  BreakpointEnvelope.prototype.exists = function(position) {
    for(var i in this.breakpoints) {
      var breakpoint = this.breakpoints[i];
      if(breakpoint.position == position) return true;
    }
    return false;
  }
module.exports = BreakpointEnvelope;