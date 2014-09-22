var Canvas = Class.extend({
    canvas: null,
    ctx: null,
    height: 100,
    width: 100,
    screenPause: false,
    stop: false,
    animationEntities: [],
    entities: [],
    draw: function (obj) {
      obj.draw(this.ctx);
      return this;
    },
    clear: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }, 
    init: function (canvas, option) {
      this.canvas = canvas || document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.height = this.canvas.height = (option && option.height) || window.innerHeight - 20;
      this.width = this.canvas.width = (option && option.width) || window.innerWidth;
      return this;
    },
    addTo: function(parent) {
      if (this.canvas.parentElement == null) parent.appendChild(this.canvas);
    },
    animationLoop: function () {
      var self = this;
      if (self.stop == true) return; 
      self.clear();
      self.animationEntities.forEach(function (entity) {
        self.draw(self.screenPause == true ? entity : entity.update());
      });
      requestAnimFrame(function() {
        self.animationLoop();
      });
    },
    stopAnimation: function () {
      this.stop = true;
    },
    startAnimation: function () {
      // if (this.stop == true) return;
      this.stop = this.screenPause = false;
      this.animationLoop();
    }
});
