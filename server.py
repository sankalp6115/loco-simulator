from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder="static")

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/frames')
def serve_frames():
    frame_dir = os.path.join(app.static_folder, 'frame')
    frame_files = sorted([f for f in os.listdir(frame_dir) if f.lower().endswith('.jpg')])
    frames = []
    for filename in frame_files:
        with open(os.path.join(frame_dir, filename), 'rb') as f:
            frames.append(base64.b64encode(f.read()).decode('utf-8'))
    return {
        "frame_rate": 30,
        "frames": frames,
        "total_frames": len(frames)
    }
