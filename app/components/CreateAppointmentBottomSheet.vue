<script setup lang="ts">
import { useAppointmentsStore } from '~/stores/appointments'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const appointmentStore = useAppointmentsStore()
const toast = useToast()

const titleInput = ref<HTMLInputElement | null>(null)
const picker = ref<{ getSelectedUsers: () => any[]; getSelectedGroups: () => any[] } | null>(null)
const saving = ref(false)
const showMore = ref(false)
const showCustomDuration = ref(false)
const selectedDuration = ref<number | null>(60)
const customDurationMinutes = ref(30)
const startStr = ref('')

const form = ref({
  name: '',
  description: '',
  venue: '',
  hasAttendees: false,
  minimalAttendees: 5
})

const DURATION_CHIPS = [
  { label: '30 Min', minutes: 30 },
  { label: '1 Std', minutes: 60 },
  { label: '2 Std', minutes: 120 },
  { label: '3 Std', minutes: 180 },
  { label: '4 Std', minutes: 240 },
  { label: 'Ganztägig', minutes: 1440 },
]

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function initDefaults() {
  const now = new Date()
  const start = new Date(now)
  start.setHours(now.getHours() + 1, 0, 0, 0)
  startStr.value = toDatetimeLocal(start)
  selectedDuration.value = 60
  showCustomDuration.value = false
  showMore.value = false
  form.value = { name: '', description: '', venue: '', hasAttendees: false, minimalAttendees: 5 }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    initDefaults()
    nextTick(() => titleInput.value?.focus())
  }
})

function selectDuration(minutes: number) {
  selectedDuration.value = minutes
  showCustomDuration.value = false
}

function toggleCustomDuration() {
  showCustomDuration.value = !showCustomDuration.value
  if (showCustomDuration.value) selectedDuration.value = null
  else selectedDuration.value = 60
}

const effectiveDuration = computed(() => {
  if (showCustomDuration.value) return customDurationMinutes.value > 0 ? customDurationMinutes.value : null
  return selectedDuration.value
})

const startDate = computed(() => startStr.value ? new Date(startStr.value) : null)

const computedEnd = computed(() => {
  if (!startDate.value || !effectiveDuration.value) return null
  return new Date(startDate.value.getTime() + effectiveDuration.value * 60000)
})

const isValid = computed(() =>
  form.value.name.trim().length > 0 && startDate.value !== null && computedEnd.value !== null
)

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  if (!isValid.value || saving.value) return
  saving.value = true
  try {
    const result = await appointmentStore.createAppointment({
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      start: startDate.value!.toISOString(),
      end: computedEnd.value!.toISOString(),
      venue: form.value.venue.trim() || null,
      minimal_attendees: form.value.hasAttendees ? form.value.minimalAttendees : 0
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
</script>

<template>
  <!-- Backdrop -->
  <Transition name="bs-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
      @click="close"
    />
  </Transition>

  <!-- Sheet -->
  <Transition name="bs-slide">
    <div
      v-if="modelValue"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-800 rounded-t-2xl shadow-2xl flex flex-col"
      style="max-height: 90dvh; padding-bottom: env(safe-area-inset-bottom, 0px)"
    >
      <!-- Handle bar -->
      <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
        <div class="w-10 h-1 bg-gray-300 dark:bg-neutral-600 rounded-full" />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-neutral-700 flex-shrink-0">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Neuer Termin</h2>
        <button
          @click="close"
          class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <Icon name="lucide:x" class="text-base" />
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <!-- Title -->
        <input
          ref="titleInput"
          v-model="form.name"
          type="text"
          placeholder="Terminname…"
          class="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-gray-200 dark:border-neutral-600 focus:border-purple-500 dark:focus:border-purple-400 outline-none pb-2 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-neutral-600 transition-colors"
        />

        <!-- Start datetime -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Start</label>
          <input
            v-model="startStr"
            type="datetime-local"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <!-- Duration chips -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Dauer</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="chip in DURATION_CHIPS"
              :key="chip.minutes"
              type="button"
              @click="selectDuration(chip.minutes)"
              class="px-3 py-2 rounded-full text-sm font-medium transition-all"
              :class="!showCustomDuration && selectedDuration === chip.minutes
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'"
            >
              {{ chip.label }}
            </button>
            <button
              type="button"
              @click="toggleCustomDuration"
              class="px-3 py-2 rounded-full text-sm font-medium transition-all"
              :class="showCustomDuration
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'"
            >
              Eigene…
            </button>
          </div>
          <div v-if="showCustomDuration" class="mt-3 flex items-center gap-3">
            <input
              v-model.number="customDurationMinutes"
              type="number"
              min="1"
              max="10080"
              placeholder="60"
              class="w-28 px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-sm text-gray-500 dark:text-gray-400">Minuten</span>
          </div>
        </div>

        <!-- Attendees toggle -->
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Teilnehmer</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Mindestteilnehmer festlegen</p>
          </div>
          <button
            type="button"
            @click="form.hasAttendees = !form.hasAttendees"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
            :class="form.hasAttendees ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-600'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
              :class="form.hasAttendees ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Min attendees stepper -->
        <Transition name="expand">
          <div
            v-if="form.hasAttendees"
            class="flex items-center gap-4 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800"
          >
            <span class="text-sm font-medium text-purple-900 dark:text-purple-200">Mindestteilnehmer</span>
            <div class="flex items-center gap-3 ml-auto">
              <button
                type="button"
                @click="form.minimalAttendees = Math.max(0, form.minimalAttendees - 1)"
                class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 flex items-center justify-center font-bold text-lg leading-none hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
              >−</button>
              <span class="w-8 text-center font-bold text-purple-900 dark:text-purple-100 text-lg">{{ form.minimalAttendees }}</span>
              <button
                type="button"
                @click="form.minimalAttendees++"
                class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 flex items-center justify-center font-bold text-lg leading-none hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
              >+</button>
            </div>
          </div>
        </Transition>

        <!-- Participant picker -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Einladen</label>
          <AppointmentParticipantPicker ref="picker" />
        </div>

        <!-- More options -->
        <div>
          <button
            type="button"
            @click="showMore = !showMore"
            class="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Icon :name="showMore ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="text-base" />
            Mehr Optionen
          </button>

          <Transition name="expand">
            <div v-if="showMore" class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Beschreibung</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Beschreibe den Termin…"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Ort</label>
                <div class="relative">
                  <Icon name="lucide:map-pin" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                  <input
                    v-model="form.venue"
                    type="text"
                    placeholder="z.B. Vereinsheim"
                    class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Submit button -->
      <div class="px-6 py-4 border-t border-gray-100 dark:border-neutral-700 flex-shrink-0">
        <button
          type="button"
          @click="submit"
          :disabled="!isValid || saving"
          class="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all"
          :class="isValid && !saving
            ? 'bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg active:scale-[0.98]'
            : 'bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500 cursor-not-allowed'"
        >
          <span v-if="saving" class="flex items-center justify-center gap-2">
            <Icon name="lucide:loader-circle" class="animate-spin" />
            Erstelle…
          </span>
          <span v-else>Erstellen</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.bs-fade-enter-active, .bs-fade-leave-active { transition: opacity 0.3s ease; }
.bs-fade-enter-from, .bs-fade-leave-to { opacity: 0; }

.bs-slide-enter-active, .bs-slide-leave-active { transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
.bs-slide-enter-from, .bs-slide-leave-to { transform: translateY(100%); }

.expand-enter-active, .expand-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
