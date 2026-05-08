<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()

interface RequiredField {
  id: string
  label: string
  placeholder: string
}

type ResolutionType = 'rejected' | 'moved' | 'assigned'

interface Resolution {
  type: ResolutionType
  movedTo?: string
  assignees?: string[]
}

interface AgendaItem {
  id: number
  title: string
  type: 'appointment' | 'task' | 'topic' | 'service'
  unassigned?: boolean          // task/service brought to the meeting without an assigned person
  autoAppearRule?: string
  requiredFields: RequiredField[]
  coupledWith?: string
  notes: string
  status: 'offen' | 'besprochen' | 'erledigt'
}

interface SitzungData {
  id: number
  label: string
  date: string
  venue: string
  daysUntil: number
  participantCount: number
  isNext: boolean
  items: AgendaItem[]
}

const allSitzungen: Record<string, SitzungData> = {
  '1': {
    id: 1,
    label: 'März-Sitzung',
    date: '20.03.2026',
    venue: 'Vereinsheim Hauptraum',
    daysUntil: -20,
    participantCount: 10,
    isNext: false,
    items: [
      {
        id: 4,
        title: 'Kassenprüfung',
        type: 'service',
        autoAppearRule: '4 Wochen vorher',
        requiredFields: [
          { id: 'ergebnis', label: 'Ergebnis', placeholder: 'z.B. ohne Beanstandungen' },
          { id: 'pruefer', label: 'Kassenprüfer', placeholder: 'z.B. Klaus M.' },
        ],
        coupledWith: 'April-Sitzung',
        notes: 'Termin mit Kassenprüfer vereinbart',
        status: 'besprochen',
      },
      {
        id: 5,
        title: 'Getränkedienst Sommerlager',
        type: 'task',
        unassigned: true,
        requiredFields: [],
        notes: 'Jemand muss sich um die Getränkeversorgung für das Sommerlager kümmern. Benötigt werden ca. 200 Liter für 5 Tage.',
        status: 'offen',
      },
    ],
  },
  '2': {
    id: 2,
    label: 'April-Sitzung',
    date: '17.04.2026',
    venue: 'Vereinsheim Hauptraum',
    daysUntil: 8,
    participantCount: 12,
    isNext: true,
    items: [
      {
        id: 1,
        title: 'Sommerlager 2026',
        type: 'appointment',
        autoAppearRule: '8 Wochen vorher',
        requiredFields: [
          { id: 'datum', label: 'Datum', placeholder: 'z.B. 24.07.–01.08.2026' },
          { id: 'ort', label: 'Ort', placeholder: 'z.B. Zeltplatz Waldeck' },
          { id: 'budget', label: 'Budget', placeholder: 'z.B. 2.500 €' },
          { id: 'helfer', label: 'Benötigte Helfer', placeholder: 'z.B. Anna M., Ben K.' },
        ],
        coupledWith: 'Mai-Sitzung, Juni-Sitzung',
        notes: '',
        status: 'offen',
      },
      {
        id: 2,
        title: 'Jahresbericht fertigstellen',
        type: 'task',
        requiredFields: [{ id: 'verantwortlich', label: 'Verantwortliche Person', placeholder: 'z.B. Felix W.' }],
        coupledWith: 'Mai-Sitzung',
        notes: '',
        status: 'offen',
      },
      {
        id: 3,
        title: 'Neue Mitgliedsbeiträge',
        type: 'topic',
        requiredFields: [
          { id: 'beschluss', label: 'Beschluss', placeholder: 'z.B. Erhöhung auf 8 € / Monat ab Jan 2027' },
          { id: 'betrag', label: 'Neuer Betrag', placeholder: 'z.B. 8,00 €' },
        ],
        notes: '',
        status: 'offen',
      },
      {
        id: 4,
        title: 'Kassenprüfung',
        type: 'service',
        autoAppearRule: '4 Wochen vorher',
        requiredFields: [{ id: 'bericht', label: 'Ergebnis Kassenprüfung', placeholder: 'z.B. ohne Beanstandungen, Bericht liegt vor' }],
        coupledWith: 'März-Sitzung',
        notes: '',
        status: 'offen',
      },
    ],
  },
  '3': {
    id: 3,
    label: 'Mai-Sitzung',
    date: '15.05.2026',
    venue: 'Vereinsheim Hauptraum',
    daysUntil: 36,
    participantCount: 11,
    isNext: false,
    items: [
      {
        id: 1,
        title: 'Sommerlager 2026',
        type: 'appointment',
        autoAppearRule: '8 Wochen vorher',
        requiredFields: [{ id: 'anmeldung', label: 'Anmeldeschluss', placeholder: 'z.B. 30.06.2026' }],
        coupledWith: 'April-Sitzung, Juni-Sitzung',
        notes: '',
        status: 'offen',
      },
      {
        id: 2,
        title: 'Jahresbericht fertigstellen',
        type: 'task',
        requiredFields: [{ id: 'abgabe', label: 'Abgabedatum', placeholder: 'z.B. 10.05.2026' }],
        coupledWith: 'April-Sitzung',
        notes: '',
        status: 'offen',
      },
    ],
  },
  '4': {
    id: 4,
    label: 'Juni-Sitzung',
    date: '19.06.2026',
    venue: 'Vereinsheim Hauptraum',
    daysUntil: 71,
    participantCount: 10,
    isNext: false,
    items: [
      {
        id: 1,
        title: 'Sommerlager 2026',
        type: 'appointment',
        autoAppearRule: '8 Wochen vorher',
        requiredFields: [{ id: 'teilnehmer', label: 'Teilnehmeranzahl', placeholder: 'z.B. 32 Personen' }],
        coupledWith: 'April-Sitzung, Mai-Sitzung',
        notes: '',
        status: 'offen',
      },
    ],
  },
}

