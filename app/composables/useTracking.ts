import formbricks from '@formbricks/js'

export function useTracking() {
  function track(event: string, properties?: Record<string, string | number | string[]>) {
    if (import.meta.server) return
    formbricks.track(event, properties ? { hiddenFields: properties } : undefined)
  }
  return { track }
}