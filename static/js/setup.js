var setup = function() {
	$('#myName').click(function() {
		var e = $(this);
		e.addClass('explode');
		cancelAnimationFrame(introBackgroundCanvasAnimId);
		$('#introBackgroundCanvasContainer').fadeOut();
		beginCMainAnimation();
		setTimeout(function() {
			e.hide();
		}, 1000);
	});
};

var wWidth = window.innerWidth;
var wHeight = window.innerHeight;
var subTitleInitialQC = [
	-1000, 100,
	-100, 100,
	0, 100,
	wWidth * .25, 200,
	wWidth * .5, 400,
	wWidth * .75, 600,
	wWidth, 800,
	wWidth + 100, 1000,
	wWidth + 1000, 1000
	];

var subTitleMiddleQC = [
	-1000, 100,
	-100, 5,
	0, 5,
	wWidth * .25, 5,
	wWidth * .5, 5,
	wWidth * .75, 5,
	wWidth, 5,
	wWidth + 100, 5,
	wWidth + 1000, 1000
	];

var subTitleFinalQC = [
	-1000, 1000,
	-100, 1000,
	0, 800,
	wWidth * .25, 600,
	wWidth * .5, 400,
	wWidth * .75, 200,
	wWidth, 100,
	wWidth + 100, 100,
	wWidth + 1000, 100
	];

$('#subTitle').mouseenter(function(event) {
	var e = $(this);
	Qc.points = subTitleInitialQC.slice(0);
	Qc.animate({
    	points:   subTitleMiddleQC.slice(0)
  	}, 5000, 'inOutSine', function() {
  		CIntro.stopAnimation();
  	});
	CIntro.startAnimation();
	setTimeout(function () {
		$('#subTitleText').stop().css({
			bottom:'-15px',
			opacity: 0
		}).show().animate({
			bottom: '14px',
			opacity: 1
		}, 1000);
	}, 500);

}).mouseleave(function(event) {
	$('#subTitleText').stop().fadeOut();
	Qc.animate({
      points: subTitleFinalQC.slice(0)
    }, 5000, 'inOutSine', function () {
        CIntro.stopAnimation();
    });
	CIntro.startAnimation();
});


function closePage(page) {
	var a = $(page);
	a.css({
		top: '0',
	}).show().animate({
		top: '100%',
	}, 1000, 'easeInOutExpo', function() {
		a.hide();
	});
}

$('#btnAboutMe').click(function () {
	var a = $('#aboutMe');
	a.css({
		top: '100%',
	}).show().animate({
		top: 0,
	}, 1000, 'easeInOutExpo');
});


			var camera, scene, renderer,

			mouseX = 0, mouseY = 0,

			particles = [];

			init();

			function init() {

				// Camera params : 
				// field of view, aspect ratio for render output, near and far clipping plane. 
				camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 4000 );
	
				// move the camera backwards so we can see stuff! 
				// default position is 0,0,0. 
				camera.position.z = 1000;

				scene = new THREE.Scene();
				scene.add(camera);
	
				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
	
				document.getElementById('introBackgroundCanvasContainer').appendChild(renderer.domElement);
				makeParticles(); 
				document.addEventListener( 'mousemove', onMouseMove, false );
				update();			
			}

			// the main update function, called 30 times a second

			var introBackgroundCanvasAnimId;

			function update() {

				updateParticles();

				// and render the scene from the perspective of the camera
				renderer.render( scene, camera );
				introBackgroundCanvasAnimId = requestAnimationFrame(update);
			}

			// creates a random field of Particle objects
			
			function makeParticles() { 
				
				var particle, material; 

				// we're gonna move from z position -1000 (far away) 
				// to 1000 (where the camera is) and add a random particle at every pos. 
				for ( var zpos= -1000; zpos < 1000; zpos+=20 ) {
		
					// we make a particle material and pass through the 
					// colour and custom particle render function we defined. 
					material = new THREE.ParticleCanvasMaterial( { color: 0x8888dd, program: particleRender } );
					// make the particle
					particle = new THREE.Particle(material);
		
					// give it a random x and y position between -500 and 500
					particle.position.x = Math.random() * 1000 - 500;
					particle.position.y = Math.random() * 1000 - 500;
		
					// set its z position
					particle.position.z = zpos;
		
					// scale it up a bit
					particle.scale.x = particle.scale.y = 5;
		
					// add it to the scene
					scene.add( particle );
		
					// and to the array of particles. 
					particles.push(particle); 
				}
				
			}
			
			var tt = 0;

			function particleRender (ctx) {
				ctx.beginPath();
				ctx.arc( (wWidth-mouseX * 2 ) / 100, -(wHeight - 2 * mouseY)/100, 1, 0,  Math.PI * 2, true );
				ctx.fill();
			};

			
			// moves all the particles dependent on mouse position
			

			function updateParticles() { 
				
				// iterate through every particle
					camera.position.x =  150 * Math.cos(tt+=.003);
					camera.position.y =  150 * Math.sin(tt+=.003);
				for(var i=0; i<particles.length; i++) {
		
					particle = particles[i]; 
		
					// and move it forward dependent on the mouseY position. 
					// particle.position.z +=  mouseY * 0.1;
					particle.position.z +=  10 * 0.1;
		
					// if the particle is too close move it to the back
					if(particle.position.z>1000) particle.position.z-=2000; 
		
				}
	
			}
		
			function onMouseMove( event ) {
				mouseX = event.clientX;
				mouseY = event.clientY;
			}


