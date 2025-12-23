import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDuration } from '@/utils/riskCalculator';

interface AppCardProps {
  appName: string;
  packageName: string;
  usageDuration: number;
  lastUsed: string;
}

export const AppCard = ({ appName, packageName, usageDuration, lastUsed }: AppCardProps) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{getInitial(appName)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.appName}>{appName}</Text>
        <Text style={styles.packageName}>{packageName}</Text>
      </View>
      <View style={styles.usageContainer}>
        <Text style={styles.duration}>{formatDuration(usageDuration)}</Text>
        <Text style={styles.lastUsed}>
          {new Date(lastUsed).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  packageName: {
    fontSize: 12,
    color: '#666',
  },
  usageContainer: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  lastUsed: {
    fontSize: 12,
    color: '#999',
  },
});
