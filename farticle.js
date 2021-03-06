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

	function randRange(min, max) {
		return min + Math.random() * (max - min);
	}

	function randSpread(size) {
		return randRange(-size, size);
	}

	function createParticle(x, y) {
		return {
			x: x + randSpread(10), y: y + randSpread(5),
			size: randRange(2, 18),
			vx: randSpread(1), vy: randRange(-5, -2),
			color: hsla(50, 1, 0.5 + randSpread(0.05), 1),
		};
	}

	var gravity = { x: 0, y: 0 };
	var drag = { x: 0.99, y: 0.99 };
	function updateParticle(P, step) {
		P.x += P.vx * step;
		P.y += P.vy * step;

		P.vx += gravity.x * step;
		P.vy += gravity.y * step;

		P.vx *= Math.pow(drag.x, step);
		P.vy *= Math.pow(drag.y, step);

		P.color.h *= Math.pow(0.95, step);
		P.color.s *= Math.pow(0.98, step);
		P.size *= Math.pow(0.96, step);
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
		if (Math.round(P.size) <= 0)
			return false;
		return true;
	}

	var particles = [];

	function emitParticle(x, y) {
		var P = createParticle(x, y);
		particles.push(P);
		return P;
	}

	var fps = 30;
	var normalDelta = (1000 / fps);
	var lastTimestamp = 0;
	function redraw(timestamp) {
		var delta = timestamp - lastTimestamp;
		var step = delta / normalDelta;
		lastTimestamp = timestamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles = particles.filter(isParticleAlive);

		for (var i = 0; i < 15; i++)
			emitParticle(mouseX, mouseY);

		particles.forEach(function(P) {
			drawParticle(ctx, P);
		});
		particles.forEach(function(P) {
			updateParticle(P, step);
		});

		window.requestAnimationFrame(redraw);
	}

	function resize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
	}

	window.onresize = resize;
	resize();

	var mouseX = canvas.width / 2, mouseY = canvas.height / 2;
	window.onmousemove = function(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	};

	window.requestAnimationFrame(redraw);

})(window);
