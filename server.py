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
    frame_urls = [f"/static/frame/{f}" for f in frame_files]
    return {
        "frame_rate": 30,
        "frames": frame_urls,
        "total_frames": len(frame_urls)
    }
