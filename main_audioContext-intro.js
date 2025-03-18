const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const stopBtn = document.querySelector(".stop");

const audioContext = new AudioContext();
const audio = new Audio("./audio/[SIRENS REMIX] Electronic Music - Assignment 2 - 11_26_24, 10.56 AM.m4a");

const source = audioContext.createMediaElementSource(audio);
const volume = audioContext.createGain();
volume.gain.value = 0.5;

source.connect(volume);

volume.connect(audioContext.destination);

playBtn.addEventListener("click", () => {
    if(audioContext.state === "suspended"){
        audioContext.resume();
    }
    audio.play();
});

pauseBtn.addEventListener("click", () => {
    audio.pause();
});

stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0; // start from scratch
});
