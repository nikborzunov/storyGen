# storyGen

storyGen is a dynamic React Native Expo application that delivers a unique storytelling experience. Enjoy reading or listening to fairy tales with features like custom theme creation, text animations, and voice cloning powered by ElevenLabs. Designed with a focus on user experience, performance, and security, storyGen integrates seamlessly with Google OAuth for effortless authentication.

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

storyGen offers an extensive library of fairy tales with:
- Interactive reading across 100+ themes.
- Customizable story themes.
- Audio narration with AI-generated voices from ElevenLabs.
- Vintage, typewriter-style text animations.
- Personalized audio narration using cloned family voices.
- A rich history of favorite tales with advanced search and sorting.
- One-click, secure sign-in via Google OAuth.

---

## Features

- **Multi-Theme Library:**  
  Discover over 100 fairy tale themes and add your own custom themes.

- **Immersive Audio:**  
  Listen to tales with high-quality AI-generated voices. Choose between standard narration or personalized, cloned family voices.

- **Dynamic Text Animations:**  
  Enjoy text rendered in an ancient, storybook style with smooth typewriter effects.

- **Personalized Experience:**  
  Save your reading history, customize themes (light/dark modes), and revisit your favorite stories with ease.

- **Secure Authentication:**  
  Leverage one-click Google OAuth for fast and secure sign-in.

- **Robust Error Handling:**  
  Built with resilience in mind to ensure a consistent and reliable user experience.

---

## Technologies

- **React Native & Expo:**  
  For building high-performance, cross-platform mobile applications.

- **Expo Router & Navigation:**  
  Manage screen transitions and deep linking with ease.

- **ElevenLabs Integration:**  
  Generate lifelike, synthesized voice narrations.

- **Redux Toolkit:**  
  For predictable and streamlined state management.

- **Axios:**  
  Handle HTTP requests and interact with backend services seamlessly.

- **Custom Animations:**  
  Utilize advanced React Native animation techniques for an engaging UI.

- **Google OAuth:**  
  Secure one-tap authentication for a smooth login experience.

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://classic.yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) (installed globally)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd storyGen
   ```

3. **Install Dependencies:**

   Using Yarn:
   ```bash
   yarn install
   ```
   or using npm:
   ```bash
   npm install
   ```

4. **Configure the App:**  
   Update `app.config.js` to match your assets, bundle identifiers, and environment variables.

---

## Development

### Running the App

- **Start the Expo Development Server:**

  ```bash
  yarn start
  ```
  or
  ```bash
  npm run start
  ```

- **Launch on Android:**

  ```bash
  yarn android
  ```
  or
  ```bash
  npm run android
  ```

- **Launch on iOS:**

  ```bash
  yarn ios
  ```
  or
  ```bash
  npm run ios
  ```

- **Run on Web:**

  ```bash
  yarn web
  ```
  or
  ```bash
  npm run web
  ```

### Available Scripts

- `start`: Launch the Expo development server.
- `reset-project`: Run a custom script to revert configurations.
- `test`: Execute unit and integration tests using Jest.
- `lint`: Lint the codebase to ensure quality and consistency.

---

## Usage

storyGen provides an intuitive interface that makes it easy to:

- **Explore & Read:**  
  Browse through over 100 story themes or search using keywords and advanced sorting.

- **Listen & Engage:**  
  Activate audio mode to listen to AI-narrated or personalized fairy tales.

- **Customize Your Experience:**  
  Toggle between light and dark themes and enable immersive text animations.

- **Manage Your History:**  
  Easily view your reading and listening history, and re-experience your favorite tales.

- **Secure Login:**  
  Utilize Google OAuth for a fast, one-click authentication process.

---

## Project Structure

- **/src/assets/images/**  
  Contains image assets (icons, splash screens, adaptive icons).

- **expo-router/**  
  Main entry point for routing and screen transitions.

- **app.config.js:**  
  Central configuration for the Expo app (metadata, splash screens, etc.).

- **package.json:**  
  Project-level configurations, scripts, and dependencies.

- **/scripts/**  
  Contains custom scripts, such as project reset scripts.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit changes with clear, meaningful messages.
4. Open a pull request to merge your updates.

For major changes, please open an issue first to discuss your proposed changes.

---

## Contact

Questions, suggestions, or collaboration ideas? Reach out on Telegram: [@kupilulitku](https://t.me/kupilulitku)

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy storytelling and enjoy exploring the magic of storyGen!
