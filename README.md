# VIBE CHECK.

> **Atmosphere Decoded.** > Forget generic 5-star ratings. Discover your next destination based on how it actually feels right now.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps_API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)

---

## The Concept

**Vibe Check** is a location discovery engine that uses AI and real-time social frequency data to quantify the "vibe" of restaurants, bars, and cafes. 

While traditional apps focus on static star ratings, Vibe Check answers the questions that actually matter: 
* "Is it loud enough to hide an awkward silence?"
* "Is the lighting dim enough for a date?"
* "Is the WiFi stable enough for deep work?"

## Key Features

* AI Vibe Analysis: Uses **Google Gemini** to read thousands of reviews in seconds and generate a one-sentence "Vibe Summary" (e.g., "Neon-lit coding haven with strong espresso").
* Real-Time Spatial Data: Integrated with **Google Maps Platform (2025 SDK)** for accurate location, hours, and photos.
* 3D Interactive Elements: Features "Boba Bot," a custom 3D interactive mascot built with **React Three Fiber**.
* Dynamic Filters: Filter by Radius, Budget ($ - $$$$), and specific Moods (Chill, Electric, Buzzing).
* Dual Visualization: Toggle seamlessly between an immersive **Grid View** and an interactive **Map View**.
* Collections: Save your favorite spots to your local "Vibe Collection."
* High-Fidelity UI: A fully responsive, dark-mode-first interface using glassmorphism and smooth framer-motion animations.

---

##  Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/Nisinii/VibeCheck.git](https://github.com/Nisinii/VibeCheck.git)
cd VibeCheck
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a .env file in the root directory. You will need API keys for Google Maps and Google Gemini.
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### 4. Run the App
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure
```bash
src/
├── assets/          # Static images (Logo, Profile, PDF)
├── components/      # Reusable UI components (NavBar, PlaceCard, Footer)
│   ├── BobaBotComponent.jsx  # The 3D logic
│   └── MapVisualizer.jsx     # Google Maps integration
├── hooks/           # Custom hooks
│   ├── useGoogleMaps.js      # Script loading logic
│   ├── usePlacesFetcher.js   # API search strategies
│   └── useFavorites.js       # LocalStorage logic
├── pages/           # Route views (Home, PlaceDetails, Developer, About)
├── utils/           # Constants and AI helper functions
└── App.jsx          # Main Router configuration
```

## How It Works

### The Vibe Engine
The app calculates a "Vibe Score" and "Label" based on a heuristic combination of:
* **User Rating Count:** Determines if a place is "Electric" (High traffic) vs "Chill" (Low traffic).
* **Operational Status:** Dormant vs. Active.
* **Place Types:** Categorizes venues into "Cozy," "Upscale," or "Casual."

### Gemini Integration
When you click on a place, we fetch the 5 most recent detailed reviews and send them to the Gemini Flash Model with a specific prompt engineering structure to extract sentiment without personal bias.

---

## Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Routing:** React Router DOM

### 3D & Graphics
* **Three.js** (Core 3D engine)
* **@react-three/fiber** (React renderer for Three.js)
* **@react-three/drei** (Helpers for R3F)
* **Custom Shaders** (GLSL for liquid effects)

### APIs & Data
* **Google Maps JavaScript API** (Places Library, Advanced Markers)
* **Google Generative AI SDK** (Gemini Model)
* **LocalStorage** (Persistence for favorites)

---

## Author

**Nisini Niketha** *Software Engineer & Web Developer*
* [GitHub](https://github.com/Nisinii)
* [LinkedIn](https://www.linkedin.com/in/nisini-niketha/)
* [Contact](mailto:wnisini.niketha@gmail.com)
