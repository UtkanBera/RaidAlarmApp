import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, AppState, ScrollView, Linking } from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { Audio } from 'expo-av';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
    
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
      setTimeout(() => {
        sound.stopAsync();
      }, 3000);
      Alert.alert('Test Başarılı', 'Siren sesi duyuluyor mu?');
    } catch (error) {
       Alert.alert('Hata', 'Ses dosyası çalınamadı: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.title}>RAİD SİREN V3</Text>
        <Text style={styles.subtitle}>Kesin Çözüm Sistemi</Text>
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
            <Text style={styles.buttonText}>BİLDİRİM İZNİ VER</Text>
          </TouchableOpacity>
        )}

        {hasPermission && (
          <Text style={styles.infoText}>
            ✅ Uygulama şu an arka planda Rust+ bildirimlerini bekliyor.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitleSmall}>⚠️ KRİTİK AYAR (XIAOMI/HUAWEI/SAMSUNG)</Text>
        <Text style={styles.guideText}>
          Arka planda siren çalabilmesi için lütfen bu ayarları yapın:{"\n\n"}
          1. Uygulama ikonuna basılı tutun {'->'} <Text style={{fontWeight:'bold'}}>"Uygulama Bilgisi"</Text> kısmına girin.{"\n"}
          2. <Text style={{fontWeight:'bold'}}>"Otomatik Başlatma"</Text> (Auto-start) iznini açın.{"\n"}
          3. <Text style={{fontWeight:'bold'}}>"Pil Tasarrufu"</Text> kısmına girip <Text style={{fontWeight:'bold'}}>"Kısıtlama Yok"</Text> (No Restrictions) seçin.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitleSmall}>🔍 NELER ALGILANIR?</Text>
        <Text style={styles.guideText}>
          • Rust+ uygulamasından gelen <Text style={{fontWeight:'bold'}}>HERHANGİ</Text> bir bildirim.{"\n"}
          • Başlığında "Smart Alarm", "Raid", "Alarm" veya "Baskın" geçen her şey.
        </Text>
      </View>
      
      <View style={styles.card}>
        <TouchableOpacity style={styles.buttonBlue} onPress={testSiren}>
          <Text style={styles.buttonText}>SES TESTİ YAP (SİREN ÇAL)</Text>
        </TouchableOpacity>
      </View>
      
    </ScrollView>
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
    marginBottom: 10,
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
  guideText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 22,
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
});