const sitzung = computed(() => allSitzungen[route.params.id as string] ?? allSitzungen['2'])

// ── Required field values ────────────────────────────────────────────────────
const requiredFieldValues = reactive<Record<string, string>>({})
sitzung.value.items.forEach(item => {
  item.requiredFields.forEach(field => {
    const key = `${item.id}_${field.id}`
    requiredFieldValues[key] = (item.status === 'erledigt' || item.status === 'besprochen') ? '(bereits eingetragen)' : ''
  })
})

// ── Item notes + statuses ────────────────────────────────────────────────────
const itemNotes = reactive<Record<number, string>>(
  Object.fromEntries(sitzung.value.items.map(item => [item.id, item.notes]))
)
const itemStatuses = reactive<Record<number, string>>(
  Object.fromEntries(sitzung.value.items.map(item => [item.id, item.status]))
)

function markItemDone(itemId: number) {
  itemStatuses[itemId] = 'erledigt'
}

// ── Assignment resolution ────────────────────────────────────────────────────
// Which UI panel is open for a given item id: null | 'rejected' | 'moved' | 'assigned'
const resolutionMode = reactive<Record<number, ResolutionType | null>>({})
// Committed resolutions
const resolutions = reactive<Record<number, Resolution | null>>({})
// Pending move target (dropdown selection before confirming)
const pendingMoveTarget = reactive<Record<number, string>>({})
// Pending assignee selection
const pendingAssignees = reactive<Record<number, string[]>>({})

const allMembers = ['Anna M.', 'Ben K.', 'Clara S.', 'Felix W.', 'Georg T.', 'David R.']

// Other sitzungen to move to (all except current)
const otherSitzungen = Object.values(allSitzungen)
  .filter(s => s.id !== sitzung.value.id)
  .map(s => s.label)

function openResolutionMode(itemId: number, mode: ResolutionType) {
  resolutionMode[itemId] = mode
  if (mode === 'moved' && !pendingMoveTarget[itemId]) {
    pendingMoveTarget[itemId] = otherSitzungen[0] ?? ''
  }
  if (mode === 'assigned' && !pendingAssignees[itemId]) {
    pendingAssignees[itemId] = []
  }
}

function cancelResolution(itemId: number) {
  resolutionMode[itemId] = null
}

function commitReject(itemId: number) {
  resolutions[itemId] = { type: 'rejected' }
  resolutionMode[itemId] = null
}

function commitMove(itemId: number) {
  if (!pendingMoveTarget[itemId]) return
  resolutions[itemId] = { type: 'moved', movedTo: pendingMoveTarget[itemId] }
  resolutionMode[itemId] = null
}

function commitAssign(itemId: number) {
  if (!pendingAssignees[itemId]?.length) return
  resolutions[itemId] = { type: 'assigned', assignees: [...pendingAssignees[itemId]] }
  resolutionMode[itemId] = null
}

