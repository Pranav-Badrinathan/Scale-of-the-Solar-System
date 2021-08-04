import Two from "../libs/two.module.js";
import { toggleAnim } from "./animation.js";
import { addZUI } from "./pan&Zoom.js";

var sizeFactor = 1000;
var centre;
$(function(){
	
	initTwo();
	centre = {height: two.height/2, width: two.width/2};
	makeSun();
	makeOrbits();
	addZUI();
	$(".play").click(function(){
		$(this).toggleClass("stop");
		toggleAnim();
	});
});

function initTwo(){
	var elem = $("#clickable").get()[0];
	window.two = new Two({ fullscreen: true, autostart: true }).appendTo(elem);
}

function makeSun(){
	var sun = two.makeCircle(centre.width, centre.height, 0.004655 * sizeFactor);
	var corona = two.makeCircle(centre.width, centre.height, 0.05378 * sizeFactor)
	sun.stroke = "none";
	sun.fill = "rgba(255, 255, 138, 1)";
	corona.fill = "rgba(255, 255, 138, 0.46)";
	corona.stroke = "none";
}

function makeOrbits(){
	//Distance from Sun to all planets + pluto in AU
	var distInAU = [0.39, 0.723, 1, 1.524, 5.203, 9.539, 19.18, 30.06, 39.53];

	distInAU.forEach(e => {
		var orbit = two.makeCircle(centre.width, centre.height, 5 + (e * sizeFactor))
		orbit.fill = "none";
		orbit.stroke = "white";
		orbit.linewidth = e*2;
	});
}