import cv2
import os

video_path = 'public/video/video/gemini_generated_video_81941c61.mp4'
output_dir = 'public/frames'

os.makedirs(output_dir, exist_ok=True)
cap = cv2.VideoCapture(video_path)

frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Save as webp with good quality
    output_path = os.path.join(output_dir, f'frame_{frame_idx:03d}.webp')
    cv2.imwrite(output_path, frame, [cv2.IMWRITE_WEBP_QUALITY, 80])
    frame_idx += 1

cap.release()
print(f"Extracted {frame_idx} frames successfully.")
