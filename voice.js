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
	if(voice == null || voices.length <= 0) {
		$voices.append("<option selected>No text-to-speech voices found.</option>");
		return;
	}
	for(let i = 0; i < voices.length; i++) {
		let v = voices[i];
		if(v.lang == "en-US" || v.lang == "en-GB") {
			console.info("Adding voice", v.name, v.lang, v.voiceURI);
			let option = $("<option " + (v.lang == voice.lang && v.name == voice.name ? "selected" : "") + " value=\"" + i + "\">" + v.name + "</option>");
			$voices.append(option);
		}
	}
}

$.when($.ready).then(function() {
	let $voices = $("select#voices");
	$voices.change(function() {
		let newVoiceIdx = $voices.prop("value");
		console.info("Change fired on voices", newVoiceIdx);
		let voices = window.speechSynthesis.getVoices();
		voice = voices[parseInt(newVoiceIdx)];
		console.info("Updating voice");
		var utter = new SpeechSynthesisUtterance("Hello, I am " + voice.name);
		utter.lang = "en-US";
		utter.volume = 0.5;
		utter.pitch = 0;
		utter.voice = voice;
		window.speechSynthesis.speak(utter);
	});
	populateVoices();
	window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
});
