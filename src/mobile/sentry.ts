import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import * as Sentry from '@sentry/browser'
import { version } from '../Config'

export const initSentry = () => {
  Sentry.init({
    dsn: 'https://ce11624370e74203955008cf4c852970@sentry.synergism.cc/1',
    tracesSampleRate: 0, // Bugsink is error tracking only; it discards tracing data
    release: version,
    sendClientReports: false, // Errors only
    integrations: (integrations) => [
      ...integrations.filter((integration) => integration.name !== 'BrowserSession'),
      Sentry.captureConsoleIntegration({ levels: ['error'] })
    ]
  })

  Sentry.setTag('platform', Capacitor.getPlatform())

  CapacitorUpdater.current()
    .then(({ bundle, native }) => {
      Sentry.setTag('bundle', bundle.version)
      Sentry.setTag('native', native)
    })
    .catch((e) => console.error('Failed to tag Sentry with the current bundle', e))
}
