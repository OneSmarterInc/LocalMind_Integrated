# LocalMind Frontend 📱💻

The frontend for **LocalMind** is a modern, responsive React Native & Expo application supporting **Web**, **Android**, and **iOS**.

---

## 🏗️ Architecture & Organization

- **`app/`**: File-based routes using Expo Router:
  - `index.tsx`: Document upload & parsing progress
  - `dashboard.tsx`: Main learning dashboard and quick action cards
  - `modules.tsx`: Course explorer and chapter breakdown
  - `learning.tsx`: In-depth module explanation & teaching view
  - `doubt.tsx`: Persistent doubt chat / conversational assistant
  - `quiz.tsx`: Micro-module & chapter assessment engine
  - `progress.tsx`: Learning metrics and progress tracking
  - `feedback.tsx`: Module feedback and rating scoring
  - `about.tsx`: System overview & local AI information
- **`src/`**:
  - **`components/`**: Navigation bar, headers, sidebar, shell layout (`LocalMindShell`)
  - **`context/`**: `CourseContext.tsx` providing global state for selected books, active modules, scores, and courses
  - **`features/`**:
    - `learning-kit/`: Screens and components for lesson explanations, quizzes, doubt conversations, and summary cards
    - `module-kit/`: Dashboard, module list, outline cards, and components
  - **`services/`**:
    - `api.ts`: API client connecting to the Django backend (auto-resolves `localhost:8000` for web and local network IP for physical mobile devices)
  - **`theme/`**: Design tokens, colors, and layout constants

---

## 🚀 Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start the Expo bundler
```bash
npx expo start
```

### 3. Launch options
- **Web Browser**: Press **`w`** in the terminal (runs on `http://localhost:8081` or `8082`).
- **Physical Phone**: Open the **Expo Go** app on your phone and scan the QR code displayed in the terminal (ensure phone and PC are on the same Wi-Fi network).
- **Android Emulator**: Press **`a`** (requires Android Studio / emulator).

---

## ⚙️ Backend Connection

The frontend connects to the backend REST API via [`src/services/api.ts`](./src/services/api.ts):
- For web browsers: defaults to `http://localhost:8000/api`
- For mobile devices (Expo Go): dynamically resolves the host machine's IP address (`http://<your-local-ip>:8000/api`).
