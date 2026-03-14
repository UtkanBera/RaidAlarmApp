import { registerRootComponent } from 'expo';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { Audio } from 'expo-av';
import App from './App';

let soundObject = null;

// The background listener that wakes up when a notification arrives
const headlessNotificationListener = async ({ notification }) => {
  if (!notification) return;

  const appName = notification.app;
  const title = notification.title || '';
  const text = notification.text || '';

  console.log('--- BİLDİRİM GELDİ ---');
  console.log('Uygulama:', appName);
  console.log('Başlık:', title);
  console.log('İçerik:', text);

  // Check if it's from Rust+ or contains 'Smart Alarm'
  // package name for rust+ is com.facepunch.rust.companion
  if (appName === 'com.facepunch.rust.companion' || text.toLowerCase().includes('smart alarm') || title.toLowerCase().includes('smart alarm')) {
    console.log('🚨 RUST+ BİLDİRİMİ YAKALANDI! SİREN ÇALINIYOR...');

    try {
      // Configure audio to play even in silent mode with max volume
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      if (!soundObject) {
         soundObject = new Audio.Sound();
         await soundObject.loadAsync(require('./assets/siren.mp3'));
         await soundObject.setIsLoopingAsync(true);
      }
      
      await soundObject.playAsync();
      
      // Stop the sound automatically after 60 seconds if user doesn't open the app
      setTimeout(async () => {
         if (soundObject) {
            await soundObject.stopAsync();
         }
      }, 60000);

    } catch (e) {
      console.error("Audio Play Error:", e);
    }
  }
};

// Register the Headless JS Task
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener
);

// Register the main UI
registerRootComponent(App);
