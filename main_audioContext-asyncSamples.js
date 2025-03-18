let audioContext;
let samples;
const startCtxBtn = document.querySelector(".start");
const setupSamplesBtn = document.querySelector(".setup-samples");
const playSampleBtn = document.querySelector(".play-sample");

const samplePaths = ["./audio/kick_00.mp3", "./audio/snare_00.mp3", "audio/[SIRENS REMIX] Electronic Music - Assignment 2 - 11_26_24, 10.56 AM.m4a"]

startCtxBtn.addEventListener("click", () => {
    audioContext = new AudioContext();
    console.log("Audio Context Initialized")
});

setupSamplesBtn.addEventListener("click", () => {
    setupSamples(samplePaths).then((response) => {
        samples = response;
        console.log(samples);
        playSampleBtn.addEventListener("click", () => {
            const playing = playSample(samples[2], 0);
            console.log(playing);
            setTimeout(() => {
                playing.stop();
            }, 3000)
        });
    });
});

async function getFile(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
};

async function setupSamples(paths) {
    console.log("Setting up samples");
    const audioBuffers = [];
    
    for (const path of paths){
        const sample = await getFile(path);
        audioBuffers.push(sample);
    }

    console.log("Setting up done");
    return audioBuffers;
}

function playSample(audioBuffer, time){
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination);

    sampleSource.start(time);
    return sampleSource;
}

