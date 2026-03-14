const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../node_modules/react-native-android-notification-listener');
const gradlePath = path.join(baseDir, 'android/build.gradle');
const manifestPath = path.join(baseDir, 'android/src/main/AndroidManifest.xml');

// 1. Patch Gradle
if (fs.existsSync(gradlePath)) {
  console.log('Patching build.gradle...');
  let lines = fs.readFileSync(gradlePath, 'utf8').split('\n');
  let newLines = [];
  let inAfterEvaluate = false;

  for (let line of lines) {
    if (line.includes("apply plugin: 'maven'")) {
      newLines.push("// " + line);
      continue;
    }
    if (line.includes("def DEFAULT_COMPILE_SDK_VERSION = 30")) {
      newLines.push("def DEFAULT_COMPILE_SDK_VERSION = 34");
      continue;
    }
    if (line.includes("def DEFAULT_TARGET_SDK_VERSION = 30")) {
      newLines.push("def DEFAULT_TARGET_SDK_VERSION = 34");
      continue;
    }
    if (line.includes("afterEvaluate { project ->")) {
      inAfterEvaluate = true;
    }

    if (inAfterEvaluate) {
      newLines.push("// PATCHED: " + line);
    } else {
      newLines.push(line);
    }
  }
  fs.writeFileSync(gradlePath, newLines.join('\n'));
}

// 2. Patch Manifest
if (fs.existsSync(manifestPath)) {
  console.log('Patching AndroidManifest.xml...');
  let content = fs.readFileSync(manifestPath, 'utf8');

  // Add android:exported="true" to the service and receiver
  content = content.replace(/<service\s+android:name="\.RNAndroidNotificationListener"/g, '<service android:exported="true" android:name=".RNAndroidNotificationListener"');
  content = content.replace(/<receiver\s+android:name="com\.lesimoes\.androidnotificationlistener\.BootUpReceiver"/g, '<receiver android:exported="true" android:name="com.lesimoes.androidnotificationlistener.BootUpReceiver"');

  fs.writeFileSync(manifestPath, content);
}

console.log('Patching complete.');
