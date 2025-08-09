import cv2
import os
import sys

def video_to_frames(video_path, target_fps=1):
    # Get video name without extension
    video_name = os.path.splitext(os.path.basename(video_path))[0]
    output_dir = "frame"
    os.makedirs(output_dir, exist_ok=True)

    # Load video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Cannot open video file.")
        return

    # Get original video FPS
    orig_fps = cap.get(cv2.CAP_PROP_FPS)
    if orig_fps == 0:
        print("Error: Could not determine FPS of the video.")
        cap.release()
        return

    # Calculate frame interval
    if target_fps <= 0:
        print("Warning: target_fps must be greater than 0. Using default value of 1.")
        target_fps = 1

    frame_interval = int(round(orig_fps / target_fps))
    if frame_interval == 0:
        print(f"Warning: target_fps ({target_fps}) is too high for video FPS ({orig_fps}). Forcing frame_interval to 1.")
        frame_interval = 1

    count = 0
    saved = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if count % frame_interval == 0:
            frame_path = os.path.join(output_dir, f"frame_{saved:04d}.jpg")
            cv2.imwrite(frame_path, frame)
            saved += 1

        count += 1

    cap.release()
    print(f"Done: Saved {saved} frames to '{output_dir}'")

# Example usage
if __name__ == "__main__":
    video_path = r"D:\Coding\Working_Directory\Train SIm Canvas Frame\video.webm"
    target_fps = 30
    video_to_frames(video_path, target_fps)
