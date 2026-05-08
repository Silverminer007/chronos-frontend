<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const toast = useToast()

type Status = 'offen' | 'in_arbeit' | 'erledigt'
type Priority = 'hoch' | 'mittel' | 'niedrig'
type SharedMode = 'any' | 'all' | null

interface Assignee {
  initials: string
  accepted: boolean
}

interface Task {
  id: string
  title: string
  dueDate: string
  overdue: boolean
  priority: Priority
  assignees: Assignee[]
  sharedMode: SharedMode
  status: Status
  linkedType?: string
}

const tasks = reactive<Task[]>([
  {
    id: '1',
    title: 'Vereinsheim aufräumen',
    dueDate: '18. April 2026',
    overdue: false,
    priority: 'mittel',
    assignees: [{ initials: 'AM', accepted: true }],
    sharedMode: null,
    status: 'offen',
    linkedType: 'Gruppenstunde',
  },
  {
    id: '2',
    title: 'Getränke einkaufen',
    dueDate: '15. April 2026',
    overdue: false,
    priority: 'niedrig',
    assignees: [
      { initials: 'BK', accepted: false },
      { initials: 'CS', accepted: false },
    ],
    sharedMode: 'any',
    status: 'offen',
  },
  {
    id: '3',
    title: 'Jahresbericht schreiben',
    dueDate: '30. März 2026',
    overdue: true,
    priority: 'hoch',
    assignees: [{ initials: 'FW', accepted: true }],
    sharedMode: null,
    status: 'in_arbeit',
  },
  {
    id: '4',
    title: 'Fotoalben digitalisieren',
    dueDate: '01. Mai 2026',
    overdue: false,
    priority: 'niedrig',
    assignees: [
      { initials: 'AM', accepted: true },
      { initials: 'CS', accepted: true },
      { initials: 'DM', accepted: true },
    ],
    sharedMode: 'all',
    status: 'in_arbeit',
  },
  {
    id: '5',
    title: 'Sitzungsprotokoll April',
    dueDate: '17. April 2026',
    overdue: false,
    priority: 'mittel',
    assignees: [{ initials: 'GT', accepted: true }],
    sharedMode: null,
    status: 'erledigt',
    linkedType: 'Teamsitzung',
  },
])

interface Service {
  id: string
  title: string
  holder: { initials: string; name: string }
  dateRange: string
  active: boolean
}

const services: Service[] = [
  { id: 's1', title: 'Kassenwart', holder: { initials: 'AM', name: 'Anna M.' }, dateRange: '01.01.2026 – 31.12.2026', active: true },
  { id: 's2', title: 'Schriftführer', holder: { initials: 'FW', name: 'Felix W.' }, dateRange: '01.01.2026 – 31.12.2026', active: true },
  { id: 's3', title: 'Gerätebeauftragter', holder: { initials: 'DR', name: 'David R.' }, dateRange: '01.03.2026 – 28.02.2027', active: true },
]

type Tab = 'offen' | 'in_arbeit' | 'erledigt' | 'dienste'
const activeTab = ref<Tab>('offen')

const tabs: { key: Tab; label: string }[] = [
  { key: 'offen', label: 'Offen' },
  { key: 'in_arbeit', label: 'In Arbeit' },
  { key: 'erledigt', label: 'Erledigt' },
  { key: 'dienste', label: 'Meine Dienste' },
]

const statusCounts = computed(() => ({
  offen: tasks.filter(t => t.status === 'offen').length,
  in_arbeit: tasks.filter(t => t.status === 'in_arbeit').length,
  erledigt: tasks.filter(t => t.status === 'erledigt').length,
}))

const filteredTasks = computed(() =>
  activeTab.value === 'dienste' ? [] : tasks.filter(t => t.status === activeTab.value)
)

const statusCycle: Record<Status, Status> = {
  offen: 'in_arbeit',
  in_arbeit: 'erledigt',
  erledigt: 'offen',
}

function cycleStatus(task: Task) {
  task.status = statusCycle[task.status]
}

const priorityStripe: Record<Priority, string> = {
  hoch: 'bg-red-500',
  mittel: 'bg-yellow-400',
  niedrig: 'bg-gray-300 dark:bg-neutral-600',
}

const priorityLabel: Record<Priority, string> = {
  hoch: 'Hoch',
  mittel: 'Mittel',
  niedrig: 'Niedrig',
}

const statusBtnClass: Record<Status, string> = {
  offen: 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600',
  in_arbeit: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50',
  erledigt: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50',
}

const statusIcon: Record<Status, string> = {
  offen: 'lucide:circle',
  in_arbeit: 'lucide:loader',
  erledigt: 'lucide:check-circle-2',
}

const showCreateTaskDialog = ref(false)

