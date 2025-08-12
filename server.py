from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__, static_folder="static")

# Update these for your setup
TOTAL_FRAMES = 2773
FRAME_RATE = 30
JSDELIVR_BASE = "https://cdn.jsdelivr.net/gh/sankalp6115/loco-sim-frames/"

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/frames')
def serve_frames():
    # Generate a list of all frame URLs
    frames = [f"{JSDELIVR_BASE}frame_{i:04}.jpg" for i in range(TOTAL_FRAMES)]
    return jsonify({
        "frame_rate": FRAME_RATE,
        "frames": frames,
        "total_frames": len(frames)
    })

if __name__ == '__main__':
    app.run(debug=True)
