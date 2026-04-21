# Welcome to my-auth-app (Expo app) 👋

A robust, production-ready authentication system built with **React Native** and **Expo**. This project demonstrates a secure, persistent login flow with a focus on high-performance UI and professional-grade state management.

## Get started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/rfengl/my-auth-app.git](https://github.com/rfengl/my-auth-app.git)
   cd my-auth-app

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## 🛠 Architecture & Navigation

I utilized Expo Router, the modern standard for Expo applications. While it leverages file-based routing, it is built directly on top of React Navigation's core, providing a more robust and type-safe navigation experience while meeting the requirement for a professional authentication flow.

# Key Implementation Details:

- Conditional Stack Guarding: The app automatically switches between the (auth) and (tabs) stacks based on the user's login state, preventing unauthorized access to internal screens.

- Asynchronous Lifecycle Management: Used a dedicated isLoading flag within the AuthContext to prevent "flickering" or unauthenticated content flashes during the initial boot sequence.

## ✨ Features

1. Persistent Authentication

Utilizes AsyncStorage to act as a long-term persistence layer. The app "remembers" users after they close the application, restoring their session automatically upon re-entry.

2. Advanced Form Handling

- Atomic Performance Optimization: Leveraged Zustand selectors and React.memo on the "Signup page" to isolate re-renders at the input level. This ensures that typing in one field does not trigger a re-render of the entire form or parent screen, maintaining 60FPS performance even with dozens of inputs.

- Keyboard Awareness: Implemented KeyboardAvoidingView and TouchableWithoutFeedback to ensure a seamless input experience on mobile devices without hiding input fields.

- Validation Layer: Integrated a custom validation utility to provide real-time feedback to users during the login and signup process.

3. Themed Components
A centralized theme system supporting both Light and Dark modes.

4. Cross-Platform Optimization
The UI is carefully adjusted for iOS, Android, and Web, including platform-specific offsets and event-handling to ensure the app feels "native" regardless of the device.


## 📂 Project Structure

- app/: File-based routes and layout configurations.

- components/: Atomic UI components (Buttons, Inputs, Forms).

- context/: Authentication state and session providers.

- utils/: Helper functions for validation, alerts, and storage.

- assets/: Images, fonts, and static resources.