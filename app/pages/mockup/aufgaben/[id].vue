<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()

type Status = 'offen' | 'in_arbeit' | 'erledigt'

const allItems = {
  '1': {
    type: 'task',
    title: 'Vereinsheim aufräumen',
    dueDate: '18. April 2026',
    overdue: false,
    priority: 'mittel' as const,
    linkedType: 'Gruppenstunde',
    assignees: [{ initials: 'AM', name: 'Anna M.', accepted: true, completed: false }],
    sharedMode: null as null | 'any' | 'all',
    initialStatus: 'offen' as Status,
    description: 'Vor der Gruppenstunde den Raum aufräumen und Stühle aufstellen.',
  },
  '2': {
    type: 'task',
    title: 'Getränke einkaufen',
    dueDate: '15. April 2026',
    overdue: false,
    priority: 'niedrig' as const,
    linkedType: undefined,
    assignees: [
      { initials: 'BK', name: 'Ben K.', accepted: false, completed: false },
      { initials: 'CS', name: 'Clara S.', accepted: false, completed: false },
    ],
    sharedMode: 'any' as const,
    initialStatus: 'offen' as Status,
    description: 'Getränke für das nächste Treffen besorgen. Es reicht, wenn eine Person das erledigt.',
  },
  '3': {
    type: 'task',
    title: 'Jahresbericht schreiben',
    dueDate: '30. März 2026',
    overdue: true,
    priority: 'hoch' as const,
    linkedType: undefined,
    assignees: [{ initials: 'FW', name: 'Felix W.', accepted: true, completed: false }],
    sharedMode: null as null | 'any' | 'all',
    initialStatus: 'in_arbeit' as Status,
    description: 'Den Jahresbericht 2025 für die Jahreshauptversammlung fertigstellen.',
  },
  '4': {
    type: 'task',
    title: 'Fotoalben digitalisieren',
    dueDate: '01. Mai 2026',
    overdue: false,
    priority: 'niedrig' as const,
    linkedType: undefined,
    assignees: [
      { initials: 'AM', name: 'Anna M.', accepted: true, completed: true },
      { initials: 'CS', name: 'Clara S.', accepted: true, completed: false },
      { initials: 'DM', name: 'David M.', accepted: true, completed: false },
    ],
    sharedMode: 'all' as const,
    initialStatus: 'in_arbeit' as Status,
    description: 'Alle Fotoalben der letzten 10 Jahre einscannen und digital archivieren.',
  },
  '5': {
    type: 'task',
    title: 'Sitzungsprotokoll April',
    dueDate: '17. April 2026',
    overdue: false,
    priority: 'mittel' as const,
    linkedType: 'Teamsitzung',
    assignees: [{ initials: 'GT', name: 'Georg T.', accepted: true, completed: true }],
    sharedMode: null as null | 'any' | 'all',
    initialStatus: 'erledigt' as Status,
    description: 'Protokoll der April-Teamsitzung schreiben und verteilen.',
  },
  's1': {
    type: 'service',
    title: 'Kassenwart',
    dateRange: '01.01.2026 – 31.12.2026',
    holder: { initials: 'AM', name: 'Anna M.' },
    description: 'Verantwortlich für die Vereinskasse, Buchführung und Finanzbericht.',
  },
}

const item = computed(() => allItems[route.params.id as string] ?? allItems['1'])

const currentStatus = ref<Status>(item.value.type === 'task' ? (item.value as any).initialStatus : 'offen')

const statusSteps: { key: Status; label: string; icon: string }[] = [
  { key: 'offen', label: 'Offen', icon: 'lucide:circle' },
  { key: 'in_arbeit', label: 'In Arbeit', icon: 'lucide:loader' },
  { key: 'erledigt', label: 'Erledigt', icon: 'lucide:check-circle-2' },
]

const stepIndex = computed(() => statusSteps.findIndex(s => s.key === currentStatus.value))

const assigneeStatuses = ref(
  item.value.type === 'task'
    ? (item.value as any).assignees.map((a: any) => ({ ...a }))
    : []
)

const notes = ref('')

function saveNotes() {
  toast.add({ severity: 'success', summary: 'Notiz gespeichert', detail: 'Entwurf – Speichern noch nicht verfügbar.', life: 3000 })
}

