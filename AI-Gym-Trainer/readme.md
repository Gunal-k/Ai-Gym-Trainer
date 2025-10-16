# AI Gym Trainer (Frontend)

This is the frontend mobile application for the AI Gym Trainer, built with React Native and Expo. It provides the user interface for authentication, profile management, and interaction with the AI backend for fitness analysis.

---
## **Technology Stack** ⚛️

* **Framework**: React Native
* **Platform**: Expo SDK
* **Navigation**: React Navigation
* **Cloud Services**: Firebase (Authentication, Firestore), Cloudinary (Image Storage)
* **Camera/Media**: `expo-camera`, `expo-image-picker`

---
## **Prerequisites**

* Node.js (LTS version)
* Expo Go app on your physical iOS or Android device
* An API client like Insomnia or Postman for testing

---
## **Setup Instructions**

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd <frontend-folder-name>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**

    Create a file named `.env` in the root of the frontend folder. This file will store your secret keys and project configurations. Populate it with your credentials from Firebase and Cloudinary.

    ```env
    # .env file

    # --- Firebase Credentials ---
    EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
    EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    EXPO_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"

    # --- Cloudinary Credentials ---
    EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
    EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset_name"
    ```

---
## **Running the Application**

1.  **Start the Backend First!**
    Ensure your Python backend server is running before you start the frontend.

2.  **Start the Frontend Server**
    Run the following command to start the Metro bundler.
    ```bash
    npx expo start
    ```

3.  **Connect Your Device**
    * **On a physical device**: Open the Expo Go app and scan the QR code displayed in the terminal.
    * **On a simulator/emulator**: Press `i` to open the iOS Simulator or `a` to open the Android Emulator.

    **Note**: Make sure your physical device and your computer are on the **same Wi-Fi network**.