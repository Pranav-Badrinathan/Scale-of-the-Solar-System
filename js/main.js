import Two from "../libs/two.module.js";
import { toggleAnim } from "./animation.js";
import { addZUI } from "./pan&Zoom.js";

var sizeFactor = 1000;
$(function(){
	initTwo();

	makeSun();
	makeOrbits();
	addZUI();
	$(".play").on("click", function(){
		$(this).toggleClass("stop");
		toggleAnim();
	});
	
	$(".change").on("click", function(){
		if(!mainSet.scale == 0) {
			mainSet.scale = 0;
			scaleSet.scale = 1;
		}
		else{
			mainSet.scale = 1;
			scaleSet.scale = 0;
		}
	});

	makeScalePlanets();
});

function initTwo(){
	var elem = $("#clickable").get()[0];
	window.two = new Two({ fullscreen: true, autostart: true }).appendTo(elem);
	window.mainSet = two.makeGroup();
	window.scaleSet = two.makeGroup();
	mainSet.translation.set(two.width/2, two.height/2);
}

function makeSun(){
	var sun = two.makeCircle(0, 0, 0.004655 * sizeFactor);
	var corona = two.makeCircle(0, 0, 0.05378 * sizeFactor)
	sun.stroke = "none";
	sun.fill = "rgba(255, 255, 138, 1)";
	corona.fill = "rgba(255, 255, 138, 0.46)";
	corona.stroke = "none";
	mainSet.add(sun, corona);
}

function makeOrbits(){
	//Distance from Sun to all planets + pluto in AU
	var distInAU = [0.39, 0.723, 1, 1.524, 5.203, 9.539, 19.18, 30.06];

	distInAU.forEach(e => {
		var orbit = two.makeCircle(0, 0, 5 + (e * sizeFactor))
		orbit.fill = "none";
		orbit.stroke = "white";
		orbit.linewidth = e*2;
		mainSet.add(orbit);
	});
}

function makeScalePlanets(){
	var scaledPlanets = [2.439, 6.052, 6.371, 3.389, 69.911, 58.232, 25.362, 24.622, 696.340];

	var distFromPrv = 1;

	scaledPlanets.forEach((e, i) => {
		var xpos = (i)* two.width/50 + distFromPrv * 10
		var planet = two.makeCircle(xpos, 0, e * Math.min(two.width, two.height)/500);

		planet.stroke = "none";
		scaleSet.add(planet);

		//change this later pls. It's sooooo UGLY!
		if(i<3) distFromPrv += 0;
		else if(i<4) distFromPrv += 9
		else if(i<5) distFromPrv += 17
		else if (i<6) distFromPrv += 10
		else if (i<7) distFromPrv += 6
		else if (i<8) distFromPrv += 100
	})
	scaleSet.scale = 0;
}