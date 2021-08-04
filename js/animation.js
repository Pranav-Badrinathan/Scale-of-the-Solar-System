import * as panZoom from "./pan&Zoom.js";
import TWEEN from "../libs/tween.esm.js";

var pageMid;

var struct = {
	zoom:1,
	xPos:1,
	yPox:1,
	time:1
}

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
		$("#clickable").click(Next)
		$("#clickable").contextmenu(Previous)
	}
	else {
		$("#clickable").unbind("click");
		$("#clickable").unbind("contextmenu");
	}
}

/**
 * move to the next step in the animation
 * 
 * An event callback that is triggered upon `Left Click`
 */
function Next(){
	console.log("HI!");

	var coords = {x:pageMid.x, y:pageMid.y};
	var deltacoords = {x:pageMid.x, y:pageMid.y};
	var tween = new TWEEN.Tween(coords)
				.to({x: pageMid.x - 40, y: pageMid.y}, 1000)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate(()=>{
					deltacoords = {x:(pageMid.x - coords.x), y: (pageMid.y - coords.y)};
					panZoom.zui.translateSurface(deltacoords.x, deltacoords.y);
					console.log(deltacoords);
				})
				.start();
}

/**
 * move to the previous step in the animation
 * 
 * An event callback that is triggered upon `Right Click`
 */
function Previous(){

}

function update(deltaTime){
	requestAnimationFrame(update);
	TWEEN.update(deltaTime);
}

function prep(){
	panZoom.zui.surfaceMatrix.identity();
	panZoom.zui.updateSurface();

	pageMid = {x: $(window).width() / 2, y: $(window).height() / 2}
}

//Smooth movements
function smoothTranslate() {
	
}

function smoothZoom() {

}