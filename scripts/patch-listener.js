const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, '../node_modules/react-native-android-notification-listener/android/build.gradle');

if (fs.existsSync(gradlePath)) {
  console.log('Patching build.gradle for react-native-android-notification-listener...');
  let lines = fs.readFileSync(gradlePath, 'utf8').split('\n');

  let newLines = [];
  let inAfterEvaluate = false;

  for (let line of lines) {
    // 1. Comment out 'apply plugin: maven'
    if (line.includes("apply plugin: 'maven'")) {
      newLines.push("// " + line);
      continue;
    }

    // 2. Fix Default SDK versions
    if (line.includes("def DEFAULT_COMPILE_SDK_VERSION = 30")) {
      newLines.push("def DEFAULT_COMPILE_SDK_VERSION = 34");
      continue;
    }
    if (line.includes("def DEFAULT_TARGET_SDK_VERSION = 30")) {
      newLines.push("def DEFAULT_TARGET_SDK_VERSION = 34");
      continue;
    }

    // 3. Start commenting out afterEvaluate
    if (line.includes("afterEvaluate { project ->")) {
      inAfterEvaluate = true;
      newLines.push("/* REMOVED BY PATCH");
      newLines.push(line);
      continue;
    }

    newLines.push(line);
  }

  if (inAfterEvaluate) {
    newLines.push("*/");
  }

  fs.writeFileSync(gradlePath, newLines.join('\n'));
  console.log('Patching complete.');
} else {
  console.error('Could not find build.gradle at ' + gradlePath);
  process.exit(1);
}
