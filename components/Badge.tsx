import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  points: number;
  type: string;
  description: string;
  earnedAt: string;
}

export const Badge = ({ points, type, description, earnedAt }: BadgeProps) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'daily_goal':
        return '#4CAF50';
      case 'weekly_streak':
        return '#FF9800';
      case 'reduction':
        return '#2196F3';
      default:
        return '#9C27B0';
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'daily_goal':
        return '🎯';
      case 'weekly_streak':
        return '🔥';
      case 'reduction':
        return '📉';
      default:
        return '⭐';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getBadgeColor(type) }]}>
        <Text style={styles.icon}>{getBadgeIcon(type)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>
          {new Date(earnedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>+{points}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#999',
  },
});
