import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRiskColor } from '@/utils/riskCalculator';
import type { RiskLevel } from '@/utils/riskCalculator';

interface ProgressBarProps {
  current: number;
  total: number;
  riskLevel: RiskLevel;
  label?: string;
}

export const ProgressBar = ({ current, total, riskLevel, label }: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);
  const color = getRiskColor(riskLevel);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  barContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});
