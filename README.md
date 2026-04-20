# Digital Wellbeing App — Backend

REST API backend for the **Digital Wellbeing Optimizer** mobile application. Built with Node.js, Express.js, and MongoDB.

🔗 **Live API:** [digitalwelbeingbackend.vercel.app](https://digitalwelbeingbackend.vercel.app)  
📱 **Frontend Repo:** [digitalwelbeingfrontend](https://github.com/ft-umer/digitalwelbeingfrontend)

---

## Features

- **JWT Authentication** — Secure user registration, login, and token-based session management
- **Role-Based Access Control** — Middleware protecting routes based on user roles
- **App Usage Tracking** — APIs to log, retrieve, and analyze individual app usage sessions
- **Daily Goals** — Endpoints for creating and tracking user-defined daily screen time limits
- **Rewards System** — Logic for calculating and awarding points based on goal completion
- **Usage Predictions** — API endpoints serving AI-generated usage forecasts

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (JSON Web Tokens)
- **Deployment:** Vercel

---

## Project Structure

```
├── config/          # Database connection and environment config
├── controllers/     # Route handler logic
├── middleware/      # Auth and role-based access middleware
├── models/          # Mongoose schemas (User, AppUsage, Goals, Rewards)
├── routes/          # API route definitions
└── server.js        # App entry point
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/ft-umer/digitalwelbeingbackend.git
cd digitalwelbeingbackend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET

# Start development server
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/usage` | Get user's app usage data |
| POST | `/api/usage` | Log new app usage session |
| GET | `/api/goals` | Get user's daily goals |
| POST | `/api/goals` | Create a daily goal |
| GET | `/api/rewards` | Get user's earned rewards |

---

## Related

- 📱 Frontend (React Native): [digitalwelbeingfrontend](https://github.com/ft-umer/digitalwelbeingfrontend)