function toggleAssignee(itemId: number, name: string) {
  if (!pendingAssignees[itemId]) pendingAssignees[itemId] = []
  const idx = pendingAssignees[itemId].indexOf(name)
  if (idx >= 0) pendingAssignees[itemId].splice(idx, 1)
  else pendingAssignees[itemId].push(name)
}

function resetResolution(itemId: number) {
  resolutions[itemId] = null
  resolutionMode[itemId] = null
}

function getInitials(name: string) {
  return name.split(' ').map(p => p[0]).join('')
}

// An unassigned item is "resolved" if it has a committed resolution
function isUnresolved(item: AgendaItem) {
  return item.unassigned && !resolutions[item.id]
}

// ── Sitzung close logic ──────────────────────────────────────────────────────
const emptyFields = computed(() => {
  const result: { itemTitle: string; fieldLabel: string }[] = []
  sitzung.value.items.forEach(item => {
    item.requiredFields.forEach(field => {
      if (!requiredFieldValues[`${item.id}_${field.id}`]?.trim()) {
        result.push({ itemTitle: item.title, fieldLabel: field.label })
      }
    })
  })
  return result
})

const unresolvedItems = computed(() =>
  sitzung.value.items.filter(item => isUnresolved(item))
)

const canClose = computed(() => emptyFields.value.length === 0 && unresolvedItems.value.length === 0)

const showCloseSitzungDialog = ref(false)
const sitzungClosed = ref(false)

function closeSitzung() {
  showCloseSitzungDialog.value = false
  sitzungClosed.value = true
  toast.add({ severity: 'success', summary: 'Sitzung abgeschlossen', detail: 'Entwurf – Funktion noch nicht verfügbar.', life: 3000 })
}

function saveNotes(_itemId: number) {
  toast.add({ severity: 'success', summary: 'Notizen gespeichert', detail: 'Entwurf – Speichern noch nicht verfügbar.', life: 3000 })
}

