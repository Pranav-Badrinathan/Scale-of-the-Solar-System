/*
anims.json value key:
	'pos' --> position relative to middle of the page. i.e: x = -40 is 40 units to left from mid
	'zoom' --> between 0 and 1, is mapped to the min and max zoom of zui. i.e, 0 = min zoom & 1 = max zoom
	'duration' --> How long should the animation take. In milliseconds.
 */

import * as panZoom from "./pan&Zoom.js";
import TWEEN, { Tween } from "../libs/tween.esm.js";

var pageMid;
var prvAnim;
var anims;
var index;

var tweens = [];

/**
 * Toggles the state of the animation. Turns it `on` if it is `off`, and vice verse.
 */
export function toggleAnim(){
	panZoom.togglePause();
	toggleClicks();

	if(panZoom.pause === false) {
		tweens.forEach(t => {
			t.stop();
		});
		return;
	}
	
	// To reset zoom value of zui on click. Will probably have to change, but whatever lol
	panZoom.zui.reset();
	panZoom.zui.updateSurface();

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
		$("#clickable").on("click", Next);
		$("#clickable").on("contextmenu", Previous);
	}
	else {
		$("#clickable").off("click", Next);
		$("#clickable").off("contextmenu", Previous);
	}
}

/**
 * do the prep work for running the animations - 
 * 	-	Get `anims.json`, where all animations are stored.
 * 	-	Execute the first animation, i.e: Reset the positions and focus on the middle.
 * 	-	Get the page middle.
 */
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

/**
 * Executes the animation at a certain index in the anims array.
 * @param {number} i The index to animate to
 */
function executeAnimAtIndex(i){
	var curAnim = anims.anim[i];

	if(curAnim.isFirst){
		panZoom.zui.surfaceMatrix.identity();
		panZoom.zui.updateSurface();
		panZoom.zui.zoomSet(Math.exp((getZoomFromPercent(curAnim.zoom).zoom)), pageMid.x, pageMid.y);
	}
	else{
		prvAnim = prvAnim == null?anims.anim[i-1]:prvAnim;
		
		var prvZoom = getZoomFromPercent(prvAnim.zoom);
		var curZoom = getZoomFromPercent(curAnim.zoom);
		var prvPos = {
						x: pageMid.x + prvAnim.pos.x * two.width,
						y: pageMid.y + prvAnim.pos.y * two.height
					};
		
		var curPos = {
						x: pageMid.x + curAnim.pos.x * two.width,
						y: pageMid.y + curAnim.pos.y * two.height
					};

		tweens.push(new TWEEN.Tween(prvPos)
					.to(curPos, curAnim.duration)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.start());

		tweens.push(new TWEEN.Tween(prvZoom)
					.to(curZoom, curAnim.duration)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(()=>{
						console.log(prvPos.x-pageMid.x);
						panZoom.zui.zoomSet(prvZoom.zoom, prvPos.x, prvPos.y);
					}).start());
	}

	prvAnim = curAnim;
}

function getZoomFromPercent(percent) {
	return {zoom: (percent * (panZoom.minMax.max - panZoom.minMax.min) / 100 + panZoom.minMax.min)};
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