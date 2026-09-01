# LocalMind Workspace

Welcome to **LocalMind**, a local-first AI tutoring application. LocalMind parses your documents (like PDFs, Word files, etc.) and acts as a personal AI tutor that strictly explains only what is in the source material—guaranteeing zero hallucinations and preventing extra knowledge injection.

This project is organized as a clean and structured monorepo containing both the frontend mobile app and the backend API server.

---

## Directory Structure

```text
.
├── backend/                  # Python & Django REST Framework application
│   ├── core/                 # Django App: core models, logic, and base views
│   ├── documents/            # Django App: document uploading and parsing
│   ├── learning/             # Django App: progress tracking & assessment engine
│   ├── tutor/                # Django App: Ollama/LLM integration and prompt handling
│   ├── config/               # Django project-wide configuration (settings, routes)
│   ├── media/                # Uploaded documents (not committed)
│   ├── db.sqlite3            # SQLite database file (ignored in git)
│   └── README.md             # Backend setup & testing instructions
│
└── frontend/                 # Expo React Native application
    ├── app/                  # Screens & file-based routing
    ├── src/                  # Components, contexts, hooks, services, features
    ├── assets/               # Local app assets (icons, images)
    ├── package.json          # Node dependencies & npm scripts
    └── README.md             # Frontend setup & execution instructions
```

---

## Quick Start Guide

### 1. Prerequisites
- **Python 3.12+** (for the backend)
- **Node.js 18+** (for the frontend)
- **[Ollama](https://ollama.ai/)** running locally with the `qwen3:1.7b` model pulled:
  ```bash
  ollama pull qwen3:1.7b
  ```

---

### 2. Backend Setup
1. Navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations and start the Django development server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   *The backend will run at: `http://127.0.0.1:8000/`*

---

### 3. Frontend Setup
1. Navigate into the `frontend/` directory (open a new terminal tab/window):
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
   *You can scan the QR code to run the application on your physical device using Expo Go, or start an emulator.*
