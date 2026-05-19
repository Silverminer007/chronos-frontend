<script setup lang="ts">
import { useAppointmentsStore } from '~/stores/appointments'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const appointmentStore = useAppointmentsStore()
const toast = useToast()

const step = ref(1)
const TOTAL_STEPS = 4
const saving = ref(false)
const picker = ref<{ getSelectedUsers: () => any[]; getSelectedGroups: () => any[] } | null>(null)
const stepDirection = ref<'forward' | 'back'>('forward')

const titleInput = ref<HTMLInputElement | null>(null)

const name = ref('')
const startStr = ref('')
const selectedDuration = ref<number | null>(60)
const showCustomDuration = ref(false)
const customDurationMinutes = ref(60)
const hasAttendees = ref(false)
const minimalAttendees = ref(5)
const description = ref('')
const venue = ref('')
const showOptional = ref(false)

const DURATION_CHIPS = [
  { label: '30 Min', minutes: 30 },
  { label: '1 Std', minutes: 60 },
  { label: '2 Std', minutes: 120 },
  { label: '3 Std', minutes: 180 },
  { label: '4 Std', minutes: 240 },
  { label: 'Ganztägig', minutes: 1440 },
]

const TODAY_CHIPS = [
  { label: 'Heute', days: 0 },
  { label: 'Morgen', days: 1 },
  { label: 'Übermorgen', days: 2 },
]

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function initDefaults() {
  step.value = 1
  name.value = ''
  description.value = ''
  venue.value = ''
  hasAttendees.value = false
  minimalAttendees.value = 5
  selectedDuration.value = 60
  showCustomDuration.value = false
  customDurationMinutes.value = 60
  showOptional.value = false

  const now = new Date()
  const start = new Date(now)
  start.setHours(now.getHours() + 1, 0, 0, 0)
  startStr.value = toDatetimeLocal(start)
}

watch(() => props.modelValue, (val) => {
  if (val) {
    initDefaults()
    nextTick(() => titleInput.value?.focus())
  }
})

function setDatePart(daysFromNow: number) {
  const current = startStr.value ? new Date(startStr.value) : new Date()
  const target = new Date()
  target.setDate(target.getDate() + daysFromNow)
  target.setHours(current.getHours(), current.getMinutes(), 0, 0)
  startStr.value = toDatetimeLocal(target)
}

const startDate = computed(() => startStr.value ? new Date(startStr.value) : null)

const effectiveDuration = computed(() => {
  if (showCustomDuration.value) return customDurationMinutes.value > 0 ? customDurationMinutes.value : null
  return selectedDuration.value
})

const computedEnd = computed(() => {
  if (!startDate.value || !effectiveDuration.value) return null
  return new Date(startDate.value.getTime() + effectiveDuration.value * 60000)
})

const canProceed = computed(() => {
  if (step.value === 1) return name.value.trim().length > 0
  if (step.value === 2) return startDate.value !== null
  if (step.value === 3) return effectiveDuration.value !== null
  return true
})

function selectDuration(minutes: number) {
  selectedDuration.value = minutes
  showCustomDuration.value = false
}

function goNext() {
  if (!canProceed.value) return
  if (step.value < TOTAL_STEPS) {
    stepDirection.value = 'forward'
    step.value++
  } else {
    submit()
  }
}

function goBack() {
  if (step.value > 1) {
    stepDirection.value = 'back'
    step.value--
  }
}

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  if (saving.value) return
  saving.value = true
  try {
    const result = await appointmentStore.createAppointment({
      name: name.value.trim(),
      description: description.value.trim() || null,
      start: startDate.value!.toISOString(),
      end: computedEnd.value!.toISOString(),
      venue: venue.value.trim() || null,
      minimal_attendees: hasAttendees.value ? minimalAttendees.value : 0
    } as any)

    const users = picker.value?.getSelectedUsers() ?? []
    const groups = picker.value?.getSelectedGroups() ?? []
    await Promise.all([
      ...users.map((u: any) => appointmentStore.addParticipant(result.id, u.id, u.role).catch(() => null)),
      ...groups.map((g: any) => appointmentStore.addGroupParticipant(result.id, g.id, g.role).catch(() => null)),
    ])

    close()
    await navigateTo(`/appointment/${result.id}`)
  } catch {
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Termin konnte nicht erstellt werden', life: 3000 })
  } finally {
    saving.value = false
  }
}

// Swipe support
const touchStartX = ref(0)
function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(dx) < 50) return
  if (dx < 0 && canProceed.value) goNext()
  else if (dx > 0) goBack()
}
</script>

