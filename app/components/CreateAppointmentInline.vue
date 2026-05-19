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
const showInvite = ref(false)
const showExtra = ref(false)
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
  { label: '30m', minutes: 30 },
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
  { label: '3h', minutes: 180 },
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
  showExtra.value = false
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

function cancel() {
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

    cancel()
    await navigateTo(`/appointment/${result.id}`)
  } catch {
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Termin konnte nicht erstellt werden', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Transition name="inline-slide">
    <div
      v-if="modelValue"
      class="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-lg overflow-hidden"
    >
      <!-- Top accent -->
      <div class="h-1 bg-linear-to-r from-purple-600 to-pink-500" />

      <div class="p-4 space-y-4">
        <!-- Row 1: Title -->
        <input
          ref="titleInput"
          v-model="form.name"
          type="text"
          placeholder="Neuer Termin…"
          class="w-full text-xl font-bold bg-transparent border-0 border-b-2 border-gray-100 dark:border-neutral-700 focus:border-purple-500 dark:focus:border-purple-400 outline-none pb-2 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-neutral-600 transition-colors"
        />

        <!-- Row 2: Start + Duration -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Start datetime pill -->
          <div class="relative">
            <input
              v-model="startStr"
              type="datetime-local"
              class="pl-8 pr-3 py-2 rounded-full border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Icon name="lucide:calendar" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          </div>

          <!-- Duration chips -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <button
              v-for="chip in DURATION_CHIPS"
              :key="chip.minutes"
              type="button"
              @click="selectDuration(chip.minutes)"
              class="px-3 py-2 rounded-full text-sm font-medium transition-all"
              :class="!showCustomDuration && selectedDuration === chip.minutes
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-600'"
            >{{ chip.label }}</button>

            <!-- Custom duration -->
            <button
              type="button"
              @click="showCustomDuration = !showCustomDuration; if(showCustomDuration) selectedDuration = null"
              class="px-3 py-2 rounded-full text-sm font-medium transition-all"
              :class="showCustomDuration
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-600'"
            >…</button>
          </div>

          <!-- Custom duration input -->
          <div v-if="showCustomDuration" class="flex items-center gap-1.5">
            <input
              v-model.number="customDurationMinutes"
              type="number"
              min="1"
              max="10080"
              class="w-20 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">Min</span>
          </div>
        </div>

        <!-- Row 3: Attendees toggle chip + stepper -->
        <div class="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            @click="form.hasAttendees = !form.hasAttendees"
            class="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all border"
            :class="form.hasAttendees
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-gray-50 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-600 hover:border-purple-300'"
          >
            <Icon name="lucide:users" class="text-sm" />
            Teilnehmer
          </button>

          <Transition name="inline-fade">
            <div v-if="form.hasAttendees" class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Mindest:</span>
              <button
                type="button"
                @click="form.minimalAttendees = Math.max(0, form.minimalAttendees - 1)"
                class="w-7 h-7 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors text-sm"
              >−</button>
              <span class="w-6 text-center font-semibold text-gray-900 dark:text-white text-sm">{{ form.minimalAttendees }}</span>
              <button
                type="button"
                @click="form.minimalAttendees++"
                class="w-7 h-7 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors text-sm"
              >+</button>
            </div>
          </Transition>
        </div>

        <!-- Row 4: Participant picker -->
        <div>
          <button
            type="button"
            @click="showInvite = !showInvite"
            class="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <Icon :name="showInvite ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="text-xs" />
            Personen &amp; Gruppen einladen
          </button>

          <Transition name="inline-fade">
            <div v-if="showInvite" class="mt-3">
              <AppointmentParticipantPicker ref="picker" />
            </div>
          </Transition>
        </div>

        <!-- Row 5: Expandable description & venue -->
        <div>
          <button
            type="button"
            @click="showExtra = !showExtra"
            class="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <Icon :name="showExtra ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="text-xs" />
            Beschreibung &amp; Ort
          </button>

          <Transition name="inline-fade">
            <div v-if="showExtra" class="mt-3 space-y-3">
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Beschreibung…"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div class="relative">
                <Icon name="lucide:map-pin" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  v-model="form.venue"
                  type="text"
                  placeholder="Ort…"
                  class="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Row 6: Actions -->
        <div class="flex items-center justify-end gap-3 pt-1 border-t border-gray-100 dark:border-neutral-700">
          <button
            type="button"
            @click="cancel"
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            @click="submit"
            :disabled="!isValid || saving"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            :class="isValid && !saving ? 'bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-md active:scale-95' : 'bg-gray-300 dark:bg-neutral-600 cursor-not-allowed'"
          >
            <Icon v-if="saving" name="lucide:loader-circle" class="animate-spin text-sm" />
            <span>{{ saving ? 'Erstelle…' : 'Erstellen' }}</span>
            <Icon v-if="!saving" name="lucide:arrow-right" class="text-sm" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.inline-slide-enter-active, .inline-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease, max-height 0.3s ease;
  max-height: 600px;
  overflow: hidden;
}
.inline-slide-enter-from, .inline-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}

.inline-fade-enter-active, .inline-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.inline-fade-enter-from, .inline-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>
