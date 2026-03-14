import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, AppState, ScrollView } from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    checkPermission();
    loadLogs();
    
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPermission();
        loadLogs();
      }
    });

    return () => subscription.remove();
  }, []);

  const checkPermission = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    setHasPermission(status !== 'denied');
  };

  const loadLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem('notification_logs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (e) {
      console.error('Logs Load Error:', e);
    }
  };

  const clearLogs = async () => {
    await AsyncStorage.removeItem('notification_logs');
    setLogs([]);
  };

  const requestPermission = () => {
    RNAndroidNotificationListener.requestPermission();
  };

  const testSiren = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
         require('./assets/siren.mp3')
      );
      await sound.playAsync();
      setTimeout(() => {
        sound.stopAsync();
      }, 3000);
      Alert.alert('Test Başarılı', 'Siren sesi duyuluyor mu?');
    } catch (error) {
       Alert.alert('Hata', 'Ses dosyası çalınamadı: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RAİD SİREN</Text>
        <Text style={styles.subtitle}>Rust+ Sensör İzleyici V2</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.statusText}>
            Sistem Durumu:{' '}
            <Text style={{ color: hasPermission ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
              {hasPermission ? 'AKTİF (DİNLENİYOR)' : 'İZİN BEKLİYOR'}
            </Text>
          </Text>

          {!hasPermission && (
            <TouchableOpacity style={styles.buttonRed} onPress={requestPermission}>
              <Text style={styles.buttonText}>BİLDİRİM OKUMA İZNİ VER</Text>
            </TouchableOpacity>
          )}

          {hasPermission && (
            <Text style={styles.infoText}>
              ✅ Çalışıyor! Rust+ bildirimlerini dinliyoruz. Oyundan "Smart Alarm" veya "Raid" içeren bir bildirim geldiği an siren çalacaktır.
            </Text>
          )}
        </View>
        
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={styles.cardTitleSmall}>SON BİLDİRİMLER</Text>
            <TouchableOpacity onPress={clearLogs}>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>TEMİZLE</Text>
            </TouchableOpacity>
          </View>
          
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>Henüz bildirim yakalanmadı...</Text>
          ) : (
            logs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.logApp}>{log.appName.substring(0, 20)}</Text>
                  <Text style={styles.logTime}>{log.time}</Text>
                </View>
                <Text style={styles.logTitle}>{log.title}</Text>
                <Text style={styles.logText} numberOfLines={1}>{log.text}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.buttonBlue} onPress={testSiren}>
            <Text style={styles.buttonText}>MANUEL SİREN TESTİ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f87171',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitleSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f87171',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 16,
    color: '#f1f5f9',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonRed: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonBlue: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logApp: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  logTime: {
    fontSize: 10,
    color: '#64748b',
  },
  logTitle: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: 'bold',
    marginTop: 2,
  },
  logText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});
