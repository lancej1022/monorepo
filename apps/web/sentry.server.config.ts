import * as Sentry from '@sentry/nextjs'

Sentry.init({
  tracesSampleRate: 1,
  debug: false,
})