<template>
  <!-- Backdrop -->
  <Transition name="stepper-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col" @touchstart="onTouchStart" @touchend="onTouchEnd">

      <!-- Top bar -->
      <div class="flex items-center justify-between px-5 pt-safe pt-4 pb-4 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0">
        <button
          type="button"
          @click="step > 1 ? goBack() : close()"
          class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Icon :name="step > 1 ? 'lucide:arrow-left' : 'lucide:x'" class="text-xl" />
        </button>

        <!-- Progress dots -->
        <div class="flex items-center gap-2">
          <div
            v-for="s in TOTAL_STEPS"
            :key="s"
            class="rounded-full transition-all duration-300"
            :class="s === step
              ? 'w-6 h-2 bg-purple-600'
              : s < step
                ? 'w-2 h-2 bg-purple-400'
                : 'w-2 h-2 bg-gray-200 dark:bg-neutral-700'"
          />
        </div>

        <!-- Step counter -->
        <span class="text-sm font-medium text-gray-400 dark:text-neutral-500">{{ step }} / {{ TOTAL_STEPS }}</span>
      </div>

      <!-- Step content -->
      <div class="flex-1 overflow-y-auto">
        <Transition :name="stepDirection === 'forward' ? 'step-fwd' : 'step-back'" mode="out-in">

          <!-- Step 1: Title -->
          <div v-if="step === 1" key="step1" class="flex flex-col items-center justify-center min-h-full px-8 py-12 text-center">
            <div class="w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mb-8">
              <Icon name="lucide:type" class="text-purple-600 dark:text-purple-400 text-2xl" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wie heißt der Termin?</h1>
            <p class="text-gray-500 dark:text-gray-400 mb-10">Gib deinem Termin einen Namen.</p>
            <input
              ref="titleInput"
              v-model="name"
              type="text"
              placeholder="z.B. Sommerfest 2025"
              @keydown.enter="goNext"
              class="w-full max-w-sm text-center text-2xl font-semibold bg-transparent border-0 border-b-2 border-gray-200 dark:border-neutral-600 focus:border-purple-500 dark:focus:border-purple-400 outline-none pb-3 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-neutral-600 transition-colors"
            />
          </div>

          <!-- Step 2: When -->
          <div v-else-if="step === 2" key="step2" class="flex flex-col items-center justify-center min-h-full px-8 py-12 text-center">
            <div class="w-16 h-16 bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mb-8">
              <Icon name="lucide:calendar" class="text-blue-600 dark:text-blue-400 text-2xl" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wann?</h1>
            <p class="text-gray-500 dark:text-gray-400 mb-8">Wähle Datum und Uhrzeit.</p>

            <!-- Quick day chips -->
            <div class="flex gap-2 mb-6">
              <button
                v-for="chip in TODAY_CHIPS"
                :key="chip.days"
                type="button"
                @click="setDatePart(chip.days)"
                class="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                {{ chip.label }}
              </button>
            </div>

            <!-- datetime-local input -->
            <input
              v-model="startStr"
              type="datetime-local"
              class="px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white text-lg focus:outline-none focus:border-purple-500 transition-all w-full max-w-sm"
            />
          </div>

          <!-- Step 3: Duration -->
          <div v-else-if="step === 3" key="step3" class="flex flex-col items-center justify-center min-h-full px-8 py-12 text-center">
            <div class="w-16 h-16 bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mb-8">
              <Icon name="lucide:timer" class="text-amber-600 dark:text-amber-400 text-2xl" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wie lange?</h1>
            <p class="text-gray-500 dark:text-gray-400 mb-8">Wähle die Dauer des Termins.</p>

            <div class="grid grid-cols-2 gap-3 w-full max-w-sm">
              <button
                v-for="chip in DURATION_CHIPS"
                :key="chip.minutes"
                type="button"
                @click="selectDuration(chip.minutes)"
                class="py-4 rounded-2xl text-base font-semibold transition-all"
                :class="!showCustomDuration && selectedDuration === chip.minutes
                  ? 'bg-purple-600 text-white shadow-lg scale-[1.02]'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'"
              >
                {{ chip.label }}
              </button>

              <button
                type="button"
                @click="showCustomDuration = !showCustomDuration; if(showCustomDuration) selectedDuration = null"
                class="py-4 rounded-2xl text-base font-semibold transition-all"
                :class="showCustomDuration
                  ? 'bg-purple-600 text-white shadow-lg scale-[1.02] col-span-2'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'"
              >
                Eigene Dauer
              </button>
            </div>

            <Transition name="step-fwd">
              <div v-if="showCustomDuration" class="mt-4 flex items-center gap-3">
                <input
                  v-model.number="customDurationMinutes"
                  type="number"
                  min="1"
                  max="10080"
                  class="w-28 px-4 py-3 rounded-xl border-2 border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white text-center text-lg font-semibold focus:outline-none focus:border-purple-500"
                />
                <span class="text-gray-600 dark:text-gray-400 font-medium">Minuten</span>
              </div>
            </Transition>
          </div>

          <!-- Step 4: Attendees + participants + optional -->
          <div v-else-if="step === 4" key="step4" class="flex flex-col items-center min-h-full px-6 py-8 space-y-6">
            <!-- Header -->
            <div class="text-center">
              <div class="w-16 h-16 bg-linear-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:users" class="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Teilnehmer</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Mindestanzahl und Einladungen festlegen.</p>
            </div>

            <!-- Minimum attendees -->
            <div class="w-full max-w-sm">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 text-center">Mindestanzahl Teilnehmer</p>
              <div class="flex gap-3 justify-center mb-3">
                <button
                  type="button"
                  @click="hasAttendees = true"
                  class="flex-1 py-3.5 rounded-2xl text-base font-bold transition-all max-w-[120px]"
                  :class="hasAttendees ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'"
                >
                  Ja
                </button>
                <button
                  type="button"
                  @click="hasAttendees = false"
                  class="flex-1 py-3.5 rounded-2xl text-base font-bold transition-all max-w-[120px]"
                  :class="!hasAttendees ? 'bg-gray-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-lg' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'"
                >
                  Nein
                </button>
              </div>

              <Transition name="step-fwd">
                <div v-if="hasAttendees" class="flex items-center justify-center gap-5 py-2">
                  <button
                    type="button"
                    @click="minimalAttendees = Math.max(0, minimalAttendees - 1)"
                    class="w-11 h-11 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold text-2xl hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                  >−</button>
                  <span class="w-10 text-center font-bold text-4xl text-gray-900 dark:text-white">{{ minimalAttendees }}</span>
                  <button
                    type="button"
                    @click="minimalAttendees++"
                    class="w-11 h-11 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold text-2xl hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                  >+</button>
                </div>
              </Transition>
            </div>

            <!-- Participant picker -->
            <div class="w-full max-w-sm">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 text-center">Personen &amp; Gruppen einladen</p>
              <AppointmentParticipantPicker ref="picker" />
            </div>

            <!-- Optional fields collapse -->
            <div class="w-full max-w-sm text-left">
              <button
                type="button"
                @click="showOptional = !showOptional"
                class="flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-neutral-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-3"
              >
                <Icon :name="showOptional ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="text-sm" />
                Beschreibung &amp; Ort (optional)
              </button>

              <Transition name="step-fwd">
                <div v-if="showOptional" class="space-y-3">
                  <textarea
                    v-model="description"
                    rows="3"
                    placeholder="Beschreibung…"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div class="relative">
                    <Icon name="lucide:map-pin" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      v-model="venue"
                      type="text"
                      placeholder="Ort…"
                      class="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </Transition>
            </div>
          </div>

        </Transition>
      </div>

      <!-- Bottom nav -->
      <div class="flex items-center gap-4 px-5 py-4 border-t border-gray-100 dark:border-neutral-800 flex-shrink-0" style="padding-bottom: max(1rem, env(safe-area-inset-bottom))">
        <button
          v-if="step > 1"
          type="button"
          @click="goBack"
          class="px-5 py-3.5 rounded-2xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Zurück
        </button>
        <button
          v-else
          type="button"
          @click="close"
          class="px-5 py-3.5 rounded-2xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Abbrechen
        </button>

        <button
          type="button"
          @click="goNext"
          :disabled="!canProceed || saving"
          class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition-all disabled:opacity-50"
          :class="canProceed && !saving
            ? 'bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg active:scale-[0.98]'
            : 'bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500 cursor-not-allowed'"
        >
          <Icon v-if="saving" name="lucide:loader-circle" class="animate-spin" />
          <span>{{ step < TOTAL_STEPS ? 'Weiter' : (saving ? 'Erstelle…' : 'Erstellen') }}</span>
          <Icon v-if="!saving && step < TOTAL_STEPS" name="lucide:arrow-right" />
          <Icon v-if="!saving && step === TOTAL_STEPS" name="lucide:check" />
        </button>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.stepper-fade-enter-active { transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.stepper-fade-leave-active { transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.stepper-fade-enter-from { opacity: 0; transform: translateY(30px); }
.stepper-fade-leave-to { opacity: 0; transform: translateY(30px); }

.step-fwd-enter-active, .step-back-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.step-fwd-leave-active, .step-back-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }

.step-fwd-enter-from { opacity: 0; transform: translateX(24px); }
.step-fwd-leave-to { opacity: 0; transform: translateX(-24px); }

.step-back-enter-from { opacity: 0; transform: translateX(-24px); }
.step-back-leave-to { opacity: 0; transform: translateX(24px); }
</style>
