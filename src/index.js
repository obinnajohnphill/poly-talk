import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';  // Adjusted to point to the correct App.js inside src
import { createRoot } from 'react-dom/client';
import { name as appName } from './app.json';  // Only keep this import

// Register the app for React Native platforms (Android/iOS)
AppRegistry.registerComponent(appName, () => App);

// Render for Web
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
