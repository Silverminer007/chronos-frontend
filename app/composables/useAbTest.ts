const VARIANTS = ['a', 'b', 'c'] as const
export type AbVariant = typeof VARIANTS[number]

const AB_SURVEY_ID = '22222222-2222-2222-2222-222222222222'

export function useAbTest() {
  const authStore = useAuthStore()

  const variant = computed((): AbVariant =>
    VARIANTS[(authStore.user?.id ?? 0) % VARIANTS.length]
  )

  const hasFeedbackBeenSubmitted = () =>
    import.meta.client && !!localStorage.getItem('abTestFeedbackDone')

  const markFeedbackDone = () =>
    import.meta.client && localStorage.setItem('abTestFeedbackDone', '1')

  async function submitFeedback(rating: number, comment: string) {
    try {
      await $fetch(`/api/v2/survey/${AB_SURVEY_ID}/responses`, {
        method: 'POST',
        body: {
          answers: [
            { questionId: 'variant', answer: variant.value },
            { questionId: 'rating', answer: String(rating) },
            { questionId: 'comment', answer: comment },
          ]
        }
      })
    } catch {
      // Silently ignore — appointment is already created
    }
    markFeedbackDone()
  }

  return { variant, hasFeedbackBeenSubmitted, markFeedbackDone, submitFeedback }
}
