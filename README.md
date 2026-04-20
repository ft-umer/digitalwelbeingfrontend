# Digital Wellbeing App — Frontend

A React Native mobile application that helps users monitor and manage their screen time habits. Features usage tracking, AI-based predictions, and a gamified rewards system.

> ⚠️ Note: A `supabase/` folder exists in this repo from the initial Expo boilerplate — it is not used. The actual backend is a custom Node.js/Express/MongoDB API. See the [backend repo](https://github.com/ft-umer/digitalwelbeingbackend).

🔗 **Backend Repo:** [digitalwelbeingbackend](https://github.com/ft-umer/digitalwelbeingbackend)

---

## Features

- **User Authentication** — Register, login, and persistent sessions via JWT
- **Dashboard** — Daily usage overview, goal progress, and points summary
- **App Usage Tracking** — Monitor individual app usage durations with detailed stats
- **AI Usage Predictions** — Smart forecasts based on the last 7 days of usage history
- **Rewards System** — Earn points by meeting daily goals and maintaining weekly streaks
- **Risk Assessment** — Real-time risk level (Low / Medium / High / Critical) based on usage patterns

---

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Navigation:** Expo Router
- **State Management:** React Context API
- **Backend:** Custom Node.js/Express REST API with MongoDB

---

## Getting Started

### Prerequisites
- Node.js v18+
- Expo CLI
- Android Studio or Expo Go app on your phone

### Installation

```bash
# Clone the repo
git clone https://github.com/ft-umer/digitalwelbeingfrontend.git
cd digitalwelbeingfrontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your backend API URL

# Start the dev server
npm run dev
```

---

## Project Structure

```
├── app/              # Expo Router screens (tabs, auth)
├── components/       # Reusable UI components
├── contexts/         # React Context (Auth, etc.)
├── hooks/            # Custom React hooks
├── services/         # API call functions
└── utils/            # Helper functions (risk calculator, etc.)
```

---

## Related

- ⚙️ Backend (Node.js/Express/MongoDB): [digitalwelbeingbackend](https://github.com/ft-umer/digitalwelbeingbackend)
