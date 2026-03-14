const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, '../node_modules/react-native-android-notification-listener/android/build.gradle');

if (fs.existsSync(gradlePath)) {
  console.log('Patching build.gradle for react-native-android-notification-listener...');
  let content = fs.readFileSync(gradlePath, 'utf8');

  // 1. Comment out 'apply plugin: maven'
  content = content.replace(/apply plugin: 'maven'/g, "// apply plugin: 'maven'");

  // 2. Fix Default SDK versions to match contemporary standards
  content = content.replace(/def DEFAULT_COMPILE_SDK_VERSION = 30/g, 'def DEFAULT_COMPILE_SDK_VERSION = 34');
  content = content.replace(/def DEFAULT_TARGET_SDK_VERSION = 30/g, 'def DEFAULT_TARGET_SDK_VERSION = 34');

  // 3. Remove the afterEvaluate block that uses mavenDeployer
  // This is a bit tricky with regex, so we'll just look for task installArchives
  const installArchivesIndex = content.indexOf('task installArchives');
  if (installArchivesIndex !== -1) {
    console.log('Found installArchives task, commenting it out...');
    // We'll just comment out the whole afterEvaluate block since it's mostly for publishing
    content = content.replace(/afterEvaluate \{ project ->/g, '/* afterEvaluate { project ->');
    content = content.replace(/\s+ artifacts \{[\s\S]+?installArchives\(type: Upload\) \{[\s\S]+?\}[\s\S]+?\}/g, (match) => match + '\n*/');
  }

  fs.writeFileSync(gradlePath, content);
  console.log('Patching complete.');
} else {
  console.error('Could not find build.gradle at ' + gradlePath);
  process.exit(1);
}
