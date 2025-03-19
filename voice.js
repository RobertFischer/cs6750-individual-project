var voice = null;

function populateVoices() {
	let voices = window.speechSynthesis.getVoices();

	console.info("Populating voices");
	console.info("Voice count: ", voices.length);

	if(voice == null) {
		for(let i = 0; i < voices.length; i++) {
			if(voices[i].default) {
				console.info("Setting default voice: ", voices[i].name);
				voice = voices[i];
				break;
			}
		}
		for(let i = 0; i < voices.length; i++) {
			if(voices[i].name == "Samantha") {
				console.info("Setting default voice: ", voices[i].name);
				voice = voices[i];
				break;
			}
		}
		for(let i = 0; i < voices.length; i++) {
			if(voices[i].name == "Google US English") {
				console.info("Setting default voice: ", voices[i].name);
				voice = voices[i];
				break;
			}
		}
	}

	let $voices = $("select#voices");
	$voices.empty();
	for(let i = 0; i < voices.length; i++) {
		let v = voices[i];
		if(v.lang == "en-US" || v.lang == "en-GB") {
			let option = $("<option " + (v.name == voice.name ? "selected" : "") + " value=\"" + v.name + "\">" + v.name + "</option>");
			$voices.append(option);
		}
	}
}

$.when($.ready).then(function() {
	let $voices = $("select#voices");
	$voices.change(function() {
		let newVoiceName = $voices.prop("value");
		console.info("Change fired on voices", newVoiceName);
		let voices = window.speechSynthesis.getVoices();
		for(let i = 0; i < voices.length; i++) {
			if(voices[i].name == newVoiceName) {
				console.info("Updating voice");
				voice = voices[i];
				var utter = new SpeechSynthesisUtterance("Hello, I am " + voice.name);
				utter.lang = "en-US";
				utter.volume = 0.5;
				utter.pitch = 0;
				utter.voice = voice;
				window.speechSynthesis.speak(utter);
				break;
			}
		}
	});
	populateVoices();
	window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
});
