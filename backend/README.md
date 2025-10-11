# Backend - AI Gym Trainer (FastAPI)
## Setup
1. Create a python virtualenv:
   py -3.10 -m venv venv
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   venv\Scripts\activate

2. Install requirements:
   pip install -r requirements.txt

3. Run the server:
   uvicorn app:app --reload --host 0.0.0.0 --port 8000

## stop venv
 deactivate