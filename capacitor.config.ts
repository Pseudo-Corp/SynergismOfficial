import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'cc.pseudocorp.synergism',
  appName: 'Synergism',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
}

export default config