// ── Display helpers ──────────────────────────────────────────────────────────
const typeConfig = {
  appointment: { icon: 'lucide:calendar',        label: 'Termin',   badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', color: 'text-orange-600 dark:text-orange-400' },
  task:        { icon: 'lucide:circle-check-big', label: 'Aufgabe',  badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',         color: 'text-blue-600 dark:text-blue-400' },
  topic:       { icon: 'lucide:message-circle',   label: 'Thema',    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',       color: 'text-green-600 dark:text-green-400' },
  service:     { icon: 'lucide:shield-check',     label: 'Dienst',   badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',   color: 'text-purple-600 dark:text-purple-400' },
}

const statusConfig: Record<string, string> = {
  offen:      'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300',
  besprochen: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  erledigt:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const statusLabel: Record<string, string> = {
  offen: 'Offen', besprochen: 'Besprochen', erledigt: 'Erledigt',
}

function cardBorderClass(item: AgendaItem) {
  if (isUnresolved(item)) return 'border-red-300 dark:border-red-700 ring-1 ring-red-200 dark:ring-red-800'
  if (item.requiredFields.some(f => !requiredFieldValues[`${item.id}_${f.id}`]?.trim()) && itemStatuses[item.id] !== 'erledigt')
    return 'border-orange-300 dark:border-orange-700 ring-1 ring-orange-200 dark:ring-orange-800'
  return 'border-gray-200 dark:border-neutral-700'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <SearchHeader />

    <div class="container mx-auto px-4 sm:px-6 pb-24">
      <div class="max-w-3xl mx-auto space-y-6 pt-6">

        <!-- Back link -->
        <NuxtLink to="/mockup/planner" class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Icon name="lucide:arrow-left" class="text-sm" />
          Zurück zum Team-Planner
        </NuxtLink>

        <!-- Header card -->
        <div class="rounded-xl overflow-hidden shadow-sm bg-linear-to-r from-purple-600 to-pink-500 dark:from-purple-500 dark:to-pink-400 p-6 text-white">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold">{{ sitzung.label }}</h1>
              <div class="flex flex-wrap items-center gap-3 mt-2 text-white/80 text-sm">
                <span class="flex items-center gap-1.5"><Icon name="lucide:calendar" class="text-xs" />{{ sitzung.date }}</span>
                <span class="flex items-center gap-1.5"><Icon name="lucide:map-pin" class="text-xs" />{{ sitzung.venue }}</span>
                <span class="flex items-center gap-1.5"><Icon name="lucide:users" class="text-xs" />{{ sitzung.participantCount }} Personen</span>
                <span class="flex items-center gap-1.5"><Icon name="lucide:list" class="text-xs" />{{ sitzung.items.length }} Agenda-Punkte</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span v-if="sitzung.isNext" class="px-3 py-1 rounded-full text-xs font-bold bg-white/20">Nächste Sitzung</span>
              <span v-if="sitzung.daysUntil > 0" class="text-sm text-white/80">{{ sitzung.daysUntil }} Tage bis zur Sitzung</span>
              <span v-else-if="sitzung.daysUntil < 0" class="text-sm text-white/80">Vor {{ Math.abs(sitzung.daysUntil) }} Tagen</span>
              <span v-else class="text-sm text-white/80 font-semibold">Heute!</span>
            </div>
          </div>
        </div>

        <!-- Closed banner -->
        <div v-if="sitzungClosed" class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <Icon name="lucide:check-circle-2" class="text-green-600 dark:text-green-400 text-xl shrink-0" />
          <p class="font-semibold text-green-800 dark:text-green-200">Sitzung wurde erfolgreich abgeschlossen.</p>
        </div>

        <!-- Numbered agenda items -->
        <div class="space-y-4">
          <div
            v-for="(item, index) in sitzung.items"
            :key="item.id"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border overflow-hidden transition-all"
            :class="cardBorderClass(item)"
          >
            <div class="p-5 space-y-4">

              <!-- Number + title + badges -->
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm shrink-0">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <Icon :name="typeConfig[item.type].icon" class="text-sm shrink-0" :class="typeConfig[item.type].color" />
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="typeConfig[item.type].badge">{{ typeConfig[item.type].label }}</span>
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusConfig[itemStatuses[item.id]]">{{ statusLabel[itemStatuses[item.id]] }}</span>
                    <!-- Unassigned warning badge in title row -->
                    <span v-if="item.unassigned && !resolutions[item.id]" class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      <Icon name="lucide:user-x" class="text-xs" />
                      Keine Zuweisung
                    </span>
                  </div>
                </div>
              </div>

              <!-- Auto appear chip -->
              <div v-if="item.autoAppearRule">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  <Icon name="lucide:zap" class="text-xs" />
                  Automatisch hinzugefügt – {{ item.autoAppearRule }}
                </span>
              </div>

              <!-- Coupling info -->
              <div v-if="item.coupledWith" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="lucide:link" class="text-sm shrink-0" />
                Auch in {{ item.coupledWith }} verknüpft
              </div>

              <!-- ── ASSIGNMENT RESOLUTION BLOCK ─────────────────────────────── -->
              <template v-if="item.unassigned">

                <!-- RESOLVED: show result -->
                <div
v-if="resolutions[item.id]" class="rounded-xl border p-4 space-y-2"
                  :class="{
                    'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800':     resolutions[item.id]!.type === 'rejected',
                    'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800': resolutions[item.id]!.type === 'moved',
                    'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800': resolutions[item.id]!.type === 'assigned',
                  }"
                >
                  <!-- Rejected -->
                  <div v-if="resolutions[item.id]!.type === 'rejected'" class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:x-circle" class="text-red-600 dark:text-red-400 shrink-0" />
                      <span class="text-sm font-semibold text-red-800 dark:text-red-300">Aufgabe abgelehnt</span>
                    </div>
                    <button class="text-xs text-red-600 dark:text-red-400 hover:underline" @click="resetResolution(item.id)">Rückgängig</button>
                  </div>

                  <!-- Moved -->
                  <div v-else-if="resolutions[item.id]!.type === 'moved'" class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:arrow-right-circle" class="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span class="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Verschoben auf {{ resolutions[item.id]!.movedTo }}
                      </span>
                    </div>
                    <button class="text-xs text-blue-600 dark:text-blue-400 hover:underline" @click="resetResolution(item.id)">Rückgängig</button>
                  </div>

                  <!-- Assigned -->
                  <div v-else-if="resolutions[item.id]!.type === 'assigned'" class="flex items-center justify-between gap-3 flex-wrap">
                    <div class="flex items-center gap-3">
                      <Icon name="lucide:user-check" class="text-green-600 dark:text-green-400 shrink-0" />
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-semibold text-green-800 dark:text-green-300">Zugewiesen an</span>
                        <span
                          v-for="name in resolutions[item.id]!.assignees"
                          :key="name"
                          class="w-7 h-7 rounded-full bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold text-xs"
                          :title="name"
                        >
                          {{ getInitials(name) }}
                        </span>
                        <span class="text-sm text-green-700 dark:text-green-400">{{ resolutions[item.id]!.assignees!.join(', ') }}</span>
                      </div>
                    </div>
                    <button class="text-xs text-green-600 dark:text-green-400 hover:underline shrink-0" @click="resetResolution(item.id)">Rückgängig</button>
                  </div>
                </div>

                <!-- UNRESOLVED: show prompt + options -->
                <div v-else class="rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 space-y-3">
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:triangle-alert" class="text-red-600 dark:text-red-400 shrink-0" />
                    <p class="text-sm font-semibold text-red-800 dark:text-red-300">Keine Zuweisung – Entscheidung erforderlich</p>
                  </div>
                  <p class="text-xs text-red-700 dark:text-red-400">Diese Aufgabe hat keine verantwortliche Person. Bitte eine der folgenden Optionen wählen:</p>

                  <!-- Option buttons (when no sub-panel open) -->
                  <div v-if="!resolutionMode[item.id]" class="flex flex-wrap gap-2">
                    <button
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                      @click="openResolutionMode(item.id, 'rejected')"
                    >
                      <Icon name="lucide:x" class="text-sm" />
                      Ablehnen
                    </button>
                    <button
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all"
                      @click="openResolutionMode(item.id, 'moved')"
                    >
                      <Icon name="lucide:arrow-right" class="text-sm" />
                      Auf andere Sitzung verschieben
                    </button>
                    <button
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all"
                      @click="openResolutionMode(item.id, 'assigned')"
                    >
                      <Icon name="lucide:user-plus" class="text-sm" />
                      Person zuweisen
                    </button>
                  </div>

                  <!-- Sub-panel: Reject confirmation -->
                  <div v-if="resolutionMode[item.id] === 'rejected'" class="space-y-3 pt-1">
                    <p class="text-sm text-red-700 dark:text-red-400">Die Aufgabe wird als abgelehnt markiert und nicht weiterverfolgt.</p>
                    <div class="flex gap-2">
                      <button class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="cancelResolution(item.id)">Abbrechen</button>
                      <button class="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-all" @click="commitReject(item.id)">Ablehnen bestätigen</button>
                    </div>
                  </div>

                  <!-- Sub-panel: Move to another sitzung -->
                  <div v-if="resolutionMode[item.id] === 'moved'" class="space-y-3 pt-1">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ziel-Sitzung</label>
                      <select
                        v-model="pendingMoveTarget[item.id]"
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option v-for="s in otherSitzungen" :key="s" :value="s">{{ s }}</option>
                      </select>
                    </div>
                    <div class="flex gap-2">
                      <button class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="cancelResolution(item.id)">Abbrechen</button>
                      <button class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all" @click="commitMove(item.id)">Verschieben</button>
                    </div>
                  </div>

                  <!-- Sub-panel: Assign persons -->
                  <div v-if="resolutionMode[item.id] === 'assigned'" class="space-y-3 pt-1">
                    <p class="text-xs font-medium text-gray-700 dark:text-gray-300">Person(en) auswählen:</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="name in allMembers"
                        :key="name"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2"
                        :class="pendingAssignees[item.id]?.includes(name)
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300'
                          : 'bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:border-green-400'"
                        @click="toggleAssignee(item.id, name)"
                      >
                        <span class="w-5 h-5 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs shrink-0">
                          {{ getInitials(name) }}
                        </span>
                        {{ name }}
                        <Icon v-if="pendingAssignees[item.id]?.includes(name)" name="lucide:check" class="text-xs text-green-600 dark:text-green-400" />
                      </button>
                    </div>
                    <div class="flex gap-2">
                      <button class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="cancelResolution(item.id)">Abbrechen</button>
                      <button
                        class="px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
                        :class="pendingAssignees[item.id]?.length
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-300 dark:bg-neutral-600 cursor-not-allowed'"
                        :disabled="!pendingAssignees[item.id]?.length"
                        @click="commitAssign(item.id)"
                      >
                        Zuweisen{{ pendingAssignees[item.id]?.length ? ` (${pendingAssignees[item.id].length})` : '' }}
                      </button>
                    </div>
                  </div>
                </div>
              </template>
              <!-- ── END ASSIGNMENT RESOLUTION BLOCK ───────────────────────── -->

              <!-- Required fields (text inputs) -->
              <div v-if="item.requiredFields.length > 0" class="space-y-3">
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Icon name="lucide:asterisk" class="text-red-500 text-xs" />
                  Pflichtfelder
                </p>
                <div v-for="field in item.requiredFields" :key="field.id">
                  <label
                    class="block text-sm font-medium mb-1"
                    :class="requiredFieldValues[`${item.id}_${field.id}`]?.trim() ? 'text-gray-700 dark:text-gray-300' : 'text-orange-700 dark:text-orange-400'"
                  >
                    {{ field.label }}
                    <span v-if="!requiredFieldValues[`${item.id}_${field.id}`]?.trim()" class="text-orange-500 ml-0.5">*</span>
                  </label>
                  <input
                    v-model="requiredFieldValues[`${item.id}_${field.id}`]"
                    type="text"
                    :placeholder="field.placeholder"
                    class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                    :class="requiredFieldValues[`${item.id}_${field.id}`]?.trim()
                      ? 'border-green-300 dark:border-green-700'
                      : 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10'"
                  />
                </div>
              </div>

              <!-- Notes textarea -->
              <div>
                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Notizen</label>
                <textarea
                  v-model="itemNotes[item.id]"
                  rows="2"
                  placeholder="Notizen zu diesem Punkt..."
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <!-- Status + done button -->
              <div class="flex items-center justify-between pt-1">
                <button class="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" @click="saveNotes(item.id)">
                  Notizen speichern
                </button>
                <button
                  v-if="itemStatuses[item.id] !== 'erledigt'"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                  @click="markItemDone(item.id)"
                >
                  <Icon name="lucide:check" class="text-xs" />
                  Als erledigt markieren
                </button>
                <span v-else class="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                  <Icon name="lucide:check-circle-2" class="text-sm" />
                  Erledigt
                </span>
              </div>

            </div>
          </div>
        </div>

        <!-- Sitzung abschließen section -->
        <div v-if="!sitzungClosed" class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 space-y-4">
          <h2 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="lucide:flag" class="text-purple-600 dark:text-purple-400" />
            Sitzung abschließen
          </h2>

          <!-- Blockers -->
          <div v-if="!canClose" class="space-y-3">
            <!-- Unresolved unassigned items -->
            <div v-if="unresolvedItems.length > 0" class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <Icon name="lucide:user-x" class="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div>
                <p class="font-semibold text-sm text-red-800 dark:text-red-200">Offene Zuweisungen</p>
                <ul class="mt-1 space-y-0.5">
                  <li v-for="item in unresolvedItems" :key="item.id" class="text-xs text-red-700 dark:text-red-300">
                    · {{ item.title }} – Ablehnen, Verschieben oder Person zuweisen
                  </li>
                </ul>
              </div>
            </div>

            <!-- Empty required fields -->
            <div v-if="emptyFields.length > 0" class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <Icon name="lucide:triangle-alert" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p class="font-semibold text-sm text-amber-800 dark:text-amber-200">Leere Pflichtfelder</p>
                <ul class="mt-1 space-y-0.5">
                  <li v-for="(ef, i) in emptyFields" :key="i" class="text-xs text-amber-700 dark:text-amber-300">
                    · {{ ef.itemTitle }}: {{ ef.fieldLabel }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- All clear -->
          <div v-else class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <Icon name="lucide:check-circle-2" class="text-green-600 dark:text-green-400 shrink-0" />
            <p class="font-semibold text-sm text-green-800 dark:text-green-200">Alles erledigt – Sitzung kann abgeschlossen werden.</p>
          </div>

          <div class="flex justify-end">
            <button
              class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-all"
              :class="canClose
                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-lg'
                : 'bg-gray-300 dark:bg-neutral-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'"
              :disabled="!canClose"
              @click="showCloseSitzungDialog = true"
            >
              <Icon name="lucide:check-circle" />
              Sitzung abschließen
            </button>
          </div>
        </div>

      </div>
    </div>

    <ConfirmDialog
      :visible="showCloseSitzungDialog"
      title="Sitzung abschließen?"
      message="Die Sitzung wird als abgeschlossen markiert. Alle Notizen und Beschlüsse werden gespeichert."
      confirm-text="Abschließen"
      confirm-color="green"
      @close="showCloseSitzungDialog = false"
      @confirm="closeSitzung"
    />

    <Toast />
  </div>
</template>
