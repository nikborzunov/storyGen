# storyGen

storyGen is a dynamic React Native Expo application that delivers a unique storytelling experience. Whether you want to read your favorite fairy tales or listen to them in beautifully synthesized voices, storyGen provides an immersive platform with innovative features like custom theme creation, text animation modes, and voice cloning powered by ElevenLabs. The app is designed with a focus on user experience, performance, and security, complemented by seamless integration with Google OAuth for smooth authentication.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

---

## Overview

storyGen lets you explore an extensive library of fairy tales, each designed with meticulous detail. It supports:
- Interactive reading of tales across 100 diverse themes.
- Adding and customizing your own story themes.
- Listening to stories using advanced audio generation powered by ElevenLabs.
- Viewing text with authentic aesthetics, reminiscent of an ancient storybook, complete with typewriter-style animation effects.
- Personalizing audio narration by cloning voices—enabling narrations in the familiar tones of family members, such as a mother or grandmother.
- Managing a rich history of your favorite tales, with capabilities for searching and sorting by themes and keywords.
- Secure one-click authentication via Google OAuth to provide a fast and user-friendly login experience.

---

## Features

- **Multi-Theme Story Library:**  
  Discover over 100 fairy tale themes. Add new themes to create custom narratives that cater to your interests.

- **Immersive Audio Experience:**  
  Listen to fairy tales narrated with AI-generated voices from ElevenLabs. Switch between standard narration and custom voices cloned from your family members.

- **Dynamic Text Animations:**  
  Enjoy reading text that appears in a vintage style, resembling an ancient parchment. Enable smooth typewriter animation to accompany the audio playback.

- **Personalization & History:**  
  Build your story history, search past tales, and revisit stories easily. Customize your reading experience with themes supporting both light and dark modes.

- **Secure and Seamless Authentication:**  
  Leverage Google OAuth for one-click authentication, ensuring your data remains private and secure.

- **Robust Error Handling:**  
  The app is built with best practices in resilience and fault tolerance to provide a reliable user experience even during unforeseen errors.

---

## Technologies

- **React Native & Expo:**  
  Build high-performance, cross-platform mobile experiences effortlessly.

- **Expo Router & Navigation:**  
  Seamlessly manage screen transitions and deep linking within the app.

- **ElevenLabs Integration:**  
  Generate high-quality, synthetic voiceovers that bring your stories to life.

- **Redux Toolkit:**  
  Manage state predictably across your application.

- **Axios:**  
  Handle HTTP requests with ease, integrating deeply with backend services.

- **Custom Animations:**  
  Utilize advanced React Native animation techniques to deliver engaging user interface effects.

- **Google OAuth:**  
  Implement a secure, one-tap authentication system for effortless login.

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://classic.yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) installed globally

### Steps

1. **Clone the repository:**

   git clone <repository-url>

2. **Navigate to the project directory:**

   cd storyGen

3. **Install dependencies:**

   Using yarn:
   yarn install
   
   Or using npm:
   npm install

4. **Configure the app:**  
   Review and update the configuration in `app.config.js` to match your assets, bundle identifiers, and environment-specific variables.

---

## Development

### Running the App

- **Start the development server:**

  yarn start  
  or  
  npm run start

- **Launch on Android:**

  yarn android  
  or  
  npm run android

- **Launch on iOS:**

  yarn ios  
  or  
  npm run ios

- **Run on Web:**

  yarn web  
  or  
  npm run web

### Scripts Overview

- `start`: Launch the Expo development server.
- `reset-project`: Runs a custom reset script to revert configurations.
- `test`: Execute unit and integration tests using Jest.
- `lint`: Perform code linting to maintain code quality and style consistency.

---

## Usage

storyGen provides an intuitive user interface that highlights the uniqueness of each fairy tale:

- **Explore & Read:**  
  Browse through a well-curated list of 100+ story themes or search using keywords and sorting tools.

- **Listen & Engage:**  
  Activate audio mode to listen to stories narrated by AI. Choose between the default synthesized voice or your personalized family voices.

- **Customize Your Experience:**  
  Toggle between light and dark themes. Enable dynamic text animation for a more engaging reading/audio experience.

- **History & Favorites:**  
  Keep track of your reading and listening history. Easily access and re-experience your favorite tales.

- **Secure Login:**  
  Enjoy hassle-free authentication with Google OAuth. The smooth login process ensures you’re always a click away from your favorite stories.

---

## Project Structure

- **/src/assets/images/**  
  Contains all image assets including icons, splash screens, and adaptive icons.

- **expo-router/**  
  Entry point for the application, handling route management and screen transitions.

- **app.config.js:**  
  Central configuration for your Expo app—including app metadata, splash screens, and extra configuration values.

- **package.json:**  
  Defines project scripts, dependencies, and project-level configurations.

- **/scripts/**  
  Includes any custom scripts such as project reset scripts.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with meaningful messages.
4. Open a pull request to merge your improvements.

For major changes, please open an issue first to discuss what you would like to change.

---

## Contact

For questions, suggestions, or further collaboration, reach out to me on Telegram: [kupilulitku](https://t.me/kupilulitku)

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy storytelling and enjoy exploring the magic of storyGen!