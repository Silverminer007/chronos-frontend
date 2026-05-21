import posthog from 'posthog-js'

export function useTracking() {
  function track(event: string, properties?: Record<string, string | number | string[]>) {
    if (import.meta.server) return
    posthog.capture(event, properties)
  }
  return { track }
}
