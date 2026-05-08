<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const toast = useToast()

interface Sitzung {
  id: number
  label: string
  date: string
  isNext: boolean
  isPast: boolean
}

const sitzungen: Sitzung[] = [
  { id: 1, label: 'März-Sitzung', date: '20.03.2026', isNext: false, isPast: true },
  { id: 2, label: 'April-Sitzung', date: '17.04.2026', isNext: true, isPast: false },
  { id: 3, label: 'Mai-Sitzung', date: '15.05.2026', isNext: false, isPast: false },
  { id: 4, label: 'Juni-Sitzung', date: '19.06.2026', isNext: false, isPast: false },
]

type ItemType = 'appointment' | 'task' | 'topic' | 'service'

interface AgendaItem {
  id: number
  title: string
  type: ItemType
  unassigned?: boolean
  visibleIn: number[]
  autoRule?: string
  couplingCount: number
  status: Record<number, 'offen' | 'besprochen' | 'erledigt'>
  notes: Record<number, string>
}

const agendaItems = reactive<AgendaItem[]>([
  {
    id: 1,
    title: 'Sommerlager 2026',
    type: 'appointment',
    visibleIn: [2, 3, 4],
    autoRule: '8 Wochen vorher',
    couplingCount: 3,
    status: { 2: 'offen', 3: 'offen', 4: 'offen' },
    notes: { 2: '', 3: '', 4: '' },
  },
  {
    id: 2,
    title: 'Jahresbericht fertigstellen',
    type: 'task',
    visibleIn: [2, 3],
    autoRule: undefined,
    couplingCount: 2,
    status: { 2: 'offen', 3: 'offen' },
    notes: { 2: '', 3: '' },
  },
  {
    id: 3,
    title: 'Neue Mitgliedsbeiträge',
    type: 'topic',
    visibleIn: [2],
    autoRule: undefined,
    couplingCount: 1,
    status: { 2: 'offen' },
    notes: { 2: '' },
  },
  {
    id: 4,
    title: 'Kassenprüfung',
    type: 'service',
    visibleIn: [1, 2],
    autoRule: '4 Wochen vorher',
    couplingCount: 2,
    status: { 1: 'besprochen', 2: 'offen' },
    notes: { 1: 'Termin mit Kassenprüfer vereinbart', 2: '' },
  },
  {
    id: 5,
    title: 'Getränkedienst Sommerlager',
    type: 'task',
    visibleIn: [1],
    autoRule: undefined,
    couplingCount: 1,
    status: { 1: 'offen' },
    notes: { 1: '' },
    unassigned: true,
  },
])

