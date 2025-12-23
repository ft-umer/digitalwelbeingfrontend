import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { api } from '@/services/api';
import { RefreshCw } from 'lucide-react-native';

// Prediction utils
const predictFutureUsage = (history: number[]) => {
  if (history.length === 0) return 0;
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const variation = Math.random() * 0.2 - 0.1; // ±10%
  return Math.round(avg * (1 + variation));
};

const calculateRiskLevel = (usage: number, limit: number) => {
  if (usage <= limit) return { level: 'low' };
  if (usage <= limit * 1.2) return { level: 'medium' };
  return { level: 'high' };
};

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return '#4CAF50';
    case 'medium': return '#FFC107';
    case 'high': return '#F44336';
    default: return '#999';
  }
};

export default function PredictionScreen() {
  const userId = 'mock-user';
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [dailyLimit, setDailyLimit] = useState(7200000);
  const [generating, setGenerating] = useState(false);

  const seedMockData = async () => {
  const existing = await api.getAppUsage(userId);
  if (existing.length === 0) {
    const today = new Date();
    // Create 5 days of historical usage
    for (let i = 5; i > 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dateStr = day.toISOString().split('T')[0];
      await api.addAppUsage({
        user_id: userId,
        app_name: 'YouTube',
        package_name: 'com.youtube',
        usage_duration: 3600000 + Math.floor(Math.random() * 1800000), // 1-1.5h
        last_used: new Date().toISOString(),
        date: dateStr,
      });
      await api.addAppUsage({
        user_id: userId,
        app_name: 'Instagram',
        package_name: 'com.instagram',
        usage_duration: 1800000 + Math.floor(Math.random() * 1800000), // 0.5-1h
        last_used: new Date().toISOString(),
        date: dateStr,
      });
    }
  }

  const goal = await api.getUserGoal(userId);
  if (!goal) {
    await api.setUserGoal(userId, 7200000); // 2 hours daily limit
  }
};

const generatePrediction = async () => {
  try {
    setGenerating(true);
    const usageData = await api.getAppUsage(userId);
    if (usageData.length === 0) {
      Alert.alert('No usage data', 'Add some app usage first!');
      return;
    }

    // Aggregate daily usage
    const dailyUsageMap: Record<string, number> = {};
    usageData.forEach(app => {
      dailyUsageMap[app.date] = (dailyUsageMap[app.date] || 0) + app.usage_duration;
    });

    const historical = Object.values(dailyUsageMap);
    const predictedUsage = predictFutureUsage(historical);
    const risk = calculateRiskLevel(predictedUsage, dailyLimit);

    const newPred = await api.addPrediction({
      user_id: userId,
      predicted_usage: predictedUsage,
      risk_level: risk.level,
      prediction_date: new Date().toISOString().split('T')[0],
    });

    // Immediately update state so UI shows new prediction
    setPredictions(prev => [newPred, ...prev]);

    Alert.alert('Success', 'New prediction generated!');
  } catch (error: any) {
    Alert.alert('Error', error.message);
  } finally {
    setGenerating(false);
  }
};

// Load predictions and user goal
  const loadData = async () => {
    try {
      setLoading(true);
      const preds = await api.getPredictions(userId);
      const goal = await api.getUserGoal(userId);
      setPredictions(preds);
      setDailyLimit(goal?.daily_limit || 7200000);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };


  // Initialize
  useEffect(() => {
    const init = async () => {
      await seedMockData();
      await loadData();
    };
    init();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const latest = predictions[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usage Prediction</Text>
        <Text style={styles.subtitle}>AI-powered forecasting</Text>
      </View>

      {latest ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tomorrow's Predicted Usage</Text>
          <Text style={styles.predictionValue}>{formatDuration(latest.predicted_usage)}</Text>

          <View style={[styles.riskBadge, { backgroundColor: `${getRiskColor(latest.risk_level)}20` }]}>
            <Text style={[styles.riskText, { color: getRiskColor(latest.risk_level) }]}>
              Risk Level: {latest.risk_level.toUpperCase()}
            </Text>
          </View>

          <View style={styles.comparisonContainer}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Daily Limit</Text>
              <Text style={styles.comparisonValue}>{formatDuration(dailyLimit)}</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonValue, { color: latest.predicted_usage > dailyLimit ? '#F44336' : '#4CAF50' }]}>
                {latest.predicted_usage > dailyLimit ? '+' : ''}
                {formatDuration(Math.abs(latest.predicted_usage - dailyLimit))}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No predictions yet</Text>
          <Text style={styles.emptySubtext}>Generate your first prediction</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, generating && styles.buttonDisabled]}
        onPress={generatePrediction}
        disabled={generating}
      >
        {generating ? <ActivityIndicator color="#fff" /> : (
          <>
            <RefreshCw size={20} color="#fff" />
            <Text style={styles.buttonText}>Generate New Prediction</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  card: { backgroundColor: '#fff', margin: 16, padding: 24, borderRadius: 16 },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  predictionValue: { fontSize: 48, fontWeight: '700', color: '#333', marginBottom: 16 },
  riskBadge: { padding: 12, borderRadius: 8, marginBottom: 16 },
  riskText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  comparisonContainer: { flexDirection: 'row', gap: 16 },
  comparisonItem: { flex: 1 },
  comparisonLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  comparisonValue: { fontSize: 18, fontWeight: '600', color: '#333' },
  emptyState: { padding: 48, alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#999', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#ccc' },
  button: {
    backgroundColor: '#2196F3', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, padding: 16, margin: 16, borderRadius: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
