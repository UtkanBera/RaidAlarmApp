import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, AppState } from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { Audio } from 'expo-av';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
    
    // Check permission again when app comes to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  const checkPermission = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    setHasPermission(status !== 'denied');
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
      
      // Stop after 3 seconds
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
        <Text style={styles.subtitle}>Rust+ Sensör İzleyici</Text>
      </View>

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
            ✅ Harika! Uygulama şu an arka planda Rust+ bildirimlerini dinliyor. Oyundan "Smart Alarm" bildirimi geldiği an siren çalacaktır. Bu uygulamayı kapatabilirsiniz.
          </Text>
        )}
      </View>
      
      <View style={styles.card}>
        <Text style={styles.infoText}>Sesi ve sistemi test etmek için aşağıdaki butonu kullanabilirsiniz.</Text>
        <TouchableOpacity style={styles.buttonBlue} onPress={testSiren}>
          <Text style={styles.buttonText}>TEST SİREN ÇAL (3sn)</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f87171',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusText: {
    fontSize: 18,
    color: '#f1f5f9',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonRed: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonBlue: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
