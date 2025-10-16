import os
import uvicorn
import cv2
import numpy as np
import mediapipe as mp
import math
import time
import random
import base64
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Initialize FastAPI and AI Models ---
app = FastAPI()

# --- ADDED: Feedback libraries for variety ---
ENCOURAGEMENT_PHRASES = ["You can do it!", "Push through!", "Almost there!", "Don't give up!"]
PUSHUP_DOWN_CUES = ["Go lower.", "Chest to the floor.", "Nice and controlled."]
PUSHUP_UP_CUES = ["Push all the way up.", "Extend your arms.", "Power up!"]
SQUAT_DOWN_CUES = ["Lower your hips.", "Break parallel."]
SQUAT_UP_CUES = ["Drive up!", "Stand tall."]

# Configure the Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env file.")
genai.configure(api_key=api_key)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# --- Define Request/Response Models ---
class ChatRequest(BaseModel):
    message: str

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "AI Backend is running."}

def calculate_angle(a, b, c):
    """Calculates the angle between three 2D points."""
    a, b, c = np.array(a), np.array(b), np.array(c)
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return angle if angle <= 180.0 else 360 - angle

@app.post("/analyze/snapshot")
async def analyze_snapshot(file: UploadFile = File(...)):
    # ... your existing image analysis endpoint code ...
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    results = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    if not results.pose_landmarks:
        raise HTTPException(status_code=400, detail="Could not detect a person in the image.")
    landmarks = [{"id": i, "name": mp_pose.PoseLandmark(i).name, "x": lm.x, "y": lm.y, "z": lm.z} for i, lm in enumerate(results.pose_landmarks.landmark)]
    return {"landmarks": landmarks}

@app.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    Receives a message from the user, sends it to the Gemini LLM,
    and returns the AI's response.
    """
    try:
        model = genai.GenerativeModel('models/gemini-flash-latest')
        response = model.generate_content(request.message)
        
        # Check if the response has text to avoid errors
        if response.text:
            return {"reply": response.text}
        else:
            # Handle cases where the model might not respond (e.g., safety settings)
            raise HTTPException(status_code=500, detail="Failed to get a valid response from the AI model.")
            
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred with the AI service.")
    
def analyze_pushup(landmarks, state):
    # ... (Implementation can be added here following the same pattern)
    return "Pushup analysis coming soon.", state

def analyze_bicep_curl(landmarks, state):
    # ... (Implementation can be added here following the same pattern)
    return "Bicep curl analysis coming soon.", state

def analyze_squat(landmarks, state):
    # ... (Implementation can be added here following the same pattern)
    return "Squat analysis coming soon.", state

def classify_starting_pose(landmarks):
    try:
        shoulder_y = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
        hip_y = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        ankle_y = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y
        if abs(shoulder_y - hip_y) < 0.15 and abs(hip_y - ankle_y) < 0.15:
            return "pushup"
    except Exception:
        return None # In case landmarks are not visible
        
    return None

def analyze_pushup(landmarks, state): # noqa: F811
    feedback = ""
    try:
        # Get landmarks for BOTH shoulders, elbows, and wrists
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
        left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
        right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
        
        # Calculate angle for both elbows and average them for stability
        left_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
        right_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)
        elbow_angle = (left_angle + right_angle) / 2
    
        # Time-based struggle detection
        time_in_stage = time.time() - state["last_stage_time"]
        if time_in_stage > 5 and state["stage"] == 'down':
            feedback = random.choice(ENCOURAGEMENT_PHRASES)
            return feedback, state
    
        if elbow_angle > 160:
            if state['stage'] == 'down': # If we just came up from a down position
                state['counter'] += 1
                feedback = f"Rep {state['counter']}"
            state['stage'] = 'up'
        elif elbow_angle < 90:
            if state['stage'] != 'down':
                feedback = random.choice(PUSHUP_DOWN_CUES)
            state['stage'] = 'down'
            state['last_stage_time'] = time.time()
        else: # In the middle of the movement
            if state['stage'] == 'up': feedback = random.choice(PUSHUP_UP_CUES)
            else: feedback = "Push up!"
                 
    except Exception:
        feedback = "Keep your body in frame."
    
    return (feedback if feedback else "Keep good form."), state
    
@app.websocket("/analysis/live-posture")
async def live_posture_analysis(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established.")    
    # State is now local to each connection
    workout_state = {
        "counter": 0,
        "stage": "",
        "current_workout": None,
        "last_stage_time": time.time()
    }
    
    try:        
        while True:
            base64_string = await websocket.receive_text()
            
            # Decode the Base64 string
            if "," in base64_string:
                base64_string = base64_string.split(',')[1]

            try:
                img_data = base64.b64decode(base64_string)
                nparr = np.frombuffer(img_data, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img is None:
                    continue 
            except Exception as e:
                print(f"Error decoding image: {e}")
                continue 

            # Process the image with MediaPipe
            results = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
            
            feedback = "Get into a starting pose."
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                
                # If no workout is currently detected, try to classify the pose
                if not workout_state["current_workout"]:
                    detected_pose = classify_starting_pose(landmarks)
                    if detected_pose:
                        workout_state["current_workout"] = detected_pose
                        # Reset state for the new workout
                        workout_state["counter"] = 0
                        workout_state["stage"] = ""
                        workout_state["last_stage_time"] = time.time() # Reset timer
                        feedback = f"Detected {detected_pose}. Let's begin."

                # If a workout is active, run its specific analysis engine
                elif workout_state["current_workout"] == "pushup":
                    feedback, workout_state = analyze_pushup(landmarks, workout_state)
                # Add other exercises here as you build them
                # elif workout_state["current_workout"] == "bicep_curl":
                #     feedback, workout_state = analyze_bicep_curl(landmarks, workout_state)
                # elif workout_state["current_workout"] == "squat":
                #     feedback, workout_state = analyze_squat(landmarks, workout_state)
                
            await websocket.send_json({"feedback": feedback})

    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        print("WebSocket connection closed.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)