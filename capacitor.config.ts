import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'cc.pseudocorp.synergism',
  appName: 'Synergism',
  webDir: 'dist',
  plugins: {
    AppAttest: {
      cloudProjectNumber: '537222501218'
    },
    CapacitorHttp: {
      enabled: true
    },
    CapacitorUpdater: {
      autoUpdate: 'atBackground',
      resetWhenUpdate: true,
      updateUrl: 'https://synergism.cc/versions/updates',
      statsUrl: '',
      periodCheckDelay: 3600,
      appReadyTimeout: 30000
    }
  }
}

export default config
