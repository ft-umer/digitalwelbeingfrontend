import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock utility functions
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${remMinutes}m`;
};

const calculateRiskLevel = (usage: number, limit: number) => {
  const percent = (usage / limit) * 100;
  if (percent < 50) return { level: 'low', message: 'Safe', score: percent };
  if (percent < 80)
    return { level: 'medium', message: 'Caution', score: percent };
  return { level: 'high', message: 'High Usage', score: percent };
};

// Mock ProgressBar
const ProgressBar = ({
  current,
  total,
  riskLevel,
}: {
  current: number;
  total: number;
  riskLevel: string;
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  let bgColor = '#4CAF50';
  if (riskLevel === 'medium') bgColor = '#FF9800';
  else if (riskLevel === 'high') bgColor = '#FF5722';

  return (
    <View
      style={{
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 16,
      }}
    >
      <View
        style={{
          width: `${percentage}%`,
          backgroundColor: bgColor,
          height: '100%',
        }}
      />
    </View>
  );
};

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [totalUsage, setTotalUsage] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(7200000); // 2 hours default
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!user) return;

    loadUserData();

    const interval = setInterval(async () => {
      const key = `usage_${user.email}`;
      const stored = await AsyncStorage.getItem(key);

      if (stored) {
        const data = JSON.parse(stored);

        // simulate increase
        const newUsage = data.totalUsage + Math.floor(Math.random() * 5000);
        const newPoints = data.totalPoints + 1;

        const updated = {
          ...data,
          totalUsage: newUsage,
          totalPoints: newPoints,
        };

        await AsyncStorage.setItem(key, JSON.stringify(updated));

        setTotalUsage(newUsage);
        setTotalPoints(newPoints);
      }
    }, 3000); // every 3 sec

    return () => clearInterval(interval);
  }, [user]);
  
  const loadUserData = async () => {
    try {
      setLoading(true);

      if (!user) return;

      const key = `usage_${user.email}`;
      const stored = await AsyncStorage.getItem(key);

      if (stored) {
        const data = JSON.parse(stored);
        setTotalUsage(data.totalUsage);
        setTotalPoints(data.totalPoints);
        setDailyLimit(data.dailyLimit);
      } else {
        const defaultData = {
          totalUsage: 0,
          totalPoints: 0,
          dailyLimit: 7200000,
        };

        await AsyncStorage.setItem(key, JSON.stringify(defaultData));

        setTotalUsage(0);
        setTotalPoints(0);
        setDailyLimit(7200000);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const risk = calculateRiskLevel(totalUsage, dailyLimit);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Usage</Text>
        <Text style={styles.usageTime}>{formatDuration(totalUsage)}</Text>
        <Text style={styles.usageLimit}>of {formatDuration(dailyLimit)}</Text>

        <ProgressBar
          current={totalUsage}
          total={dailyLimit}
          riskLevel={risk.level}
        />

        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor: `${risk.level === 'low' ? '#4CAF50' : risk.level === 'medium' ? '#FF9800' : '#FF5722'}20`,
            },
          ]}
        >
          <Text
            style={[
              styles.riskText,
              {
                color:
                  risk.level === 'low'
                    ? '#4CAF50'
                    : risk.level === 'medium'
                      ? '#FF9800'
                      : '#FF5722',
              },
            ]}
          >
            {risk.message}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(risk.score)}%</Text>
          <Text style={styles.statLabel}>Daily Progress</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/usage')}
        >
          <Text style={styles.actionButtonText}>View Detailed Usage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/prediction')}
        >
          <Text style={styles.actionButtonText}>Check Predictions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  greeting: { fontSize: 24, fontWeight: '700', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  logoutButton: { padding: 8 },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, color: '#666', marginBottom: 8 },
  usageTime: { fontSize: 48, fontWeight: '700', color: '#333' },
  usageLimit: { fontSize: 16, color: '#999', marginBottom: 16 },
  riskBadge: { padding: 12, borderRadius: 8, marginTop: 16 },
  riskText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 32, fontWeight: '700', color: '#2196F3' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  quickActions: { padding: 16, marginTop: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'center',
  },
});
