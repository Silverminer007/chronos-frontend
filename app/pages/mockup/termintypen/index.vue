<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const toast = useToast()

const termintypen = [
  {
    id: 'gruppenstunde',
    name: 'Gruppenstunde',
    icon: 'lucide:users',
    color: 'blue',
    recurrenceLabel: 'Jeden Montag, 17:00 Uhr',
    exception: 'NRW-Schulferien',
    appointmentCount: 42,
    participantCount: 18,
  },
  {
    id: 'vorstandssitzung',
    name: 'Vorstandssitzung',
    icon: 'lucide:briefcase',
    color: 'purple',
    recurrenceLabel: 'Erster Dienstag im Monat, 19:30 Uhr',
    exception: null,
    appointmentCount: 12,
    participantCount: 7,
  },
  {
    id: 'teamsitzung',
    name: 'Teamsitzung',
    icon: 'lucide:message-square',
    color: 'green',
    recurrenceLabel: 'Dritter Donnerstag im Monat, 19:00 Uhr',
    exception: null,
    appointmentCount: 11,
    participantCount: 12,
  },
  {
    id: 'sommerlager',
    name: 'Sommerlager',
    icon: 'lucide:tent',
    color: 'orange',
    recurrenceLabel: 'Einmalig, Juli/August',
    exception: null,
    appointmentCount: 3,
    participantCount: 35,
  },
]

const colorMap = {
  blue: {
    stripe: 'bg-blue-500',
    circle: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  purple: {
    stripe: 'bg-purple-500',
    circle: 'bg-purple-100 dark:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  green: {
    stripe: 'bg-green-500',
    circle: 'bg-green-100 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  orange: {
    stripe: 'bg-orange-500',
    circle: 'bg-orange-100 dark:bg-orange-900/30',
    icon: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
}

const showGenerateDialog = ref(false)
const selectedType = ref<typeof termintypen[0] | null>(null)
const showCreateDialog = ref(false)

function openGenerateDialog(type: typeof termintypen[0]) {
  selectedType.value = type
  showGenerateDialog.value = true
}

function generateTermine() {
  showGenerateDialog.value = false
  toast.add({ severity: 'info', summary: 'Entwurf', detail: 'Funktion noch nicht verfügbar – dies ist ein Mockup.', life: 3000 })
}

function createNewType() {
  showCreateDialog.value = false
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
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Termintypen</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Vorlagen für wiederkehrende Termine mit Wiederholungsregeln</p>
          </div>
        </div>

        <!-- Amber info banner -->
        <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Icon name="lucide:flask-conical" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p class="text-sm text-amber-700 dark:text-amber-300">Entwurf – keine echten Daten, kein Backend.</p>
        </div>

        <!-- Termintyp cards -->
        <div class="space-y-4">
          <div
            v-for="typ in termintypen"
            :key="typ.id"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden flex"
          >
            <!-- Left color stripe -->
            <div class="w-1.5 shrink-0" :class="colorMap[typ.color].stripe" />

            <div class="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <!-- Icon + info -->
              <div class="flex items-center gap-4 flex-1">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" :class="colorMap[typ.color].circle">
                  <Icon :name="typ.icon" class="text-lg" :class="colorMap[typ.color].icon" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ typ.name }}</h3>
                    <span v-if="typ.exception" class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      Ausnahme: {{ typ.exception }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{{ typ.recurrenceLabel }}</p>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex items-center gap-3 shrink-0">
                <span class="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" :class="colorMap[typ.color].badge">
                  <Icon name="lucide:calendar" class="text-xs" />
                  {{ typ.appointmentCount }} Termine
                </span>
                <span class="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300">
                  <Icon name="lucide:users" class="text-xs" />
                  {{ typ.participantCount }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 shrink-0">
                <button
                  class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all"
                  @click="openGenerateDialog(typ)"
                >
                  Termine generieren
                </button>
                <NuxtLink
                  :to="`/mockup/termintypen/${typ.id}`"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-all"
                >
                  Detail
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- FAB -->
    <button
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 z-50"
      @click="showCreateDialog = true"
    >
      <Icon name="lucide:plus" class="text-xl" />
    </button>

    <!-- Generate Dialog -->
    <div v-if="showGenerateDialog" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div class="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-2xl">
        <div class="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Termine generieren</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ selectedType?.name }}</p>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Von</label>
              <input type="date" value="2026-05-01" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bis</label>
              <input type="date" value="2026-12-31" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
            </div>
          </div>
          <div class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p class="text-sm font-semibold text-green-800 dark:text-green-300">Vorschau: 8 neue Termine</p>
          </div>
          <div class="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Icon name="lucide:info" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 text-sm" />
            <p class="text-xs text-amber-700 dark:text-amber-300">Bestehende Termine werden nicht dupliziert.</p>
          </div>
        </div>
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button class="px-5 py-2.5 rounded-lg font-medium border-2 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="showGenerateDialog = false">
            Abbrechen
          </button>
          <button class="px-5 py-2.5 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="generateTermine">
            Generieren
          </button>
        </div>
      </div>
    </div>

    <!-- Create Dialog (no-op) -->
    <div v-if="showCreateDialog" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div class="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-2xl">
        <div class="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Neuen Termintyp erstellen</h2>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input type="text" placeholder="z.B. Elternabend" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ort</label>
            <input type="text" placeholder="z.B. Vereinsheim" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-sm" />
          </div>
        </div>
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button class="px-5 py-2.5 rounded-lg font-medium border-2 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all" @click="showCreateDialog = false">
            Abbrechen
          </button>
          <button class="px-5 py-2.5 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all" @click="createNewType">
            Erstellen
          </button>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>
