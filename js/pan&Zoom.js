import Two from "../libs/two.module.js";

export var zui;
export var pause;
/**
 * Credits to Jono Brandel. I just copied this function off them.
 * https://codepen.io/jonobr1/pen/PobMKwb
 * 
 * This function adds zooming and panning functionality to the SSG.
 * 
 * @param {Two} two the `Two` object to add panning and zooming to.
 */
export function addZUI() {
	var domElement = two.renderer.domElement;

	zui = new Two.ZUI(two.scene);
	pause = false;

	var mouse = new Two.Vector();
	var touches = {};
	var distance = 0;

	zui.addLimits(0.01, 25);

	domElement.addEventListener('mousedown', mousedown, false);
	domElement.addEventListener('mousewheel', mousewheel, false);
	domElement.addEventListener('wheel', mousewheel, false);

	domElement.addEventListener('touchstart', touchstart, false);
	domElement.addEventListener('touchmove', touchmove, false);
	domElement.addEventListener('touchend', touchend, false);
	domElement.addEventListener('touchcancel', touchend, false);

	function mousedown(e) {
		if(pause) return;
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		window.addEventListener('mousemove', mousemove, false);
		window.addEventListener('mouseup', mouseup, false);
	}

	function mousemove(e) {
		var dx = e.clientX - mouse.x;
		var dy = e.clientY - mouse.y;
		zui.translateSurface(dx, dy);
		mouse.set(e.clientX, e.clientY);
	}

	function mouseup(e) {
		window.removeEventListener('mousemove', mousemove, false);
		window.removeEventListener('mouseup', mouseup, false);
	}

	function mousewheel(e) {
		if(pause) return;
		var dy = (e.wheelDeltaY || - e.deltaY) / 1000;
		zui.zoomBy(dy, e.clientX, e.clientY);
	}

	function touchstart(e) {
		if(pause) return;
		switch (e.touches.length) {
			case 2:
				pinchstart(e);
				break;
			case 1:
				panstart(e)
				break;
		}
	}

	function touchmove(e) {
		if(pause) return;
		switch (e.touches.length) {
			case 2:
				pinchmove(e);
				break;
			case 1:
				panmove(e)
				break;
		}
	}

	function touchend(e) {
		if(pause) return;
		touches = {};
		var touch = e.touches[ 0 ];
		if (touch) {  // Pass through for panning after pinching
			mouse.x = touch.clientX;
			mouse.y = touch.clientY;
		}
	}

	function panstart(e) {
		var touch = e.touches[ 0 ];
		mouse.x = touch.clientX;
		mouse.y = touch.clientY;
	}

	function panmove(e) {
		var touch = e.touches[ 0 ];
		var dx = touch.clientX - mouse.x;
		var dy = touch.clientY - mouse.y;
		zui.translateSurface(dx, dy);
		mouse.set(touch.clientX, touch.clientY);
	}

	function pinchstart(e) {
		for (var i = 0; i < e.touches.length; i++) {
			var touch = e.touches[ i ];
			touches[ touch.identifier ] = touch;
		}
		var a = touches[ 0 ];
		var b = touches[ 1 ];
		var dx = b.clientX - a.clientX;
		var dy = b.clientY - a.clientY;
		distance = Math.sqrt(dx * dx + dy * dy);
		mouse.x = dx / 2 + a.clientX;
		mouse.y = dy / 2 + a.clientY;
	}

	function pinchmove(e) {
		for (var i = 0; i < e.touches.length; i++) {
			var touch = e.touches[ i ];
			touches[ touch.identifier ] = touch;
		}
		var a = touches[ 0 ];
		var b = touches[ 1 ];
		var dx = b.clientX - a.clientX;
		var dy = b.clientY - a.clientY;
		var d = Math.sqrt(dx * dx + dy * dy);
		var delta = d - distance;
		zui.zoomBy(delta / 250, mouse.x, mouse.y);
		distance = d;
	}
}

export function togglePause(){
	if(pause === true) pause = false;
	else pause = true;
}