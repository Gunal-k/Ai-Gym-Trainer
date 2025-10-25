# test_mediapipe.py
import cv2
import mediapipe as mp
import numpy as np

print("--- Starting MediaPipe Test ---")

try:
    # Initialize MediaPipe
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(static_image_mode=True)

    # Create a dummy black image
    dummy_image = np.zeros((480, 640, 3), dtype=np.uint8)

    # Process the image
    results = pose.process(dummy_image)

    # Check the results object
    if hasattr(results, 'pose_landmarks'):
        print("✅ SUCCESS: MediaPipe processed the image and found the 'pose_landmarks' attribute.")
    else:
        print("❌ FAILURE: MediaPipe 'results' object is missing 'pose_landmarks'.")
        print("Object type is:", type(results))

except Exception as e:
    print(f"An error occurred during the MediaPipe test: {e}")

print("--- MediaPipe Test Finished ---")