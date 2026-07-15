import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'cc.pseudocorp.synergism',
  appName: 'Synergism',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    CapacitorUpdater: {
      autoUpdate: 'atBackground',
      updateUrl: 'https://synergism.cc/versions/updates',
      statsUrl: '',
      periodCheckDelay: 3600,
      appReadyTimeout: 30000
    }
  }
}

export default config
