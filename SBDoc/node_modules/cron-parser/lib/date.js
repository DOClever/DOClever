'use strict';

/**
 * Date class extension methods
 */
var extensions = {
  addYear: function addYear() {
    this.setFullYear(this.getFullYear() + 1);
  },

  addMonth: function addMonth() {
    this.setDate(1);
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMonth(this.getMonth() + 1);
  },

  addDay: function addDay() {
    var day = this.getDate();
    this.setDate(day + 1);

    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);

    if (this.getDate() === day) {
      this.setDate(day + 2);
    }
  },

  addHour: function addHour() {
    var hours = this.getHours();
    this.setHours(hours + 1);

    if (this.getHours() === hours) {
      this.setHours(hours + 2);
    }

    this.setMinutes(0);
    this.setSeconds(0);
  },

  addMinute: function addMinute() {
    this.setMinutes(this.getMinutes() + 1);
    this.setSeconds(0);
  },

  addSecond: function addSecond() {
    this.setSeconds(this.getSeconds() + 1);
  },

  toUTC: function toUTC() {
    var to = new CronDate(this);
    var ms = to.getTime() + (to.getTimezoneOffset() * 60000);
    to.setTime(ms);
    return to;
  }
};

/**
 * Extends Javascript Date class by adding
 * utility methods for basic date incrementation
 */

function CronDate (timestamp) {
  var date = timestamp ? new Date(timestamp) : new Date();

  // Attach extensions
  var methods = Object.keys(extensions);
  for (var i = 0, c = methods.length; i < c; i++) {
    var method = methods[i];
    date[method] = extensions[method].bind(date);
  }

  return date;
}

module.exports = CronDate;