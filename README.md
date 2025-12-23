# App Usage Monitor

A React Native mobile application for monitoring and managing app usage patterns with AI-powered predictions and a gamified rewards system.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Dashboard**: Overview of daily usage, progress towards goals, and total points earned
- **App Usage Tracking**: Monitor individual app usage duration with detailed statistics
- **AI Predictions**: Smart predictions for future usage patterns based on historical data
- **Rewards System**: Earn points by meeting daily goals and maintaining healthy usage habits
- **Risk Assessment**: Real-time risk level calculation based on usage patterns

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL database, Authentication, Row Level Security)
- **Navigation**: Expo Router
- **UI Components**: Custom components with Lucide icons
- **State Management**: React Context API

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard
│   │   ├── usage.tsx      # App usage tracking
│   │   ├── prediction.tsx # Usage predictions
│   │   └── rewards.tsx    # Rewards and points
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   └── _layout.tsx        # Root layout with auth
├── components/            # Reusable components
│   ├── AppCard.tsx        # App usage card
│   ├── ProgressBar.tsx    # Progress visualization
│   └── Badge.tsx          # Reward badge
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── services/              # API services
│   └── api.ts             # Supabase API calls
├── utils/                 # Utility functions
│   └── riskCalculator.ts  # Risk calculation logic
└── lib/                   # Configuration
    └── supabase.ts        # Supabase client

```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API
   - Update the `.env` file with your credentials

5. The database tables will be automatically created on first run

### Running the App

```bash
# Start the development server
npm run dev

# For web
npm run dev -- --web

# For iOS (requires Mac)
npm run dev -- --ios

# For Android
npm run dev -- --android
```

## Database Schema

### Tables

- **app_usage**: Stores individual app usage records
- **usage_predictions**: AI-generated usage predictions
- **rewards**: User earned rewards and points
- **user_goals**: User-defined daily usage limits

All tables include Row Level Security (RLS) policies to ensure users can only access their own data.

## Features Explained

### Risk Calculation

The app uses a sophisticated risk calculation algorithm that:
- Compares current usage against daily goals
- Categorizes risk into 4 levels: Low, Medium, High, Critical
- Provides actionable feedback based on usage patterns

### Prediction Algorithm

The prediction system:
- Analyzes historical usage data (last 7 days)
- Uses weighted average (70% recent, 30% historical)
- Generates daily predictions for proactive management

### Rewards System

Users earn points by:
- **Daily Goal (50 pts)**: Stay within daily usage limit
- **Weekly Streak (200 pts)**: Meet goals for 7 consecutive days
- **Usage Reduction (100 pts)**: Reduce usage by 20% from previous week

## Environment Variables

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Security

- All API calls are authenticated using Supabase Auth
- Row Level Security (RLS) ensures data isolation
- No sensitive data stored on client side
- Passwords are hashed and managed by Supabase

## Contributing

This is a demonstration project. Feel free to fork and modify for your needs.

## License

MIT License - feel free to use this project for learning purposes.
