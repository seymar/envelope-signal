"use strict";
/**
 * Universal signal creation using a breakpoint envelope and manipulation functions.
 * Can be used for gradients, animations, real life signal generation, sequencing.
 * @module envelope-signal
 */

function lerp(value1, value2, factor) {
  return value1*(1-factor)+value2*factor;
}

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
 * Envelope signal class
 * @constructor
 * @param {array} breakpoints - Initial breakpoints as arrays: [[0,0],[1,1], ...]
 * @param {array} breakpoints - Initial breakpoints as objects: [{position: 0, value: 0.5}, ...]
 */
function EnvelopeSignal(breakpoints) {
  this.breakpoints = [];
  this.defaultValue = 0;

  // Initialize initial breakpoints
  if(breakpoints instanceof Array) {
    breakpoints.forEach(function(breakpoint) {
      if(breakpoints instanceof Array) {
        this.addBreakpoint(breakpoint[0], breakpoint[1]);
      }
    }, this);
  }
}
  /**
   * Picks the value at a certain position on the envelope
   * @param {number} position - Position of breakpoint
   * @returns {number} Value at picked position
   */
  EnvelopeSignal.prototype.pick = function(position) {
    // Find closest breakpoint on left
    var left = new Breakpoint(-Infinity, this.defaultValue);
    this.breakpoints.forEach(function(breakpoint) {
      if(breakpoint.position > left.position && breakpoint.position <= position) {
        left = breakpoint;
      }
    }, this);

    // Find closest breakpoint on left
    var right = new Breakpoint(Infinity, this.defaultValue);
    this.breakpoints.forEach(function(breakpoint) {
      if(breakpoint.position < right.position && breakpoint.position > position) {
        right = breakpoint;
      }
    }, this);

    if(left.position == -Infinity) return right.value;
    if(right.position == Infinity) return left.value;
    
    var width = Math.abs(right.position-left.position);
    var factor = (position-left.position)/width;

    return lerp(left.value, right.value, factor);
  }

  /**
   * Add a breakpoint
   * @param {number} position - Position of breakpoint
   * @param {number} value - Value of breakpoint
   * @returns {Breakpoint} Added breakpoint
   */
  EnvelopeSignal.prototype.addBreakpoint = function(position, value) {
    // If no value is specified add the breakpoint on the current envelope
    if(typeof value == 'undefined') value = this.pick(position);

    if(this.breakpointExists(position)) return false;
    
    var newBreakpoint = new Breakpoint(position, value);

    this.breakpoints.push(newBreakpoint);

    return newBreakpoint;
  }

  /**
   * Check if a breakpoint already exists at a particular position
   * @param {number} position - Position of breakpoint
   * @returns {boolean} True if it exist, false otherwise
   */
  EnvelopeSignal.prototype.breakpointExists = function(position) {
    for(var i in this.breakpoints) {
      if(this.breakpoints[i] == position) return true;
    }
    return false;
  }

  /**
   * Sorts the breakpoints by position
   * @returns {EnvelopeSignal} Sorted
   */
  EnvelopeSignal.prototype.sortBreakpoints = function() {
    return this.breakpoints.sort(function(a, b) {
      return a.position - b.position;
    });
  }

  /**
   * Manipulation function to add two envelope signals
   * @param {number} manipulator A number to add to the envelope signal
   * @param {EnvelopeSignal} manipulator An envelope signal to add
   * @returns {EnvelopeSignal} Outcome of addition
   */
  EnvelopeSignal.prototype.add = function(manipulator) {
    var result = new EnvelopeSignal();
    if(typeof manipulator == 'number') {
      this.breakpoints.forEach(function(breakpoint) {
        result.addBreakpoint(
          breakpoint.position,
          breakpoint.value + manipulator
        );
      }, this);
    } else if(manipulator instanceof EnvelopeSignal) {
      // Breakpoints of this + signal picked from manipulator
      var thisAdded = new EnvelopeSignal();
      this.breakpoints.forEach(function(breakpoint) {
        result.addBreakpoint(
          breakpoint.position,
          breakpoint.value + manipulator.pick(breakpoint.position)
        );
      }, this);

      // Breakpoints of manipulator + signal picked from this
      var manipulatorAdded = new EnvelopeSignal();
      manipulator.breakpoints.forEach(function(breakpoint) {
        result.addBreakpoint(
          breakpoint.position,
          breakpoint.value + this.pick(breakpoint.position)
        );
      }, this);

      result.sortBreakpoints();
    }

    return result;
  }

  /**
   * Manipulation function to add two envelope signals
   * @param {number} manipulator A number to muliply the envelope signal by
   * @param {EnvelopeSignal} manipulator The envelope signal to multiply
   * @returns {EnvelopeSignal} Outcome of multiplication
   */
  EnvelopeSignal.prototype.multiply = function(manipulator) {
    var result = new EnvelopeSignal();
    if(typeof manipulator == 'number') {
      this.breakpoints.forEach(function(breakpoint) {
        result.addBreakpoint(
          breakpoint.position,
          breakpoint.value * manipulator
        );
      }, this);
    }
    return result;
  }

  /**
   * Manipulation function to invert the envelope signal
   * Or mirror the envelope signal around a horizontal axis set by the origin
   * @param {number} origin Represents the axis to mirror the signal around
   * @returns {EnvelopeSignal} Inverted envelope signal
   */
  EnvelopeSignal.prototype.invert = function(origin) {
    if(typeof origin == 'number') {
      return this.subtract(origin).multiply(-1).add(origin);
    } else {
      return this.multiply(-1);
    }
  }

  /**
   * Manipulation function to subtract two envelope signals
   * @param {number} manipulator A number to subtract from the envelope signal
   * @param {EnvelopeSignal} manipulator The envelope signal to subtract
   * @returns {EnvelopeSignal} Outcome of subtraction
   */
  EnvelopeSignal.prototype.subtract = function(manipulator) {
    if(typeof manipulator == 'number') {
      return this.add(-manipulator);
    } else if(manipulator instanceof EnvelopeSignal) {
      return this.add(manipulator.invert());
    }
  }
module.exports = EnvelopeSignal;