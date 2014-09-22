window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 50);
  };
}) ();

var CMain = new Canvas();
CMain.addTo(document.getElementById('canvasContainer'));
$(CMain.canvas).hide();

var CIntro = new Canvas(undefined, {height: 50});
CIntro.addTo(document.getElementById('subTitle'));
var Qc = new QuadCurve();



function beginCIntroAnimation () {
  Qc.points = [-1000, 100, -100, 100, 0, 100, 200, 200, 500, 400, 1000, 700, 2000, 1000, 3000, 200, -100, 200];
  var QstLine = new QuadCurve();
  QstLine.points = [0, 48, window.innerWidth, 48];

  Qc.createLinearGradient(CIntro.ctx);
  QstLine.createLinearGradient(CIntro.ctx);
  CIntro.entities.push(QstLine);
  CIntro.animationEntities.push(QstLine);

  CIntro.entities.push(Qc);
  CIntro.animationEntities.push(Qc);

  CIntro.startAnimation();
}
beginCIntroAnimation();
CIntro.stopAnimation(); //initial error correction


function createRandomCircle() {
  var a = new Circle();
  a.x = a.random(50, 300);
  a.originX = CMain.width / 2;
  a.originY = CMain.height / 2;
  a.radius = a.random(5, 20);
  a.alpha = 0;
  return a;
}

function beginCMainAnimation () {
  CIntro.stopAnimation();
  Skills.forEach(function (skill) {
    CMain.entities.push(createRandomCircle().set('skill', skill));
  });

  CMain.entities.forEach(function(entity) {
    CMain.animationEntities.push(entity);
    entity.tmpfn = function(duration) {
      this.animate({
        x: this.random(50, CMain.height / 2),
        rotate: Math.PI / 4 * 7,
        radius: this.random(5, 20),
        bgRed: this.random(50, 255),
        bgGreen: this.random(50, 255),
        bgBlue: this.random(50, 255),
        alpha: this.random(50, 100),
      }, duration ? duration : this.random(4000, 20000), 'outBounce', function() {
        this.rotate = -Math.PI / 4;
        this.tmpfn();
      });
    };
    entity.tmpfn();
  });
  // CMain.animationLoop();
  CMain.startAnimation();
  $(CMain.canvas).fadeIn();
}

$(CMain.canvas).click(function(event) {
  var x = event.pageX,
      y = event.pageY;
  CMain.entities.forEach(function (entity) {
    if (entity.retrieve('skill') == undefined) return;
    var ex = entity.x * Math.cos(entity.rotate) + entity.originX,
        ey = entity.x * Math.sin(entity.rotate) + entity.originY;
    if (Math.abs(ex - x) < 40 && Math.abs(ey - y) < 40) {
      // halt normal flow of animation and diplay text.
      var txt = new Str();
      txt.text = entity.retrieve('skill').name;
      txt.x = ex;
      txt.y = ey + 8; // default text size used as 16.
      entity.animate({
        radius: 50,
        alpha: 100,
        rotate: entity.rotate,
        x: entity.x
      }, 1000, 'inOutBack', function () {
        var self = this;
        setTimeout(function() {
          self.tmpfn(5000);
        }, 1000);
      });
      setTimeout(function () {
        CMain.entities.push(txt);
        CMain.animationEntities.push(txt);
      }, 500);
      setTimeout(function() {
          CMain.animationEntities.erase(txt);
          CMain.entities.erase(txt);
          delete txt;
      }, 2000);
    }
  });
});
