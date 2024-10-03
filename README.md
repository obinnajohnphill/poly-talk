# PolyTalk

PolyTalk is a cross-platform React Native app designed for effortless real-time conversation translation. It uses speech recognition, Google Translate API, and text-to-speech capabilities to recognize, translate, and speak text across multiple languages. The app runs on Android, iOS, and web platforms.

## Features

- **Speech Recognition**: Recognizes speech input in multiple languages.
- **Real-time Translation**: Utilizes Google Translate API to translate text in real-time.
- **Text-to-Speech**: Converts translated text back into speech.
- **Cross-Platform Support**: Works on Android, iOS, and web browsers.

## Installation

### Prerequisites

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/) (>=14.x)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development on macOS)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [CocoaPods](https://cocoapods.org/) (for iOS dependency management)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/PolyTalk.git
    cd PolyTalk
    ```

2. Install dependencies:

    ```bash
    npm install
    cd ios
    pod install
    cd ..
    ```

3. Run the app:

   - For **iOS** (macOS only):
     ```bash
     npx react-native run-ios
     ```

   - For **Android**:
     ```bash
     npx react-native run-android
     ```

   - For **Web**:
     ```bash
     npm run web
     ```

## Environment Setup

### Google API Key

To use the Google Translate API, you need a Google Cloud project with the Translation API enabled.

1. Create a Google Cloud project.
2. Enable the Translation API.
3. Generate an API key.
4. Replace the placeholder `YOUR_GOOGLE_API_KEY` in the `App.js` file with your actual Google API key:

    ```javascript
    const API_KEY = "YOUR_GOOGLE_API_KEY";
    ```

### iOS Setup

Make sure to install CocoaPods for iOS dependencies:

```bash
cd ios
pod install
