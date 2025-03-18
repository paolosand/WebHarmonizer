let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

startBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Play the recorded audio
        const audioElement = document.getElementById('audioPlayback');
        audioElement.src = audioUrl;

        // Create download link
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = audioUrl;
        downloadLink.download = 'recording.webm';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Recording';
    };

    mediaRecorder.start();
    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
});