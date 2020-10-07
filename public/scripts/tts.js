/* JS comes here */
let isSpeaking = false;
let msg = document.getElementById("text-to-speech").innerText;

let speech = new SpeechSynthesisUtterance();

const languages = new Map()
speech.lang = "en-IN";

speech.text = msg;
speech.volume = 1;
speech.rate = 0.85;
speech.pitch = 1;

let synth = window.speechSynthesis;

window.addEventListener("load", () => {
  synth.pause();
  synth.cancel();
});

document.getElementById("speak").addEventListener("click", () => {
  synth.pause();
  synth.cancel();
  synth.speak(speech);
  isSpeaking = true;
  console.log(isSpeaking);
  var r = setInterval(function () {
    console.log(synth.speaking);
    if (!synth.speaking && isSpeaking == false) clearInterval(r);
    else if (isSpeaking == true) synth.resume();
  }, 14000);
});

document.getElementById("stop").addEventListener("click", () => {
  console.log("Stopped");
  synth.pause();
  synth.cancel();
  clearInterval(r);
  isSpeaking = true;
});

document.getElementById("toggle").addEventListener("click", () => {
  if (isSpeaking == false) {
    isSpeaking = true;
    synth.resume();
    console.log(isSpeaking);
  } else {
    isSpeaking = false;
    synth.pause();
    console.log(isSpeaking);
  }
});
