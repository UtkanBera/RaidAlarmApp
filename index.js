import { registerRootComponent } from 'expo';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { Audio } from 'expo-av';
import App from './App';

let soundObject = null;

const headlessNotificationListener = async ({ notification }) => {
  if (!notification) return;

  const appName = notification.app || '';
  const title = (notification.title || '').toLowerCase();
  const text = (notification.text || '').toLowerCase();
  const lowApp = appName.toLowerCase();

  console.log('--- BİLDİRİM GELDİ ---', { appName, title, text });

  // HYPER-AGGRESSIVE MATCHING
  // 1. If it's the Rust+ app (package name or title)
  // 2. Or if content contains keywords
  const isRustApp = 
    lowApp.includes('facepunch') || 
    lowApp.includes('rust') || 
    lowApp.includes('companion');

  const isAlarmContent = 
    title.includes('smart alarm') || 
    text.includes('smart alarm') ||
    title.includes('raid') ||
    text.includes('raid') ||
    title.includes('baskın') ||
    title.includes('alarm');

  if (isRustApp || isAlarmContent) {
    console.log('🚨 RAID ALARMI TETİKLENDİ!');

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
