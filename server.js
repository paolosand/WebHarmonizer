const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Ensure the "audio" directory exists
const audioDir = path.join(__dirname, "audio");
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
}

// Configure multer to save files to "audio/" directory
const storage = multer.diskStorage({
    destination: audioDir,
    filename: (req, file, cb) => {
        cb(null, "recording-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Handle file uploads
app.post("/upload", upload.single("audio"), (req, res) => {
    res.json({ message: "File uploaded successfully!", filename: req.file.filename });
});

// Serve saved audio files
app.use("/audio", express.static(audioDir));

// API to list saved audio files
app.get("/audio-files", (req, res) => {
    fs.readdir(audioDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: "Error reading files" });
            return;
        }
        res.json(files);
    });
});

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
