# Quick Setup Guide

## 🚀 Getting Started

### 1. Supabase Setup

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project" and sign up

2. **Create a New Project**
   - Click "New Project"
   - Choose a name for your project
   - Set a strong database password (save this!)
   - Select a region close to you
   - Wait for the project to be created (~2 minutes)

3. **Get Your API Credentials**
   - In your project dashboard, click on the ⚙️ Settings icon (bottom left)
   - Go to "API" section
   - Copy the following values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key (starts with `eyJ...`)

4. **Configure Environment Variables**
   - Create a `.env` file in the project root (copy from `.env.example`)
   - Replace the placeholder values:
     ```env
     EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key-here
     ```

5. **Verify Database Tables**
   - Go to the "Table Editor" in Supabase dashboard
   - You should see these tables:
     - `app_usage`
     - `usage_predictions`
     - `rewards`
     - `user_goals`
   - If not, the migration ran successfully and tables will be created automatically

### 2. Running the App

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev

# Choose your platform:
# - Press 'w' for web
# - Press 'i' for iOS simulator (Mac only)
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

### 3. First Time Use

1. **Register an Account**
   - Open the app
   - Click "Sign Up"
   - Enter your email and password (min 6 characters)
   - Check your email for verification (check spam folder)

2. **Login**
   - Use your email and password to login
   - You'll be redirected to the Dashboard

3. **Add Usage Data**
   - Go to the "Usage" tab
   - Click the + button
   - Add an app with usage duration
   - Example:
     - App Name: Instagram
     - Package Name: com.instagram.android
     - Usage Duration: 30 (minutes)

4. **Generate Predictions**
   - Go to the "Prediction" tab
   - Click "Generate New Prediction"
   - View AI-powered usage predictions

5. **Earn Rewards**
   - Go to the "Rewards" tab
   - Click "Claim Daily Reward"
   - Earn points by staying within your daily limit

## 📱 Features Overview

### Dashboard
- View today's total usage
- See progress towards daily goal
- Check total points earned
- Quick access to other features

### Usage
- Track individual app usage
- Add new usage records manually
- View detailed usage statistics
- Sort by most used apps

### Prediction
- AI-powered usage predictions
- Risk level assessment
- Historical prediction data
- Compare with daily limits

### Rewards
- Earn points for healthy habits
- Track earned badges
- View total points
- Learn about reward criteria

## 🔐 Security Notes

- All data is stored securely in Supabase
- Passwords are hashed and never stored in plain text
- Row Level Security (RLS) ensures users only see their own data
- HTTPS encryption for all API calls

## 🐛 Troubleshooting

### "Network request failed"
- Check your `.env` file has correct Supabase credentials
- Verify your internet connection
- Make sure Supabase project is active

### "Invalid login credentials"
- Check email/password are correct
- Verify email is confirmed (check spam folder)
- Try password reset if needed

### "Can't find variable: process"
- Restart the Expo development server
- Clear cache: `npx expo start -c`

### Build errors
- Delete `node_modules` and run `npm install`
- Clear Expo cache: `npx expo start -c`
- Check Node.js version (requires v18+)

## 📞 Support

For issues or questions:
1. Check the README.md file
2. Review the code comments
3. Check Supabase documentation
4. Review Expo documentation

## 🎯 Next Steps

Once you have the app running:
1. Customize the daily limit (default is 2 hours)
2. Add your frequently used apps
3. Monitor your usage patterns
4. Generate daily predictions
5. Earn rewards by meeting goals

Happy monitoring! 📊
