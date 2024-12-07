let count = 0;
let player;
let connector;
let YTMDesktopUrl = "http://127.0.0.1:9863";
let readyCheck = setInterval(function () {
	if (count > 3) {
		clearInterval(readyCheck);
		let rainbowCircle = false;
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('features') !== null && urlParams.get('features') !== "") {
			rainbowCircle = urlParams.get('features').split(" ").includes("rainbow-progressbar");
		}
		player = new Player(rainbowCircle);
		connector = new Connector(player);
	}
}, 500);
document.addEventListener("DOMContentLoaded", function () {
	let require = [
		"class/moment.min.js?v=2",
		"class/player.js?v=2",
		"class/connector.js?v=2",
		"class/GDMPSettings.js?v=2"
	];
	for (i in require) {
		var s = document.createElement('script');
		s.src = require[i];
		(document.head || document.documentElement).appendChild(s);
		s.onload = function () {
			count++;
		};
	}
	if (window.location.search.length > 0) {
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('features') !== null && urlParams.get('features') !== "") {
			urlParams.get('features').split(" ").forEach(function (value) {
				document.getElementsByTagName("body")[0].classList.add(value);
			});
		}
		if (urlParams.get('url') !== null && urlParams.get('url') !== "") {
			if (isValidUrl(urlParams.get('url'))) {
				YTMDesktopUrl = urlParams.get('url');
			} else {
				alert("Url " + urlParams.get('url') + " is not valid URL, btw dont forget about the port, usually :9863");
			}
		}
	}
});

function isValidUrl(string) {
	try {
		new URL(string);
		return true;
	} catch (err) {
		return false;
	}
}

$(window).resize(function () {
	if ($("body").hasClass("circle-progressbar")) {
		$('.song-info__album-art-image').circleProgress({size: $(".song-info__album-art-image").width() + 1});
	}
});
