import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Instagram, Plus, Youtube } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsageStats } from '@/services/usage';

// Replace the appIcons with PNG links
const appIcons: Record<string, any> = {
  'com.google.youtube': Youtube,
  'com.instagram.android': Instagram,
};


// AppCard with professional style
const AppCard = ({ appName, packageName, usageDuration, lastUsed, dailyLimit }: any) => {
  const usageMinutes = Math.round(usageDuration / 60000) || 0;
  const usagePercent = Math.min((usageDuration / dailyLimit) * 100, 100);

  const getBarColor = () => {
    if (usagePercent <= 50) return '#4CAF50';
    if (usagePercent <= 80) return '#FFC107';
    return '#F44336';
  };

  let lastUsedDate = new Date(lastUsed);
  if (isNaN(lastUsedDate.getTime())) lastUsedDate = new Date();

  // Explicit conditional rendering
  let IconComponent;
  if (packageName === 'com.google.youtube') {
    IconComponent = <Youtube size={40} color="#FF0000" />;
  } else if (packageName === 'com.instagram.android') {
    IconComponent = <Instagram size={40} color="#C13584" />;
  } else {
    IconComponent = <Plus size={40} color="#2196F3" />;
  }

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {IconComponent}
          <View>
            <Text style={styles.cardTitle}>{appName}</Text>
            <Text style={styles.cardSub}>{packageName}</Text>
          </View>
        </View>
        <Text style={styles.usageText}>{usageMinutes} min</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barForeground, { width: `${usagePercent}%`, backgroundColor: getBarColor() }]} />
      </View>
      <Text style={styles.lastUsed}>Last Used: {lastUsedDate.toLocaleTimeString()}</Text>
    </View>
  );
};

// Predict tomorrow's usage using simple average
const predictFutureUsage = (history: number[]): number => {
  if (!history || history.length === 0) return 0;
  const total = history.reduce((a, b) => a + b, 0);
  const avg = total / history.length;
  const variation = (Math.random() * 0.2 - 0.1) * avg; // ±10% noise
  return Math.max(Math.round(avg + variation), 0);
};

export default function UsageScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newApp, setNewApp] = useState({ appName: '', packageName: '', usageDuration: '' });
  const dailyLimit = 120 * 60000; // 2 hours in ms

useEffect(() => {
  loadRealUsage();
}, []);

const loadRealUsage = async () => {
  try {
    const data = await getUsageStats();

    const formatted = data.map((item: any, index: number) => ({
      id: index.toString(),
      app_name: item.packageName,
      package_name: item.packageName,
      usage_duration: item.usageTime,
      last_used: new Date(item.lastTimeUsed).toISOString(),
    }));

    setApps(Array.isArray(formatted) ? formatted : []);
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

  const handleAddApp = () => {
    const duration = parseInt(newApp.usageDuration);
    if (!newApp.appName || !newApp.packageName || isNaN(duration)) {
      alert('Please fill in all fields correctly');
      return;
    }
    const app = {
      id: (apps.length + 1).toString(),
      app_name: newApp.appName,
      package_name: newApp.packageName,
      usage_duration: duration * 60000,
      last_used: new Date().toISOString(),
    };
    setApps([app, ...apps]);
    setNewApp({ appName: '', packageName: '', usageDuration: '' });
    setModalVisible(false);
  };

  const totalUsage = apps.reduce((sum, a) => sum + a.usage_duration, 0);
  const predictedUsage = predictFutureUsage(apps.map(a => a.usage_duration));

  const getRiskColor = (usage: number) => usage <= dailyLimit ? '#4CAF50' : usage <= dailyLimit * 1.2 ? '#FFC107' : '#F44336';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>App Usage</Text>
          <Text style={styles.subtitle}>Today's activity & prediction</Text>
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionText}>Total Usage: {Math.round(totalUsage / 60000)} min</Text>
            <Text style={[styles.predictionText, { color: getRiskColor(predictedUsage) }]}>
              Predicted Tomorrow: {Math.round(predictedUsage / 60000)} min
            </Text>
          </View>
        </View>

        {apps.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No usage data yet</Text>
            <Text style={styles.emptySubtext}>Add your first app usage record</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {apps.sort((a, b) => b.usage_duration - a.usage_duration).map(app => (
              <AppCard key={app.id} {...app} dailyLimit={dailyLimit} />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add App Usage</Text>
            <TextInput style={styles.input} placeholder="App Name" value={newApp.appName} onChangeText={text => setNewApp({ ...newApp, appName: text })} />
            <TextInput style={styles.input} placeholder="Package Name" value={newApp.packageName} onChangeText={text => setNewApp({ ...newApp, packageName: text })} />
            <TextInput style={styles.input} placeholder="Usage Duration (minutes)" value={newApp.usageDuration} onChangeText={text => setNewApp({ ...newApp, usageDuration: text })} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButton]} onPress={handleAddApp}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  header: { padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  predictionContainer: { marginTop: 12 },
  predictionText: { fontSize: 16, fontWeight: '600' },
  listContainer: { padding: 16 },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  cardSub: { color: '#666', marginBottom: 4 },
  usageText: { color: '#2196F3', fontWeight: '600' },
  lastUsed: { color: '#999', fontSize: 12, marginTop: 4 },
  barBackground: { height: 6, backgroundColor: '#eee', borderRadius: 6, marginTop: 4 },
  barForeground: { height: 6, borderRadius: 6 },
  emptyState: { padding: 48, alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#999', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#ccc' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 24 },
  input: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f5f5f5' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
  addButton: { backgroundColor: '#2196F3' },
  addButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  appIcon: { width: 40, height: 40, borderRadius: 8 },
});
