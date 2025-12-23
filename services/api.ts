import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppUsage {
  id?: string;
  user_id?: string;
  app_name: string;
  package_name: string;
  usage_duration: number;
  last_used: string;
  date: string;
}

export interface Prediction {
  id?: string;
  user_id?: string;
  predicted_usage: number;
  risk_level: string;
  prediction_date: string;
}

export interface Reward {
  id?: string;
  user_id?: string;
  points: number;
  reward_type: string;
  description: string;
  earned_at?: string;
}

export interface UserGoal {
  id?: string;
  user_id?: string;
  daily_limit: number;
  updated_at?: string;
}

const storageKey = {
  appUsage: 'mock_app_usage',
  predictions: 'mock_predictions',
  rewards: 'mock_rewards',
  userGoals: 'mock_user_goals',
};

// Helper functions
const getData = async <T>(key: string): Promise<T[]> => {
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

const saveData = async <T>(key: string, data: T[]) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => Math.random().toString(36).substring(2, 12);

export const api = {
  async getAppUsage(userId: string, date?: string) {
    let data = (await getData<AppUsage>(storageKey.appUsage)).filter(u => u.user_id === userId);
    if (date) data = data.filter(u => u.date === date);
    return data.sort((a, b) => b.usage_duration - a.usage_duration);
  },

  async addAppUsage(usage: AppUsage) {
    const data = await getData<AppUsage>(storageKey.appUsage);
    usage.id = generateId();
    data.push(usage);
    await saveData(storageKey.appUsage, data);
    return usage;
  },

  async getTodayTotalUsage(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const data = await api.getAppUsage(userId, today);
    return data.reduce((sum, item) => sum + item.usage_duration, 0);
  },

  async getPredictions(userId: string) {
    let data = (await getData<Prediction>(storageKey.predictions)).filter(p => p.user_id === userId);
    return data
      .sort((a, b) => new Date(b.prediction_date).getTime() - new Date(a.prediction_date).getTime())
      .slice(0, 7);
  },

  async addPrediction(prediction: Prediction) {
    const data = await getData<Prediction>(storageKey.predictions);
    prediction.id = generateId();
    data.push(prediction);
    await saveData(storageKey.predictions, data);
    return prediction;
  },

  async getRewards(userId: string) {
    let data = (await getData<Reward>(storageKey.rewards)).filter(r => r.user_id === userId);
    return data
      .sort((a, b) => new Date(b.earned_at!).getTime() - new Date(a.earned_at!).getTime());
  },

  async addReward(reward: Reward) {
    const data = await getData<Reward>(storageKey.rewards);
    reward.id = generateId();
    reward.earned_at = new Date().toISOString();
    data.push(reward);
    await saveData(storageKey.rewards, data);
    return reward;
  },

  async getTotalPoints(userId: string) {
    const rewards = await api.getRewards(userId);
    return rewards.reduce((sum, r) => sum + r.points, 0);
  },

  async getUserGoal(userId: string) {
    const data = await getData<UserGoal>(storageKey.userGoals);
    return data.find(g => g.user_id === userId) || null;
  },

  async setUserGoal(userId: string, dailyLimit: number) {
    const data = await getData<UserGoal>(storageKey.userGoals);
    const index = data.findIndex(g => g.user_id === userId);
    const goal: UserGoal = { user_id: userId, daily_limit: dailyLimit, updated_at: new Date().toISOString() };
    if (index >= 0) data[index] = goal;
    else data.push(goal);
    await saveData(storageKey.userGoals, data);
    return goal;
  },
};