const typeConfig: Record<ItemType, { icon: string; label: string; color: string; badge: string }> = {
  appointment: {
    icon: 'lucide:calendar',
    label: 'Termin',
    color: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  task: {
    icon: 'lucide:circle-check-big',
    label: 'Aufgabe',
    color: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  topic: {
    icon: 'lucide:message-circle',
    label: 'Thema',
    color: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  service: {
    icon: 'lucide:shield-check',
    label: 'Dienst',
    color: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
}

const statusConfig: Record<string, { label: string; class: string }> = {
  offen: { label: 'Offen', class: 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300' },
  besprochen: { label: 'Besprochen', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  erledigt: { label: 'Erledigt', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
}

// Mobile state
const currentMobileSitzung = ref(sitzungen.find(s => s.isNext)?.id ?? 2)

// Dialog state
const showAddItemDialog = ref(false)
const addItemTarget = ref<number | null>(null)

function openAddItemDialog(sitzungId: number) {
  addItemTarget.value = sitzungId
  showAddItemDialog.value = true
}

function addItem() {
  showAddItemDialog.value = false
  toast.add({ severity: 'info', summary: 'Entwurf', detail: 'Hinzufügen noch nicht verfügbar – dies ist ein Mockup.', life: 3000 })
}

function getColumnItems(sitzungId: number) {
  return agendaItems.filter(item => item.visibleIn.includes(sitzungId))
}

function otherSitzungenFor(item: AgendaItem, currentId: number) {
  const others = item.visibleIn.filter(id => id !== currentId)
  return others.map(id => sitzungen.find(s => s.id === id)?.label).filter(Boolean).join(', ')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <SearchHeader />

    <div class="px-4 sm:px-6 pb-24">
      <div class="max-w-none space-y-6 pt-6">

        <!-- Back link + Header -->
        <div class="max-w-4xl mx-auto">
          <NuxtLink to="/mockup" class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4">
            <Icon name="lucide:arrow-left" class="text-sm" />
            Zurück zur Übersicht
          </NuxtLink>
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Team-Planner</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">KanBan-Board: Spalten = Teamsitzungen, Karten = Agenda-Punkte</p>
            </div>
            <NuxtLink
              to="/mockup/planner/themen"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all shrink-0"
            >
              <Icon name="lucide:message-circle" class="text-sm" />
              Themen-Übersicht
            </NuxtLink>
          </div>
          <!-- Amber info banner -->
          <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mt-4">
            <Icon name="lucide:flask-conical" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p class="text-sm text-amber-700 dark:text-amber-300">Entwurf – Inline-Notizen und Tabs sind interaktiv. Drag & Drop noch nicht implementiert.</p>
          </div>
        </div>

        <!-- DESKTOP: KanBan board -->
        <div class="hidden md:block overflow-x-auto pb-4">
          <div class="flex gap-4" style="min-width: max-content">

            <div
              v-for="sitzung in sitzungen"
              :key="sitzung.id"
              class="w-72 shrink-0 flex flex-col gap-3"
              :class="sitzung.isPast ? 'opacity-60' : ''"
            >
              <!-- Column header -->
              <NuxtLink :to="`/mockup/planner/sitzung/${sitzung.id}`" class="block">
                <div class="rounded-xl p-4 text-white shadow-sm bg-linear-to-r from-purple-600 to-pink-500 dark:from-purple-500 dark:to-pink-400 hover:from-purple-700 hover:to-pink-600 transition-all cursor-pointer">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-bold text-sm">{{ sitzung.label }}</p>
                      <p class="text-white/80 text-xs mt-0.5">{{ sitzung.date }}</p>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      <span v-if="sitzung.isNext" class="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">Nächste</span>
                      <span v-if="sitzung.isPast" class="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">Vergangen</span>
                      <button
                        class="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                        @click.prevent="openAddItemDialog(sitzung.id)"
                      >
                        <Icon name="lucide:plus" class="text-xs text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </NuxtLink>

              <!-- Cards -->
              <div
                v-for="item in getColumnItems(sitzung.id)"
                :key="item.id"
                class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-4 space-y-3"
              >
                <!-- Type badge + title -->
                <div class="flex items-start gap-2">
                  <Icon :name="typeConfig[item.type].icon" class="mt-0.5 shrink-0 text-sm" :class="typeConfig[item.type].color" />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-gray-900 dark:text-white leading-snug">{{ item.title }}</p>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="typeConfig[item.type].badge">
                        {{ typeConfig[item.type].label }}
                      </span>
                      <span v-if="item.unassigned" class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <Icon name="lucide:user-x" class="text-xs" />
                        Keine Zuweisung
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Auto rule chip -->
                <div v-if="item.autoRule" class="flex items-center gap-1.5">
                  <span class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    <Icon name="lucide:zap" class="text-xs" />
                    Erscheint automatisch – {{ item.autoRule }}
                  </span>
                </div>

                <!-- Coupling hint -->
                <div v-if="item.couplingCount > 1" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Icon name="lucide:link" class="text-xs" />
                  In {{ item.couplingCount }} Sitzungen
                  <span v-if="otherSitzungenFor(item, sitzung.id)" class="text-gray-400 dark:text-gray-500">({{ otherSitzungenFor(item, sitzung.id) }})</span>
                </div>

                <!-- Notes textarea -->
                <textarea
                  v-model="item.notes[sitzung.id]"
                  rows="2"
                  :placeholder="`Notizen für ${sitzung.label}...`"
                  class="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <!-- Status chip -->
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusConfig[item.status[sitzung.id]].class">
                    {{ statusConfig[item.status[sitzung.id]].label }}
                  </span>
                </div>
              </div>

              <!-- Empty column -->
              <div v-if="getColumnItems(sitzung.id).length === 0" class="rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 p-6 text-center">
                <p class="text-xs text-gray-400 dark:text-gray-500">Keine Agenda-Punkte</p>
              </div>
            </div>

          </div>
        </div>

        <!-- MOBILE: Tab + single column -->
        <div class="md:hidden max-w-4xl mx-auto">
          <!-- Sticky tab bar -->
          <div class="overflow-x-auto pb-1">
            <div class="flex gap-2">
              <button
                v-for="sitzung in sitzungen"
                :key="sitzung.id"
                class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="currentMobileSitzung === sitzung.id
                  ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : sitzung.isPast
                    ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500'
                    : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-700'"
                @click="currentMobileSitzung = sitzung.id"
              >
                <span class="flex items-center gap-1.5">
                  {{ sitzung.label }}
                  <span v-if="sitzung.isNext" class="w-1.5 h-1.5 rounded-full bg-green-400" />
                </span>
              </button>
            </div>
          </div>

          <!-- Active column -->
          <div v-for="sitzung in sitzungen" :key="sitzung.id">
            <template v-if="currentMobileSitzung === sitzung.id">
              <div class="flex items-center justify-between mt-4 mb-3">
                <div>
                  <h2 class="font-semibold text-gray-900 dark:text-white">{{ sitzung.label }}</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ sitzung.date }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="sitzung.isNext" class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Nächste</span>
                  <NuxtLink :to="`/mockup/planner/sitzung/${sitzung.id}`" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-linear-to-r from-purple-600 to-pink-500 text-white">
                    Detail
                  </NuxtLink>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="item in getColumnItems(sitzung.id)"
                  :key="item.id"
                  class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-4 space-y-3"
                >
                  <div class="flex items-start gap-2">
                    <Icon :name="typeConfig[item.type].icon" class="mt-0.5 shrink-0" :class="typeConfig[item.type].color" />
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="typeConfig[item.type].badge">
                          {{ typeConfig[item.type].label }}
                        </span>
                        <span v-if="item.unassigned" class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          <Icon name="lucide:user-x" class="text-xs" />
                          Keine Zuweisung
                        </span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" :class="statusConfig[item.status[sitzung.id]].class">
                      {{ statusConfig[item.status[sitzung.id]].label }}
                    </span>
                  </div>
                  <div v-if="item.autoRule" class="flex items-center gap-1">
                    <span class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      <Icon name="lucide:zap" class="text-xs" />
                      Auto – {{ item.autoRule }}
                    </span>
                  </div>
                  <textarea
                    v-model="item.notes[sitzung.id]"
                    rows="2"
                    :placeholder="`Notizen für ${sitzung.label}...`"
                    class="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div v-if="getColumnItems(sitzung.id).length === 0" class="text-center py-8">
                  <p class="text-gray-400 dark:text-gray-500 text-sm">Keine Agenda-Punkte</p>
                </div>

                <button class="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center justify-center gap-2" @click="openAddItemDialog(sitzung.id)">
                  <Icon name="lucide:plus" />
                  Agenda-Punkt hinzufügen
                </button>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>

    <!-- FAB (mobile) -->
    <button
      class="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 z-50"
      @click="openAddItemDialog(currentMobileSitzung)"
    >
      <Icon name="lucide:plus" class="text-xl" />
    </button>

    <!-- Add item dialog -->
    <div v-if="showAddItemDialog" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div class="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-2xl">
        <div class="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Agenda-Punkt hinzufügen</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ sitzungen.find(s => s.id === addItemTarget)?.label }}
          </p>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titel</label>
            <input type="text" placeholder="z.B. Anschaffung neuer Ausrüstung" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Typ</label>
            <select class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm">
              <option>Thema</option>
              <option>Aufgabe</option>
              <option>Termin</option>
              <option>Dienst</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button class="px-5 py-2.5 rounded-lg font-medium border-2 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="showAddItemDialog = false">
            Abbrechen
          </button>
          <button class="px-5 py-2.5 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="addItem">
            Hinzufügen
          </button>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>
