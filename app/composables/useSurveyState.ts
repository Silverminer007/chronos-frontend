export function useSurveyState(surveyId: string) {
  const key = `survey_done_${surveyId}`

  function isCompleted(): boolean {
    if (import.meta.server) return false
    return localStorage.getItem(key) === '1'
  }

  function markCompleted(): void {
    if (import.meta.server) return
    localStorage.setItem(key, '1')
  }

  function reset(): void {
    if (import.meta.server) return
    localStorage.removeItem(key)
  }

  return { isCompleted, markCompleted, reset }
}
