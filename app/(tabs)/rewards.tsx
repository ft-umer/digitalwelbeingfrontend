import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy } from 'lucide-react-native';

// Mock Badge component
const Badge = ({ points, type, description, earnedAt }: any) => (
  <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 }}>
    <Text style={{ fontWeight: '700' }}>{description}</Text>
    <Text style={{ color: '#666' }}>Points: {points}</Text>
    <Text style={{ color: '#999', fontSize: 12 }}>{new Date(earnedAt).toLocaleDateString()}</Text>
  </View>
);

export default function RewardsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      const mockRewards = [
        { id: '1', points: 50, reward_type: 'daily_goal', description: 'Stayed within daily limit!', earned_at: new Date().toISOString() },
        { id: '2', points: 200, reward_type: 'weekly_streak', description: '7-day streak', earned_at: new Date(Date.now() - 2 * 86400000).toISOString() },
        { id: '3', points: 100, reward_type: 'usage_reduction', description: 'Reduced usage by 20%', earned_at: new Date(Date.now() - 5 * 86400000).toISOString() },
      ];
      setRewards(mockRewards);
      setTotalPoints(mockRewards.reduce((sum, r) => sum + r.points, 0));
      setLoading(false);
    }, 500);
  };

  const claimDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRewards = rewards.filter(r => r.earned_at.split('T')[0] === today && r.reward_type === 'daily_goal');
    if (todayRewards.length > 0) {
      alert('Already claimed today!');
      return;
    }

    const newReward = {
      id: (rewards.length + 1).toString(),
      points: 50,
      reward_type: 'daily_goal',
      description: 'Stayed within daily limit!',
      earned_at: new Date().toISOString(),
    };
    const updatedRewards = [newReward, ...rewards];
    setRewards(updatedRewards);
    setTotalPoints(updatedRewards.reduce((sum, r) => sum + r.points, 0));
    alert('You earned 50 points for today!');
  };

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
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>Your achievements</Text>
      </View>

      <View style={styles.pointsCard}>
        <View style={styles.pointsIconContainer}>
          <Trophy size={40} color="#FFD700" />
        </View>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
          <Text style={styles.pointsLabel}>Total Points</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.claimButton} onPress={claimDailyReward}>
          <Text style={styles.claimButtonText}>Claim Daily Reward</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rewardsContainer}>
        <Text style={styles.sectionTitle}>Earned Rewards</Text>
        {rewards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No rewards yet</Text>
            <Text style={styles.emptySubtext}>Complete goals to earn rewards</Text>
          </View>
        ) : (
          rewards.map(r => (
            <Badge
              key={r.id}
              points={r.points}
              type={r.reward_type}
              description={r.description}
              earnedAt={r.earned_at}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  pointsCard: { backgroundColor: '#fff', margin: 16, padding: 24, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  pointsIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  pointsInfo: { flex: 1 },
  pointsValue: { fontSize: 48, fontWeight: '700', color: '#333' },
  pointsLabel: { fontSize: 16, color: '#666' },
  actionContainer: { paddingHorizontal: 16 },
  claimButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center' },
  claimButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  rewardsContainer: { padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16 },
  emptyState: { padding: 48, alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#999', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#ccc' },
  infoContainer: { backgroundColor: '#fff', margin: 16, padding: 24, borderRadius: 16 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16 },
});