function createTask() {
  showCreateTaskDialog.value = false
  toast.add({ severity: 'info', summary: 'Entwurf', detail: 'Erstellen noch nicht verfügbar – dies ist ein Mockup.', life: 3000 })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <SearchHeader />

    <div class="container mx-auto px-4 sm:px-6 pb-24">
      <div class="max-w-4xl mx-auto space-y-6 pt-6">

        <!-- Back link -->
        <NuxtLink to="/mockup" class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Icon name="lucide:arrow-left" class="text-sm" />
          Zurück zur Übersicht
        </NuxtLink>

        <!-- Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Aufgaben & Dienste</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Verwalte Aufgaben und zeitlich begrenzte Rollen im Team</p>
        </div>

        <!-- Amber info banner -->
        <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Icon name="lucide:flask-conical" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p class="text-sm text-amber-700 dark:text-amber-300">Entwurf – keine echten Daten, kein Backend. Status-Wechsel und Tabs funktionieren als Demo.</p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 bg-white dark:bg-neutral-800 rounded-xl p-1.5 border border-gray-200 dark:border-neutral-700 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            :class="activeTab === tab.key
              ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span
              v-if="tab.key !== 'dienste' && statusCounts[tab.key as Status] > 0"
              class="min-w-5 h-5 rounded-full px-1 flex items-center justify-center text-xs font-bold"
              :class="activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-neutral-600 text-gray-700 dark:text-gray-300'"
            >
              {{ statusCounts[tab.key as Status] }}
            </span>
          </button>
        </div>

        <!-- Task cards -->
        <div v-if="activeTab !== 'dienste'" class="space-y-3">
          <div v-if="filteredTasks.length === 0" class="text-center py-12">
            <Icon name="lucide:check-circle-2" class="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">Keine Aufgaben in dieser Kategorie</p>
          </div>

          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden flex"
          >
            <!-- Priority stripe -->
            <div class="w-1.5 shrink-0" :class="priorityStripe[task.priority]" />

            <div class="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <!-- Main info -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
                  <span v-if="task.linkedType" class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {{ task.linkedType }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-gray-400">
                    {{ priorityLabel[task.priority] }}
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <span class="flex items-center gap-1 text-xs" :class="task.overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'">
                    <Icon name="lucide:clock" class="text-xs" />
                    {{ task.dueDate }}
                    <span v-if="task.overdue" class="text-red-600 dark:text-red-400">(überfällig)</span>
                  </span>

                  <!-- Assignees -->
                  <div class="flex items-center gap-1">
                    <div
                      v-for="(a, i) in task.assignees"
                      :key="i"
                      class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                      :class="a.accepted
                        ? 'bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 ring-2 ring-purple-300 dark:ring-purple-700'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 ring-2 ring-gray-300 dark:ring-neutral-600'"
                      :title="a.accepted ? 'Akzeptiert' : 'Ausstehend'"
                    >
                      {{ a.initials }}
                    </div>
                  </div>

                  <!-- Shared mode badge -->
                  <span v-if="task.sharedMode === 'any'" class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Einer reicht
                  </span>
                  <span v-if="task.sharedMode === 'all'" class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Alle müssen
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- Status cycle button -->
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  :class="statusBtnClass[task.status]"
                  @click="cycleStatus(task)"
                >
                  <Icon :name="statusIcon[task.status]" class="text-xs" />
                  {{ task.status === 'offen' ? 'Offen' : task.status === 'in_arbeit' ? 'In Arbeit' : 'Erledigt' }}
                </button>
                <NuxtLink
                  :to="`/mockup/aufgaben/${task.id}`"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-all"
                >
                  Detail
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Service cards -->
        <div v-if="activeTab === 'dienste'" class="space-y-3">
          <div class="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
            <Icon name="lucide:info" class="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <p class="text-sm text-purple-700 dark:text-purple-300">Dienste sind zeitlich begrenzte Rollen (z.B. Kassenwart). Sie haben keinen Erledigen-Button – ist das so gewünscht?</p>
          </div>

          <div
            v-for="service in services"
            :key="service.id"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden flex"
          >
            <div class="w-1.5 shrink-0 bg-purple-500" />
            <div class="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-9 h-9 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  {{ service.holder.initials }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ service.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.holder.name }} · {{ service.dateRange }}</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Aktiv
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- FAB -->
    <button
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 z-50"
      @click="showCreateTaskDialog = true"
    >
      <Icon name="lucide:plus" class="text-xl" />
    </button>

    <!-- Create Task Dialog -->
    <div v-if="showCreateTaskDialog" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div class="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-2xl">
        <div class="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Neue Aufgabe erstellen</h2>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titel</label>
            <input type="text" placeholder="z.B. Raum vorbereiten" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fällig am</label>
            <input type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priorität</label>
            <select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm">
              <option>Hoch</option>
              <option selected>Mittel</option>
              <option>Niedrig</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button class="px-5 py-2.5 rounded-lg font-medium border-2 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="showCreateTaskDialog = false">
            Abbrechen
          </button>
          <button class="px-5 py-2.5 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="createTask">
            Erstellen
          </button>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>
