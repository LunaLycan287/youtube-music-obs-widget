class Player {
	trackTimeInterval;
	lastTrackTime = null;
	rainbowCircle;

	constructor(rainbowCircle) {
		this.lastUpdateData = {};
		this.isPlaying = false;
		this.rainbowCircle = rainbowCircle;
	}

	updateSongInfo(playerInfo) {
		if (playerInfo.playState === true) {
			this.isPlaying = true;
			$("body").removeClass("isOffline");
			$("body").removeClass("paused");
			if (this.lastUpdateData.hasOwnProperty("track") && JSON.stringify(this.lastUpdateData.track) === JSON.stringify(playerInfo.track)) {
				this.updateTrackTime(playerInfo);
			} else {
				if (playerInfo.hasOwnProperty("track") === false) {
					return;
				}
				if (playerInfo.track.hasOwnProperty("cover")) {
					let img = new Image();
					let that = this;
					img.onload = function () {
						that.updateTrackInfo(playerInfo);
					};
					img.src = this.getAlbumArt(playerInfo.track.cover, 420, 420);
				} else {
					this.updateTrackInfo(playerInfo);
				}

			}
		} else {
			this.isPlaying = false;
			$("body").addClass("isOffline");
			$("body").addClass("paused");
		}
		this.lastUpdateData = playerInfo;
	}

	periodicallyUpdateTrackTime(setTime) {
		let newTimeSet = false;
		if (this.lastTrackTime === null) {
			this.lastTrackTime = new Date(setTime);
		} else {
			let newTime = new Date(setTime);
			if (Math.abs(this.lastTrackTime - newTime) > 100) {
				this.lastTrackTime = new Date(setTime);
			}
		}

		if (this.lastTrackTime === null) {
			return;
		}
		let el = $(".online .song-info__time");
		if(el.length === 0) {
			return;
		}
		let total = parseInt(el.find("progress").attr("max"));
		let from = 14;
		let length = 5;
		if (total >= 3600000) {
			from = 11;
			length = 8;
		}
		let dateTotal = new Date(total);
		if (this.lastTrackTime > dateTotal) {
			return;
		}
		el.find(".song-info__time-current").text(this.lastTrackTime.toISOString().substr(from, length));
		el.find(".song-info__time-max").text(dateTotal.toISOString().substr(from, length));
	}

	updateTrackTime(playerInfo) {
		if (playerInfo.hasOwnProperty("time")) {
			let el = $(".online .song-info__time");
			el.find("progress").attr("max", playerInfo.time.total);
			el.find("progress").attr("value", playerInfo.time.current);
			if ($("body").hasClass("circle-progressbar") && $('.song-info__album-art-image').length) {
				$('.song-info__album-art-image').circleProgress('value', playerInfo.time.current / playerInfo.time.total);
			}
			this.periodicallyUpdateTrackTime(playerInfo.time.current);
		}
	}

	updateTrackInfo(playerInfo) {
		let el = $(".online");
		if (playerInfo.hasOwnProperty("track")) {
			el.find(".song-info__title").text(playerInfo.track.title);
			if (playerInfo.track.hasOwnProperty("author")) {
				el.find(".song-info__artist-name").text(playerInfo.track.author);
			}
			if (playerInfo.track.hasOwnProperty("thumbnails") && playerInfo.track.thumbnails.length > 0) {
				el.find(".song-info__album-art").empty();
				el.find(".song-info__album-art").append($('<div class="song-info__album-art-image" style="background-image:url(\'' + this.getAlbumArt(playerInfo.track.thumbnails[0].url, 420, 420) + '\')"></div>'));
				$(".artist-background").css("background-image", "url('" + this.getAlbumArt(playerInfo.track.thumbnails[0].url, 420, 420) + "')");
				if ($("body").hasClass("circle-progressbar")) {
					let fillValue = { color: 'rgba(255,255,255, .4)' };
					if(this.rainbowCircle) {
						fillValue = {
							gradient: [
								['rgba(255, 0, 0, 1)', 0],
								['rgba(255, 154, 0, 1)', 0.1],
								['rgba(208, 222, 33, 1)', 0.2],
								['rgba(79, 220, 74, 1)', 0.3],
								['rgba(63, 218, 216, 1)', 0.4],
								['rgba(47, 201, 226, 1)', 0.5],
								['rgba(28, 127, 238, 1)', 0.6],
								['rgba(95, 21, 242, 1)', 0.7],
								['rgba(186, 12, 248, 1)', 0.8],
								['rgba(251, 7, 217, 1)', 0.9],
								['rgba(255, 0, 0, 1)', 1],
							],
							gradientAngle: 90,
						};
					}

					$('.song-info__album-art-image').circleProgress({
						value: 0,
						startAngle: -Math.PI / 2,
						animation: { duration: 100, easing: "circleProgressEasing" },
						size: $(".song-info__album-art-image").width() + 1,
						fill: fillValue,
						thickness: $(".song-info__album-art-image").width()/20
					});
				}
			}
			this.updateTrackTime(playerInfo);
		}
	}

	getAlbumArt(url, width, height) {
		return url.replace("w60-h60", "w" + width + "-h" + height);
	}
}
