import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "br.com.coopersystem.portal",
  appName: "Cooper System",
  webDir: "www",
  bundledWebRuntime: false,
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
