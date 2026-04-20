import { NativeModules } from 'react-native';

const { UsageModule } = NativeModules;

export const getUsageStats = async () => {
  return await UsageModule.getTodayUsage();
};