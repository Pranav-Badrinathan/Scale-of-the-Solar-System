var two;
var sizeFactor = 500;

$(function(){
	initTwo();

	var sun = two.makeCircle(two.width/2, two.height/2, 0.004655 * sizeFactor);
	sun.fill = "#faffc7";
	sun.stroke = "none";

	makeOrbits();

	$("#clickable").click(() => {
		console.log("CLICK!!!");
	})

	$("#clickable").contextmenu(() => {
		console.log("RIGHT CLICK!!!");
	})
	addZUI();
});

function initTwo(){
	two = new Two({ fullscreen: true, autostart: true }).appendTo($("#clickable").get()[0]);
}

function makeOrbits(){
	//Distance from Sun to all planets and pluto in AU
	var distInAU = [0.39, 0.723, 1, 1.524, 5.203, 9.539, 19.18, 30.06, 39.53];

	distInAU.forEach(e => {
		var orbit = two.makeCircle(two.width/2, two.height/2, 5 + (e * sizeFactor))
		orbit.fill = "none";
		orbit.stroke = "white";
	});
}