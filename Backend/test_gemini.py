# test_gemini.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

print("--- Starting Gemini API Test ---")

try:
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in .env file.")

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel('models/gemini-flash-latest')
    response = model.generate_content("This is a test.")

    if response.text:
        print(f"✅ SUCCESS: Received response from Gemini: '{response.text[:30]}...'")
    else:
        print("❌ FAILURE: Got an empty response from Gemini.")

except Exception as e:
    print(f"An error occurred during the Gemini test: {e}")

print("--- Gemini API Test Finished ---")