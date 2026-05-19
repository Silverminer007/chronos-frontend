<script setup lang="ts">
import type { AbVariant } from '~/composables/useAbTest'

const props = defineProps<{ modelValue: boolean; variant: AbVariant }>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'navigate': []
}>()

const { hasFeedbackBeenSubmitted, markFeedbackDone, submitFeedback } = useAbTest()

const rating = ref(0)
const comment = ref('')
const submitting = ref(false)
let autoTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (val) => {
  if (!val) return

  if (hasFeedbackBeenSubmitted()) {
    emit('navigate')
    return
  }

  rating.value = 0
  comment.value = ''
  autoTimer = setTimeout(() => {
    dismiss()
  }, 20000)
})

onUnmounted(() => {
  if (autoTimer) clearTimeout(autoTimer)
})

function clearTimer() {
  if (autoTimer) {
    clearTimeout(autoTimer)
    autoTimer = null
  }
}

function dismiss() {
  clearTimer()
  markFeedbackDone()
  emit('update:modelValue', false)
  emit('navigate')
}

async function submit() {
  if (rating.value === 0 || submitting.value) return
  clearTimer()
  submitting.value = true
  await submitFeedback(rating.value, comment.value)
  submitting.value = false
  emit('update:modelValue', false)
  emit('navigate')
}

const VARIANT_LABELS: Record<AbVariant, string> = {
  a: 'Bottom Sheet',
  b: 'Inline Card',
  c: 'Stepper',
}
</script>

<template>
  <Transition name="feedback-slide">
    <div
      v-if="modelValue && !hasFeedbackBeenSubmitted()"
      class="fixed bottom-24 left-4 right-4 z-40 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-4"
    >
      <p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        Wie war die Erstellungsmaske?
      </p>
      <p class="text-xs text-gray-400 dark:text-neutral-500 mb-3">
        Variante {{ variant.toUpperCase() }} – {{ VARIANT_LABELS[variant] }}
      </p>

      <!-- Star rating -->
      <div class="flex gap-1 mb-3">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          @click="rating = star"
          class="text-2xl transition-transform active:scale-90"
          :class="star <= rating ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'"
        >
          ★
        </button>
      </div>

      <!-- Comment -->
      <textarea
        v-model="comment"
        rows="2"
        placeholder="Optionaler Kommentar…"
        class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
      />

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="dismiss"
          class="flex-1 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
        >
          Jetzt nicht
        </button>
        <button
          type="button"
          @click="submit"
          :disabled="rating === 0 || submitting"
          class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
          :class="rating > 0 && !submitting
            ? 'bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
            : 'bg-gray-300 dark:bg-neutral-600 cursor-not-allowed'"
        >
          <Icon v-if="submitting" name="lucide:loader-circle" class="animate-spin text-xs" />
          <span>Absenden</span>
          <Icon v-if="!submitting" name="lucide:arrow-right" class="text-xs" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.feedback-slide-enter-active, .feedback-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.feedback-slide-enter-from, .feedback-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
