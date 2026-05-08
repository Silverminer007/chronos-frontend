<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()

const allTypes = {
  gruppenstunde: {
    id: 'gruppenstunde',
    name: 'Gruppenstunde',
    icon: 'lucide:users',
    venue: 'Vereinsheim Raum A',
    color: 'blue',
    gradient: 'from-blue-600 to-cyan-500',
    nextDate: 'Mo, 13. April 2026 – 17:00 Uhr',
    defaultDays: [1],
    time: '17:00',
    exception: 'NRW-Schulferien',
    participants: ['AM', 'BK', 'CS', 'DM', 'EF'],
    upcomingDates: ['14.04.2026', '21.04.2026', '05.05.2026', '12.05.2026', '19.05.2026'],
  },
  vorstandssitzung: {
    id: 'vorstandssitzung',
    name: 'Vorstandssitzung',
    icon: 'lucide:briefcase',
    venue: 'Büro Vorstandsraum',
    color: 'purple',
    gradient: 'from-purple-600 to-pink-500',
    nextDate: 'Di, 05. Mai 2026 – 19:30 Uhr',
    defaultDays: [2],
    time: '19:30',
    exception: null,
    participants: ['AM', 'FW', 'GT'],
    upcomingDates: ['05.05.2026', '02.06.2026', '07.07.2026', '04.08.2026', '01.09.2026'],
  },
  teamsitzung: {
    id: 'teamsitzung',
    name: 'Teamsitzung',
    icon: 'lucide:message-square',
    venue: 'Vereinsheim Hauptraum',
    color: 'green',
    gradient: 'from-green-600 to-teal-500',
    nextDate: 'Do, 17. April 2026 – 19:00 Uhr',
    defaultDays: [4],
    time: '19:00',
    exception: null,
    participants: ['AM', 'BK', 'CS', 'DM', 'EF', 'FW'],
    upcomingDates: ['17.04.2026', '21.05.2026', '18.06.2026', '16.07.2026', '20.08.2026'],
  },
  sommerlager: {
    id: 'sommerlager',
    name: 'Sommerlager',
    icon: 'lucide:tent',
    venue: 'Zeltplatz Waldeck',
    color: 'orange',
    gradient: 'from-orange-500 to-red-400',
    nextDate: '24. Juli 2026 – 08:00 Uhr',
    defaultDays: [],
    time: '08:00',
    exception: null,
    participants: ['AM', 'BK', 'CS', 'DM', 'EF', 'FW', 'GT'],
    upcomingDates: ['24.07.2026'],
  },
}

const typ = computed(() => allTypes[route.params.id as string] ?? allTypes.teamsitzung)

// ── Holiday exceptions ───────────────────────────────────────────────────────
const bundeslaender = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
]

const breakTypes = [
  { id: 'oster',    label: 'Osterferien',       icon: 'lucide:flower-2' },
  { id: 'sommer',   label: 'Sommerferien',       icon: 'lucide:sun' },
  { id: 'herbst',   label: 'Herbstferien',       icon: 'lucide:leaf' },
  { id: 'winter',   label: 'Winterferien',       icon: 'lucide:snowflake' },
  { id: 'sonstige', label: 'Sonstige Feiertage', icon: 'lucide:calendar-x' },
]

// Pre-fill Gruppenstunde with NRW + all school breaks
const isGruppenstunde = route.params.id === 'gruppenstunde'
const selectedState = ref<string>(isGruppenstunde ? 'Nordrhein-Westfalen' : '')
const selectedBreaks = ref<string[]>(isGruppenstunde ? ['oster', 'sommer', 'herbst', 'winter'] : [])

function toggleBreak(id: string) {
  const idx = selectedBreaks.value.indexOf(id)
  if (idx >= 0) selectedBreaks.value.splice(idx, 1)
  else selectedBreaks.value.push(id)
}

const activeExceptionSummary = computed(() => {
  if (!selectedState.value || selectedBreaks.value.length === 0) return null
  const labels = breakTypes
    .filter(b => selectedBreaks.value.includes(b.id))
    .map(b => b.label)
  return `${selectedState.value} · ${labels.join(', ')}`
})

