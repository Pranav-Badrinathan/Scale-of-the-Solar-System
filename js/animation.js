/*
anims.json value key:
	'pos' --> position relative to middle of the page. i.e: x = -40 is 40 units to left from mid
	'zoom' --> between 0 and 1, is mapped to the min and max zoom of zui. i.e, 0 = min zoom & 1 = max zoom
	'duration' --> How long should the animation take. In milliseconds.
 */

import * as panZoom from "./pan&Zoom.js";
import TWEEN from "../libs/tween.esm.js";

var pageMid;
var prvAnim;
var anims;
var index;

/**
 * Toggles the state of the animation. Turns it `on` if it is `off`, and vice verse.
 */
export function toggleAnim(){
	panZoom.togglePause();
	toggleClicks();

	if(panZoom.pause === false) return;
	prep();
	update();
}

/**
 * Checks to if the panning and zooming is paused. If it is, that means animation is running,
 * so it registers the event handlers. If it isn't, that means that the animation is not running and the
 * handlers are removed.
 */
function toggleClicks(){
	if(panZoom.pause === true) {
		$("#clickable").on("click", Next)
		$("#clickable").on("contextmenu", Previous)
	}
	else {
		$("#clickable").off("click");
		$("#clickable").off("contextmenu");
	}
}

function prep(){
	index = 0;
	$.when(getAnimsFromJSON()).done((data) => {
		anims = data;
		executeAnimAtIndex(index);
	});

	pageMid = {x: $(window).width() / 2, y: $(window).height() / 2}
}

/**
 * move to the next step in the animation
 * 
 * An event callback that is triggered upon `Left Click`
 */
function Next(){
	index = index + 1;
	executeAnimAtIndex(index);
}

/**
 * move to the previous step in the animation
 * 
 * An event callback that is triggered upon `Right Click`
 */
function Previous(){
	index = index - 1;
}

function executeAnimAtIndex(i){
	var currAnim = anims.anim[i];

	if(currAnim.isFirst){
		panZoom.zui.surfaceMatrix.identity();
		panZoom.zui.updateSurface();
		console.log("HERE11!")
	}
	else{
		console.log("HERE!" + i)
		prvAnim = anims.anim[i-1]
		console.log(currAnim.zoom + `${prvAnim.zoom}`)
		var posTween = new TWEEN.Tween(prvAnim.pos)
					.to(currAnim.pos, currAnim.duration)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(()=>{
						console.log(prvAnim.pos);
					}).start();
		
		var zoomTween = new TWEEN.Tween({zoom:prvAnim.zoom})
					.to({zoom:currAnim.zoom}, currAnim.duration)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(()=>{
						console.log(prvAnim.zoom);
					}).start();
	}
}

function update(deltaTime){
	requestAnimationFrame(update);
	TWEEN.update(deltaTime);
}


function getAnimsFromJSON(){
	var JSONdata = $.Deferred();
	$.getJSON("js/anims.json", function (data) {
		JSONdata.resolve(data);
	});
	return JSONdata.promise();
}