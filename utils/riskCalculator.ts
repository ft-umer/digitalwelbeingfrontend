export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  message: string;
}

export const calculateRiskLevel = (
  dailyUsageMs: number,
  goalLimitMs: number
): RiskAssessment => {
  const usagePercentage = (dailyUsageMs / goalLimitMs) * 100;

  if (usagePercentage < 50) {
    return {
      level: 'low',
      score: usagePercentage,
      message: 'Great job! Your usage is well within limits.',
    };
  } else if (usagePercentage < 80) {
    return {
      level: 'medium',
      score: usagePercentage,
      message: 'Moderate usage. Consider taking breaks.',
    };
  } else if (usagePercentage < 100) {
    return {
      level: 'high',
      score: usagePercentage,
      message: 'High usage detected. Time to reduce screen time.',
    };
  } else {
    return {
      level: 'critical',
      score: usagePercentage,
      message: 'Critical! Daily limit exceeded. Take action now.',
    };
  }
};

export const predictFutureUsage = (historicalData: number[]): number => {
  if (historicalData.length === 0) return 0;

  const average = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
  const recentWeight = 0.7;
  const historicalWeight = 0.3;

  const recent = historicalData.slice(-3);
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;

  return Math.round(recentAvg * recentWeight + average * historicalWeight);
};

export const formatDuration = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return '#4CAF50';
    case 'medium':
      return '#FF9800';
    case 'high':
      return '#FF5722';
    case 'critical':
      return '#F44336';
  }
};
