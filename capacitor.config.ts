import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "br.com.coopersystem.portal",
  appName: "Cooper System",
  webDir: "www",
  bundledWebRuntime: false,
  // npmClient: "npm",
  // windowsAndroidStudioPath: "C:\\Users\\cesar\\AppData\\Local\\JetBrains\\Toolbox\\apps\\AndroidStudio\\ch-0\\203.7935034\\bin\\studio64.exe",
  // linuxAndroidStudioPath: "/home/cesar/.local/share/JetBrains/Toolbox/apps/AndroidStudio/ch-0/203.7784292/bin/studio.sh",
  loggingBehavior: "debug",
  cordova: {
    preferences: {}
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "cool.wav"
    }
  },
}

export default config;
