import { registerRootComponent } from 'expo';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';

let soundObject = null;

const headlessNotificationListener = async ({ notification }) => {
  if (!notification) return;

  const appName = notification.app || '';
  const title = notification.title || '';
  const text = notification.text || '';
  const time = new Date().toLocaleTimeString();

  // Save the notification log for debugging in the UI
  try {
    const logEntry = { appName, title, text, time };
    const existingLogs = await AsyncStorage.getItem('notification_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.unshift(logEntry);
    await AsyncStorage.setItem('notification_logs', JSON.stringify(logs.slice(0, 10)));
  } catch (e) {
    console.error('Log Save Error:', e);
  }

  console.log('--- BİLDİRİM GELDİ ---', { appName, title, text });

  // BROADER MATCHING LOGIC
  const lowTitle = title.toLowerCase();
  const lowText = text.toLowerCase();
  const lowApp = appName.toLowerCase();

  const isRustMatch = 
    lowApp.includes('facepunch') || 
    lowApp.includes('rust') || 
    lowApp.includes('smart alarm');

  const isContentMatch = 
    lowTitle.includes('smart alarm') || 
    lowText.includes('smart alarm') ||
    lowTitle.includes('raid') ||
    lowText.includes('raid') ||
    lowTitle.includes('alarm') ||
    lowTitle.includes('baskın');

  if (isRustMatch || isContentMatch) {
    console.log('🚨 HEDEF BİLDİRİM YAKALANDI!');

    try {
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
      
      // Stop after 60 seconds
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

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener
);

registerRootComponent(App);