const priorityLabel: Record<string, string> = { hoch: 'Hoch', mittel: 'Mittel', niedrig: 'Niedrig' }
const priorityBadge: Record<string, string> = {
  hoch: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  mittel: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  niedrig: 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300',
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <SearchHeader />

    <div class="container mx-auto px-4 sm:px-6 pb-24">
      <div class="max-w-3xl mx-auto space-y-6 pt-6">

        <!-- Back link -->
        <NuxtLink to="/mockup/aufgaben" class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Icon name="lucide:arrow-left" class="text-sm" />
          Zurück zu Aufgaben & Dienste
        </NuxtLink>

        <!-- TASK view -->
        <template v-if="item.type === 'task'">
          <!-- Gradient header -->
          <div class="rounded-xl overflow-hidden shadow-sm bg-linear-to-r from-blue-600 to-indigo-500 p-6 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold">{{ (item as any).title }}</h1>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                    {{ priorityLabel[(item as any).priority] }}
                  </span>
                  <span class="flex items-center gap-1 text-sm text-white/80">
                    <Icon name="lucide:clock" class="text-xs" />
                    {{ (item as any).dueDate }}
                    <span v-if="(item as any).overdue" class="text-red-300 font-medium">(überfällig)</span>
                  </span>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                {{ currentStatus === 'offen' ? 'Offen' : currentStatus === 'in_arbeit' ? 'In Arbeit' : 'Erledigt' }}
              </span>
            </div>
          </div>

          <!-- Status stepper -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Status</h2>
            <div class="flex items-center">
              <template v-for="(step, i) in statusSteps" :key="step.key">
                <button
                  class="flex flex-col items-center gap-1.5 transition-all"
                  :class="i <= stepIndex ? 'opacity-100' : 'opacity-40'"
                  @click="currentStatus = step.key"
                >
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    :class="i === stepIndex
                      ? 'bg-linear-to-r from-blue-600 to-indigo-500 text-white shadow-lg'
                      : i < stepIndex
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-400'"
                  >
                    <Icon :name="i < stepIndex ? 'lucide:check' : step.icon" class="text-sm" />
                  </div>
                  <span class="text-xs font-medium" :class="i === stepIndex ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'">
                    {{ step.label }}
                  </span>
                </button>
                <div v-if="i < statusSteps.length - 1" class="flex-1 h-0.5 mx-2 transition-all" :class="i < stepIndex ? 'bg-green-400' : 'bg-gray-200 dark:bg-neutral-700'" />
              </template>
            </div>
          </div>

          <!-- Shared mode info -->
          <div
v-if="(item as any).sharedMode" class="flex items-start gap-3 p-4 rounded-xl border"
            :class="(item as any).sharedMode === 'any'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'"
          >
            <Icon
              :name="(item as any).sharedMode === 'any' ? 'lucide:users' : 'lucide:check-square'"
              class="mt-0.5 shrink-0"
              :class="(item as any).sharedMode === 'any' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'"
            />
            <div>
              <p class="font-semibold text-sm" :class="(item as any).sharedMode === 'any' ? 'text-green-800 dark:text-green-300' : 'text-blue-800 dark:text-blue-300'">
                {{ (item as any).sharedMode === 'any' ? 'Einer reicht' : 'Alle müssen erledigen' }}
              </p>
              <p class="text-xs mt-0.5" :class="(item as any).sharedMode === 'any' ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'">
                {{ (item as any).sharedMode === 'any'
                  ? 'Die Aufgabe gilt als erledigt, sobald eine Person sie abgeschlossen hat.'
                  : 'Jede zugewiesene Person muss die Aufgabe einzeln als erledigt markieren.' }}
              </p>
            </div>
          </div>

          <!-- Per-assignee completion rows -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Zugewiesene Personen</h2>
            <div class="space-y-3">
              <div
                v-for="(a, i) in assigneeStatuses"
                :key="i"
                class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50"
              >
                <div class="w-9 h-9 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm shrink-0">
                  {{ a.initials }}
                </div>
                <span class="flex-1 text-sm font-medium text-gray-900 dark:text-white">{{ a.name }}</span>
                <div class="flex items-center gap-2">
                  <span v-if="!a.accepted" class="text-xs text-gray-500 dark:text-gray-400">Einladung ausstehend</span>
                  <button
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                    :class="a.completed
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-neutral-600 dark:text-gray-400 hover:bg-gray-200'"
                    @click="a.completed = !a.completed"
                  >
                    <Icon :name="a.completed ? 'lucide:check-circle-2' : 'lucide:clock'" class="text-xs" />
                    {{ a.completed ? 'Erledigt' : 'Ausstehend' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Linked type -->
          <div v-if="(item as any).linkedType" class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-4 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Icon name="lucide:calendar-cog" class="text-blue-600 dark:text-blue-400" />
            </div>
            <div class="flex-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">Verknüpfter Termintyp</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ (item as any).linkedType }}</p>
            </div>
            <NuxtLink :to="`/mockup/termintypen/${(item as any).linkedType.toLowerCase().replace(' ', '')}`" class="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Öffnen
            </NuxtLink>
          </div>

          <!-- Notes -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Icon name="lucide:notebook-pen" class="text-purple-600 dark:text-purple-400" />
              Notizen
            </h2>
            <textarea
              v-model="notes"
              rows="4"
              placeholder="Notizen zu dieser Aufgabe..."
              class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div class="flex justify-end mt-3">
              <button class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="saveNotes">
                Speichern
              </button>
            </div>
          </div>
        </template>

        <!-- SERVICE view -->
        <template v-else>
          <!-- Gradient header -->
          <div class="rounded-xl overflow-hidden shadow-sm bg-linear-to-r from-purple-600 to-pink-500 p-6 text-white">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon name="lucide:shield-check" class="text-2xl text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold">{{ (item as any).title }}</h1>
                <p class="text-white/80 mt-1 text-sm">Dienst · {{ (item as any).dateRange }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Inhaber</h2>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                {{ (item as any).holder.initials }}
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ (item as any).holder.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ (item as any).dateRange }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-2">Beschreibung</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ (item as any).description }}</p>
          </div>

          <div class="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
            <Icon name="lucide:info" class="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <p class="text-sm text-purple-700 dark:text-purple-300">Dienste haben bewusst keinen "Erledigen"-Button, da sie über einen Zeitraum andauern, nicht wie Aufgaben abgeschlossen werden.</p>
          </div>
        </template>

      </div>
    </div>

    <Toast />
  </div>
</template>
