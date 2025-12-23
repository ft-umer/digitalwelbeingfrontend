/*
  # Create App Usage Monitoring Schema

  1. New Tables
    - `app_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `app_name` (text)
      - `package_name` (text)
      - `usage_duration` (integer, milliseconds)
      - `last_used` (timestamptz)
      - `date` (date)
      - `created_at` (timestamptz)
    
    - `usage_predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `predicted_usage` (integer, milliseconds)
      - `risk_level` (text)
      - `prediction_date` (date)
      - `created_at` (timestamptz)
    
    - `rewards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `points` (integer)
      - `reward_type` (text)
      - `description` (text)
      - `earned_at` (timestamptz)
    
    - `user_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `daily_limit` (integer, milliseconds)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create app_usage table
CREATE TABLE IF NOT EXISTS app_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_name text NOT NULL,
  package_name text NOT NULL,
  usage_duration integer DEFAULT 0,
  last_used timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own app usage"
  ON app_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own app usage"
  ON app_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own app usage"
  ON app_usage FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own app usage"
  ON app_usage FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create usage_predictions table
CREATE TABLE IF NOT EXISTS usage_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  predicted_usage integer DEFAULT 0,
  risk_level text DEFAULT 'low',
  prediction_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE usage_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
  ON usage_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON usage_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions"
  ON usage_predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions"
  ON usage_predictions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points integer DEFAULT 0,
  reward_type text NOT NULL,
  description text NOT NULL,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
  ON rewards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rewards"
  ON rewards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  daily_limit integer DEFAULT 7200000,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_app_usage_user_id ON app_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_date ON app_usage(date);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON usage_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
