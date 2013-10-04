(function(exports) {
	"use strict";

	var canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	var ctx = canvas.getContext('2d');

	function hsla(h, s, l, a) {
		return { h: h, s: s, l: l, a: a };
	}

	function percent(v) {
		return Math.round(v * 100) + '%'
	}

	function hslaString(hsla) {
		return 'hsla(' + Math.round(hsla.h) + ', ' + percent(hsla.s) + ', ' + percent(hsla.l) + ', ' + hsla.a + ')';
	}

	function randRange(max, min) {
		return min + Math.random() * (max - min);
	}

	function createParticle(x, y) {
		return {
			x: x, y: y,
			size: randRange(2, 5),
			vx: randRange(-5, 5), vy: randRange(-5, -2),
			color: hsla(85, 1, 0.5, 1),
		};
	}

	var gravity = { x: 0, y: 0.5 };
	function updateParticle(P, step) {
		P.x += P.vx * step;
		P.y += P.vy * step;

		P.vx += gravity.x * step;
		P.vy += gravity.y * step;

		P.color.h *= 0.95;
		P.color.s *= 0.994;
	}

	function drawParticle(ctx, P) {
		ctx.fillStyle = hslaString(P.color);
		var size = Math.ceil(P.size);
		var hsize = Math.floor(size/2);
		ctx.fillRect(P.x - hsize, P.y - hsize, size, size);
	}

	function isParticleAlive(P) {
		if (P.x < 0 || P.x > canvas.width)
			return false;
		if (P.y < 0 || P.y > canvas.height)
			return false;
		if (P.color.a <= 0)
			return false;
		if (P.size <= 0)
			return false;
		return true;
	}

	var particles = [];

	var fps = 30;
	var lastTimestamp = 0;

	function redraw(timestamp) {
		var delta = timestamp - lastTimestamp;
		var step = delta / fps;
		lastTimestamp = timestamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles = particles.filter(isParticleAlive);

		particles.forEach(function(P) {
			drawParticle(ctx, P);
		});
		particles.forEach(function(P) {
			updateParticle(P, step);
		});

		window.requestAnimationFrame(redraw);
	}

	function emitParticle(x, y) {
		var P = createParticle(x, y);
		particles.push(P);
		return P;
	}

	var mouseX, mouseY;
	function emitParticles() {
		setTimeout(emitParticles, 20);

		if (mouseX === undefined)
			return;

		for (var i = 0; i < 15; i++)
			emitParticle(mouseX, mouseY);
	}
	window.onmousemove = function(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	};

	function resize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
	}

	window.onresize = resize;
	resize();
	emitParticles();

	window.requestAnimationFrame(redraw);

})(window);