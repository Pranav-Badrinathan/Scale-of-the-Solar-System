/*
anims.json value key:
	'pos' --> position relative to middle of the page. i.e: x = -40 is 40 units to left from mid
	'zoom' --> between 0 and 1, is mapped to the min and max zoom of zui. i.e, 0 = min zoom & 1 = max zoom
	'duration' --> How long should the animation take. In milliseconds.
 */

import * as panZoom from "./pan&Zoom.js";
import TWEEN, { Tween } from "../libs/tween.esm.js";

export var pageMid = {x: $(window).width() / 2, y: $(window).height() / 2};

var prvAnim;
var posZoom = { pos:{x:pageMid.x, y:pageMid.y}, zoom:1};

var anims;
var index;

var tweens = [];

var animFrameID;

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

	prep();
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
		requestAnimationFrame(update);
	}
	else {
		$("#clickable").off("click", Next);
		$("#clickable").off("contextmenu", Previous);
		cancelAnimationFrame(animFrameID);
	}
}

/**
 * do the prep work for running the animations - 
 * 	-	Get `anims.json`, where all animations are stored.
 * 	-	Execute the first animation, i.e: Reset the positions and focus on the middle.
 * 	-	Get the page middle.
 */
function prep(){
	posZoom = { pos: {x: pageMid.x, y: pageMid.y}, zoom: 1 };
	
	index = 0;
	$.when(getAnimsFromJSON()).done((data) => {
		anims = data;
		executeAnimAtIndex(index);
	});
}

/**
 * move to the next step in the animation
 * 
 * An event callback that is triggered upon `Left Click`
 */
function Next(){
	mainSet.scale = 1
	index = index + 1;
	executeAnimAtIndex(index);
}

/**
 * move to the previous step in the animation
 * 
 * An event callback that is triggered upon `Right Click`
 */
function Previous(){
	mainSet.scale = 0
	index = Math.max(index - 1, 0);
	executeAnimAtIndex(index);
}

/**
 * Executes the animation at a certain index in the anims array.
 * @param {number} i The index to animate to
 */
function executeAnimAtIndex(i){
	var curAnim = anims.anim[i];

	if(!curAnim.isFirst){
		prvAnim = prvAnim == null?anims.anim[i-1]:prvAnim;
		
		var prvZoom = getZoomFromPercent(prvAnim.zoom);
		var curZoom = getZoomFromPercent(curAnim.zoom);
		var prvPos = getRelPos(prvAnim.pos);
		
		var curPos = getRelPos(curAnim.pos);

		tweens.push(new TWEEN.Tween(prvPos)
					.to(curPos, curAnim.duration)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(()=>{
						posZoom.pos = prvPos;
					}).start());

		tweens.push(new TWEEN.Tween(prvZoom)
					.to(curZoom, curAnim.duration)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onUpdate(()=>{
						posZoom.zoom += prvZoom.zoom;
					}).start());
	}

	prvAnim = curAnim;

	function getRelPos(pos) { 
		return { x: pageMid.x + pos.x * two.width, y: pageMid.y + pos.y * two.height }; 
	}
}

function getZoomFromPercent(percent) {
	return {zoom: (percent * (panZoom.minMax.max - panZoom.minMax.min) / 100 + panZoom.minMax.min)};
}

function update(time){
	animFrameID = requestAnimationFrame(update);
	TWEEN.update(time);

	mainSet.translation.set(posZoom.pos.x, posZoom.pos.y);
	mainSet.scale = posZoom.zoom;
}

function getAnimsFromJSON(){
	var JSONdata = $.Deferred();
	$.getJSON("js/anims.json", function (data) {
		JSONdata.resolve(data);
	});
	return JSONdata.promise();
}