const weekdays = [
  { label: 'Mo', value: 1 },
  { label: 'Di', value: 2 },
  { label: 'Mi', value: 3 },
  { label: 'Do', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
  { label: 'So', value: 0 },
]

const selectedDays = ref<number[]>([...typ.value.defaultDays])

function toggleDay(day: number) {
  const idx = selectedDays.value.indexOf(day)
  if (idx >= 0) {
    selectedDays.value.splice(idx, 1)
  } else {
    selectedDays.value.push(day)
  }
}

function saveRule() {
  toast.add({ severity: 'info', summary: 'Entwurf', detail: 'Speichern noch nicht verfügbar – dies ist ein Mockup.', life: 3000 })
}

const propagate = ref(false)
const propagateScope = ref<'all' | 'unchanged'>('all')
const showPropagateConfirm = ref(false)

function handlePropagateConfirm() {
  showPropagateConfirm.value = false
  toast.add({ severity: 'info', summary: 'Entwurf', detail: 'Übertragung noch nicht verfügbar – dies ist ein Mockup.', life: 3000 })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <SearchHeader />

    <div class="container mx-auto px-4 sm:px-6 pb-24">
      <div class="max-w-5xl mx-auto space-y-6 pt-6">

        <!-- Back link -->
        <NuxtLink to="/mockup/termintypen" class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Icon name="lucide:arrow-left" class="text-sm" />
          Zurück zu Termintypen
        </NuxtLink>

        <div class="grid gap-6 lg:grid-cols-3">

          <!-- LEFT (col-span-2) -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Gradient header card -->
            <div class="rounded-xl overflow-hidden shadow-sm">
              <div class="p-6 text-white bg-linear-to-r" :class="typ.gradient">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon :name="typ.icon" class="text-2xl text-white" />
                  </div>
                  <div>
                    <h1 class="text-2xl font-bold">{{ typ.name }}</h1>
                    <p class="text-white/80 flex items-center gap-1.5 mt-1">
                      <Icon name="lucide:map-pin" class="text-sm" />
                      {{ typ.venue }}
                    </p>
                    <p class="text-white/80 flex items-center gap-1.5 mt-0.5 text-sm">
                      <Icon name="lucide:calendar" class="text-xs" />
                      Nächster Termin: {{ typ.nextDate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Wiederholungsregel card -->
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 space-y-5">
              <h2 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="lucide:repeat" class="text-purple-600 dark:text-purple-400" />
                Wiederholungsregel
              </h2>

              <!-- Weekday chips -->
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wochentage</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="day in weekdays"
                    :key="day.value"
                    class="w-10 h-10 rounded-full text-sm font-semibold transition-all"
                    :class="selectedDays.includes(day.value)
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-600'"
                    @click="toggleDay(day.value)"
                  >
                    {{ day.label }}
                  </button>
                </div>
              </div>

              <!-- Time -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Uhrzeit</label>
                  <input type="time" :value="typ.time" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dauer (Min.)</label>
                  <input type="number" value="90" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
                </div>
              </div>

              <!-- Holiday exceptions -->
              <div class="border-t border-gray-100 dark:border-neutral-700 pt-5 space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Icon name="lucide:calendar-off" class="text-purple-500 dark:text-purple-400" />
                    Ferien & Feiertage ausnehmen
                  </p>
                  <!-- Active summary chip -->
                  <span v-if="activeExceptionSummary" class="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-medium max-w-[200px] truncate" :title="activeExceptionSummary">
                    {{ activeExceptionSummary }}
                  </span>
                </div>

                <!-- State selector -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Bundesland</label>
                  <select
                    v-model="selectedState"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">– Keine Ausnahme –</option>
                    <option v-for="land in bundeslaender" :key="land" :value="land">{{ land }}</option>
                  </select>
                </div>

                <!-- Break type toggles (only shown when a state is selected) -->
                <div v-if="selectedState" class="space-y-2">
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Ferienarten</label>
                  <button
                    v-for="bt in breakTypes"
                    :key="bt.id"
                    class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-all text-sm"
                    :class="selectedBreaks.includes(bt.id)
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-neutral-700/50 border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-500'"
                    @click="toggleBreak(bt.id)"
                  >
                    <span class="flex items-center gap-2.5">
                      <Icon
:name="bt.icon" class="text-sm shrink-0"
                        :class="selectedBreaks.includes(bt.id) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'"
                      />
                      {{ bt.label }}
                    </span>
                    <!-- Toggle indicator -->
                    <span
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                      :class="selectedBreaks.includes(bt.id)
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-gray-300 dark:border-neutral-500'"
                    >
                      <Icon v-if="selectedBreaks.includes(bt.id)" name="lucide:check" class="text-white" style="font-size: 9px" />
                    </span>
                  </button>
                </div>

                <!-- Hint when no state selected -->
                <p v-else class="text-xs text-gray-400 dark:text-gray-500">Wähle ein Bundesland, um Ferienarten auszuwählen.</p>
              </div>

              <!-- Info box -->
              <div class="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Icon name="lucide:info" class="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 text-sm" />
                <p class="text-xs text-blue-700 dark:text-blue-300">Änderungen betreffen nur zukünftig generierte Termine. Bestehende Termine werden nicht automatisch angepasst.</p>
              </div>

              <button class="px-4 py-2.5 rounded-lg font-medium text-white text-sm bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="saveRule">
                Regel speichern
              </button>
            </div>

            <!-- Upcoming dates preview -->
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h2 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="lucide:calendar-days" class="text-purple-600 dark:text-purple-400" />
                Nächste Termine (Vorschau)
              </h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="date in typ.upcomingDates"
                  :key="date"
                  class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300"
                >
                  {{ date }}
                </span>
              </div>
            </div>

          </div>

          <!-- RIGHT (col-span-1) -->
          <div class="space-y-6">

            <!-- Standardteilnehmer card -->
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h2 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="lucide:users" class="text-purple-600 dark:text-purple-400" />
                Standardteilnehmer
              </h2>
              <div class="flex flex-wrap gap-2 mb-4">
                <div
                  v-for="initials in typ.participants"
                  :key="initials"
                  class="w-9 h-9 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm"
                >
                  {{ initials }}
                </div>
                <div class="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center">
                  <Icon name="lucide:plus" class="text-gray-400 text-sm" />
                </div>
              </div>
              <button class="w-full px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="toast.add({ severity: 'info', summary: 'Entwurf', detail: 'Funktion noch nicht verfügbar.', life: 3000 })">
                Teilnehmer bearbeiten
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">Diese Personen werden automatisch zu neu generierten Terminen eingeladen.</p>
            </div>

            <!-- Propagation card -->
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 space-y-4">
              <h2 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="lucide:git-branch" class="text-purple-600 dark:text-purple-400" />
                Änderungen übertragen
              </h2>

              <!-- Toggle -->
              <label class="flex items-center gap-3 cursor-pointer">
                <button
                  class="relative w-11 h-6 rounded-full transition-colors"
                  :class="propagate ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-600'"
                  @click="propagate = !propagate"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                    :class="propagate ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Änderungen auf bestehende Termine übertragen</span>
              </label>

              <!-- Scope options (revealed when on) -->
              <div v-if="propagate" class="space-y-3 pl-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="propagateScope" type="radio" value="all" class="text-purple-600" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Alle zukünftigen Termine</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="propagateScope" type="radio" value="unchanged" class="text-purple-600" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Nur Termine ohne manuelle Änderungen</span>
                </label>

                <div class="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <Icon name="lucide:triangle-alert" class="text-orange-600 dark:text-orange-400 mt-0.5 shrink-0 text-sm" />
                  <p class="text-xs text-orange-700 dark:text-orange-300">Diese Aktion kann nicht rückgängig gemacht werden.</p>
                </div>

                <button class="w-full px-4 py-2.5 rounded-lg font-medium text-white text-sm bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="showPropagateConfirm = true">
                  Jetzt übertragen
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Propagate Confirm Dialog -->
    <ConfirmDialog
      :visible="showPropagateConfirm"
      title="Änderungen übertragen?"
      :message="propagateScope === 'all' ? 'Alle zukünftigen Termine dieses Typs werden überschrieben. Diese Aktion kann nicht rückgängig gemacht werden.' : 'Alle zukünftigen Termine ohne manuelle Änderungen werden aktualisiert.'"
      confirm-text="Übertragen"
      confirm-color="purple"
      @close="showPropagateConfirm = false"
      @confirm="handlePropagateConfirm"
    />

    <Toast />
  </div>
</template>
