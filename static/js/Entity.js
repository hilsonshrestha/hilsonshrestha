/**
The MIT License (MIT)

Copyright (c) 2014 Hilson Shrestha

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function(w) {

  /**
   * Variables to be limited to integers.
   */
  var ints = ['bgRed', 'bgGreen', 'bgBlue'];

  var Entity = Class.extend({
    /**
     * The coordinaates x and y of the object.
     */
    x: 0,
    y: 0,

    /**
     * Origin coordinates x and y of the object.
     * Object is transform based on these values.
     */
    originX: 0,
    originY: 0,

    /**
     * Rotation angle in radians.
     */
    rotate: 0,

    /**
     * Object of variables used during run time.
     * Example: for animation
     */
    data: {
      initial: {},
      final: {}
    },

    /**
     * Data dictionary that user can set.
     */
    userData: {},

    /**
     * Sets userData dictionary.
     * @param {string} key Key to be used.
     * @param {object} value Value to be stored with given key.
     * @param {object} Self Entity object.
     */
    set: function (key, value) {
      this.userData[key] = value;
      return this;
    },

    /**
     * Retrieves value from userData dictionary.
     * @param {string} key Key to be fetched.
     * @param {object} Value from the userData dictionary.
     */
    retrieve: function (key) {
      return this.userData[key];
    },

    update: function () {
      return this;
    },

    /**
     * Flag value used to determine if the object is animating.
     */
    paused: false,

    /**
     * Pauses the annimation saving the time state.
     * @param {number} duration Duration to be paused. If duration is
     * undefined, the animation is paused until resumeAnimation is called.
     * @return {object} Self Entity object.
     */
    pauseAnimation: function (duration) {
      var self = this;
      if (this.paused == false) {
        if (typeof(duration) == 'number') {
          setTimeout(function() {
            self.resumeAnimation();
          }, duration);
        }
        this.paused = true;
        this.pausedTime = Date.now();
      }
      return this;
    },

    /**
     * Resumes a paused animation.
     * @return {object} Self Entity object.
     */
    resumeAnimation: function () {
      if (this.paused == true) {
        this.paused = false;
        this.startTime = Date.now() - (this.pausedTime - this.startTime) ;
      }
    },

    /**
     * Duration of animation, animation start time and the time when animation
     * was paused.
     */
    animDuration: 1000,
    startTime: Date.now(),
    pausedTime: Date.now(),

    /**
     Converts the RGBA value to string RGBA format.
     @param {number} red Red value of color (0 - 255).
     @param {number} green Blue value of color (0 - 255).
     @param {number} blue Blue value of color (0 - 255).
     @param {number} alpha Alpha value of color (0 - 255).
     @return {string} String RGBA color format.
     */
    rgba: function (red, green, blue, aplha) {
      return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + aplha + ')';
    },

    draw: null,
    clear: null,
    onComplete: null,

    /**
     * Helper function that returns a random number between first and last 
     * values (inclusive).
     * @param {number} first Lower range of value.
     * @param {number} last Upper range of value.
     * @return {number} Random number between first and last.
     */
    random: function (first, last) {
      return Math.floor(first + (last + 1 - first) * Math.random()) || first;
    },

     /**
     * Sets data to be changed during animation and onComplete function.
     * @param {object} data Data values to be animated.
     * @param {number} duration Animation duration in milliseconds.
     * @param {function} onComplete Function to be called when animation is 
     * completed.
     * @return {object} The circle object.
     */
    animate: function (data, duration, ease, onComplete) {
      this.startTime = Date.now();
      this.animDuration = duration;
      for (var key in data) {
        this.data.initial[key] = this[key];
        this.data.final[key] = data[key];
      }
      this.easeFn = this.ease[ease];
      typeof(onComplete) === 'function' && (this.onComplete = onComplete);
      return this;
    },
    ease: {
      inOutSine: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      linear: function (t, b, c, d) {
        return b + c * t / d;
      },
      inOutBack: function (t, b, c, d) {
        var s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
      },
      outBounce: function (t, b, c, d ){
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      }
    },

    easeFn: function (t, b, c, d) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      // linear animation function => return b + c * t / d;

    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;


    var s = 1.70158; 
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
      

      // return c*(t/=d)*t*t*t*t + b;


      return b + c * t / d;
      // Based on Jquery Easing by George McGinley Smith
      // 
      // * Open source under the BSD License. 
      // * Copyright © 2008 George McGinley Smith
      // * All rights reserved.

      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
    },

    /**
     * Updates values during animation based on the animation start time and
     * duration of animation.
     * @return {object} The circle object.
     */
    update: function () {
      if (this.paused == true) return this;
      var completion = (Date.now() - this.startTime) / this.animDuration,
          t = 0,
          d = this.data;

      /**
       * Calculate new state for incomplete animation.
       * Otherwise, set its final value on completion.
       */
      if (completion < 1) {
        for (var key in d.initial) {
          if (d.initial[key].constructor == Array) {
            for (var i = 0; i < d.initial[key].length; i++) {
              t = this.easeFn(Date.now() - this.startTime, d.initial[key][i], 
                                d.final[key][i] - d.initial[key][i], this.animDuration);
              this[key][i] = ints.indexOf(key) == -1 ? t : Math.floor(t);  
            }
          } else {
            t = this.easeFn(Date.now() - this.startTime, d.initial[key], 
                              d.final[key] - d.initial[key], this.animDuration);
            this[key] = ints.indexOf(key) == -1 ? t : Math.floor(t);
          }
        }
      } else {
        for (var key in this.data.initial) {
          this[key] = d.final[key];
        }
        if (typeof(this.onComplete) === 'function') {
          this.onComplete();
          // console.log(this.onComplete); 
          // this.onComplete = null;
        }
     
      }
      return this;
    }
  });


  /**
   * Class used to create text objects.
   */
  var Str = Entity.extend({
    fontSize: 16,
    fontFamily: "Arial",
    text: "",
    draw: function (ctx) {
      ctx.save();
      ctx.font = this.fontSize + "px " + this.fontFamily;
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  });



  var Circle = Entity.extend({
    radius: 2,

    /**
     * Red, green and blue components of the background and alpha value.
     */
    bgRed: 255,
    bgGreen: 255,
    bgBlue: 255,
    alpha: 50,

    /**
     * Draws the circle in the context.
     * @param {object} ctx The context where circle is drawn.
     * @return {object} The circle object.
     */
    draw: function (ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.originX, this.originY);
      ctx.rotate(this.rotate);
      ctx.arc(this.x, this.y, this.radius < 0 ? 0 : this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.rgba(this.bgRed, this.bgGreen, this.bgBlue,
                                                            this.alpha / 100);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      return this;
    },

    /**
     * Clears the part of the object in the context.
     * @param {object} ctx The context which is to be cleared.
     * @return {object} The circle object.
     */
    clear: function (ctx) {
      var r2 = this.radius * 2;
      ctx.clearRect(this.x - this.radius, this.y - this.radius, r2, r2);
      return this;
    },


  });

  var QuadCurve = Entity.extend({
    points: [],
    // fillStyle: "rgba(0, 0, 0, .5)",
    fillStyle: "rgba(100, 000, 100, 1)",
    // strokeStyle: '#FF3422',
    strokeStyle: 'rgba(0,0,0,.5)',
    lineWidth: 4,
    createLinearGradient: function (ctx) {
      var grd=ctx.createLinearGradient(0,0,window.innerWidth,0);
      grd.addColorStop(0,"red");
      grd.addColorStop(0.5,"orange");
      grd.addColorStop(1,"blue");
      this.grd = grd;
      
      grd=ctx.createLinearGradient(0,0,window.innerWidth,0);
      grd.addColorStop(0,"#111");
      grd.addColorStop(0.5,"#002034");
      grd.addColorStop(1,"indigo");
      this.grd2 = grd;
    },
    draw: function (ctx) {
      ctx.save();
      ctx.beginPath();
      // move to the first point
      var p = this.points;
      // ctx.moveTo(p[0].x, p[0].y);
      ctx.moveTo(p[0], p[1]);
      for (i = 2; i < p.length - 2; i += 2) {
        var xc = (p[i - 2] + p[i]) / 2;
        var yc = (p[i - 1] + p[i + 1]) / 2;
        ctx.quadraticCurveTo(p[i-2], p[i-1], xc, yc);
      }
      // curve through the last two points
      ctx.quadraticCurveTo(p[i - 2], p[i - 1], p[i], p[i + 1]);
      ctx.closePath();
      // ctx.fillStyle = this.fillStyle;
      ctx.fillStyle = this.grd2;
      ctx.strokeStyle=this.grd;



      // ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  });

  w.Entity = Entity;
  w.Circle = Circle;
  w.Str = Str;
  w.QuadCurve = QuadCurve;
}) (window);



// // move to the first point
//    ctx.moveTo(points[0].x, points[0].y);


//    for (i = 1; i < points.length - 2; i ++)
//    {
//       var xc = (points[i].x + points[i + 1].x) / 2;
//       var yc = (points[i].y + points[i + 1].y) / 2;
//       ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
//    }
//  // curve through the last two points
//  ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);