$.when($.ready).then(function() {
	var $demo = $("#demo1");
	$demo.addClass("disabled");
	$demo.html("<p>Loading episodes</p>");

	var episode1Ready = false;
	var episode1 = new Audio("./part3.mp3");
	episode1.autoplay = false;
	episode1.loop = false;
	episode1.preload = "auto";
	$(episode1).one("canplaythrough", () => { 
		episode1Ready = true; 
		$demo.html("<p>Loading episode 2</p>");
		console.info("Episode 1 is ready");
	});

	var episode2Ready = false;
	var episode2 = new Audio("./part4.mp3");
	episode2.autoplay = false;
	episode2.loop = false;
	episode2.preload = "auto";
	$(episode2).one("canplay", () => { 
		episode2Ready = true; 
		$demo.html("<p>Loading episode 1</p>");
		console.info("Episode 2 is ready");
	});

	function doRun() {
		$(".demo").addClass("disabled");

		var $play = $("#play", $demo);
		$play.addClass("fa-beat");
		$("label", $demo).text("Playing!");

		episode2.currentTime = 0;
		episode2.volume = 1;

		episode1.currentTime = episode1.duration - 20;
		episode1.volume = 0;
		for(let i = 0 ; i < 100; i++) {
			_.delay(function() { episode1.volume = i * 0.01 }, 100 * i);
		}
		episode1.play();
		$(episode1).one("ended", () => {
			var utter = new SpeechSynthesisUtterance("Next up: \"The Lincoln Legends - Part Four: Smoke and Fire\"")
			utter.lang = "en-US";
			utter.volume = 0.5;
			utter.pitch = 0;
			utter.voice = voice;
			utter.addEventListener("end", function() {
				_.delay(function() { 
					episode2.play();
					for(let i = 0 ; i < 100; i++) {
						_.delay(function() { episode2.volume = 1 - i * 0.01 }, 10 * 1000 + 100 * i);
					}
					_.delay(function() { 
						episode2.pause(); 
					}, 20 * 1000);
				}, 2000);
			});
			_.delay(function() { window.speechSynthesis.speak(utter); }, 1000);
		});
		$(episode2).one("pause", () => {
			$(".demo").removeClass("disabled");
			tryRun();
		});
	}

	function tryRun() {
		if(voice == null) {
			$demo.addClass("disabled");
			$demo.html("<p class=\"lead\">Need to load a voice.</p>");
			_.delay(tryRun, 250);
			return;
		}
		if(!episode1Ready || !episode2Ready) {
			$demo.addClass("disabled");
			_.delay(tryRun, 250);
			return;
		}
		$demo.removeClass("disabled");
		$demo.html("<p class=\"lead\"><i id=\"play\" class=\"fa-solid fa-2xl fa-play\"></i><label>Play the Demo!</label></p>").one("click", doRun);
	}

	_.delay(tryRun, 1000);
	
});
