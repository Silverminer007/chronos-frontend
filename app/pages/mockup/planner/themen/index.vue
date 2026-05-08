<script setup lang="ts">
definePageMeta({ layout: 'default' })

type TopicStatus = 'offen' | 'beschlossen' | 'vertagt' | 'archiviert'

interface Discussion {
  sitzungLabel: string
  date: string
  notes: string
  requiredFields?: { label: string; value: string }[]
}

interface Topic {
  id: number
  title: string
  status: TopicStatus
  category: string
  discussions: Discussion[]
}

const topics: Topic[] = [
  {
    id: 1,
    title: 'Neue Mitgliedsbeiträge',
    status: 'beschlossen',
    category: 'Finanzen',
    discussions: [
      {
        sitzungLabel: 'März-Sitzung',
        date: '20.03.2026',
        notes: 'Erste Diskussion angestoßen. Aktuelle Beiträge seit 2019 unverändert. Mehrheit befürwortet eine moderate Erhöhung. Entscheidung auf nächste Sitzung vertagt, damit alle Mitglieder informiert werden können.',
        requiredFields: [],
      },
      {
        sitzungLabel: 'April-Sitzung',
        date: '17.04.2026',
        notes: 'Abstimmung durchgeführt. 9 von 12 Anwesenden für Erhöhung. Neuer Beitrag gilt ab Januar 2027.',
        requiredFields: [
          { label: 'Beschluss', value: 'Erhöhung auf 8 € / Monat ab Januar 2027' },
          { label: 'Neuer Betrag', value: '8,00 €' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Vereinsheim Renovierung',
    status: 'offen',
    category: 'Infrastruktur',
    discussions: [
      {
        sitzungLabel: 'Januar-Sitzung',
        date: '15.01.2026',
        notes: 'Feuchtigkeitsschäden im Keller festgestellt. Anna M. beauftragt einen Handwerker zur Begutachtung.',
        requiredFields: [],
      },
      {
        sitzungLabel: 'Februar-Sitzung',
        date: '19.02.2026',
        notes: 'Gutachten liegt vor. Kosten ca. 4.200 € für Abdichtung + Malerarbeiten. Finanzierung noch unklar. Felix W. prüft Fördermöglichkeiten über Sportbund.',
        requiredFields: [],
      },
      {
        sitzungLabel: 'März-Sitzung',
        date: '20.03.2026',
        notes: 'Kein Förderbescheid bisher. Entscheidung vertagt bis Mai. Maßnahme mit Wassereimer vorerst überbrückt.',
        requiredFields: [],
      },
    ],
  },
  {
    id: 3,
    title: 'Social Media Auftritt',
    status: 'beschlossen',
    category: 'Öffentlichkeitsarbeit',
    discussions: [
      {
        sitzungLabel: 'Februar-Sitzung',
        date: '19.02.2026',
        notes: 'Vorschlag: Instagram-Kanal für Vereinsaktivitäten. Diskussion über Datenschutz (Fotos von Minderjährigen). Clara S. übernimmt Recherche zu rechtlichen Rahmenbedingungen.',
        requiredFields: [],
      },
      {
        sitzungLabel: 'März-Sitzung',
        date: '20.03.2026',
        notes: 'Rechtliche Klärung abgeschlossen. Einwilligung der Erziehungsberechtigten notwendig. Beschlossen: Instagram starten, Clara S. als Redakteurin, Posting-Richtlinien werden erstellt.',
        requiredFields: [
          { label: 'Beschluss', value: 'Instagram-Kanal wird eingerichtet' },
          { label: 'Verantwortliche Person', value: 'Clara S.' },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Kooperation mit TSV Waldberg',
    status: 'vertagt',
    category: 'Kooperationen',
    discussions: [
      {
        sitzungLabel: 'April-Sitzung',
        date: '17.04.2026',
        notes: 'Anfrage von TSV Waldberg für gemeinsame Veranstaltungen (Jugendturniere). Grundsätzliches Interesse. Georg T. nimmt Kontakt auf und klärt Details. Weiteres in der Mai-Sitzung.',
        requiredFields: [],
      },
    ],
  },
  {
    id: 5,
    title: 'Ehrenmitgliedschaft Hans Müller',
    status: 'beschlossen',
    category: 'Mitglieder',
    discussions: [
      {
        sitzungLabel: 'März-Sitzung',
        date: '20.03.2026',
        notes: 'Hans Müller ist seit 35 Jahren aktiv im Verein. Vorstand schlägt Ehrenmitgliedschaft vor. Abstimmung: einstimmig angenommen. Übergabe bei der Jahreshauptversammlung im September.',
        requiredFields: [
          { label: 'Beschluss', value: 'Ehrenmitgliedschaft einstimmig beschlossen' },
          { label: 'Übergabezeitpunkt', value: 'Jahreshauptversammlung September 2026' },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Hallenzeiten Winterhalbjahr 2026/27',
    status: 'offen',
    category: 'Infrastruktur',
    discussions: [
      {
        sitzungLabel: 'April-Sitzung',
        date: '17.04.2026',
        notes: 'Anmeldefrist für Hallenzeiten bei der Gemeinde ist der 31. Mai. Ben K. kümmert sich um die Beantragung. Bedarf: Montags + Donnerstags 17–20 Uhr.',
        requiredFields: [],
      },
    ],
  },
]

type FilterStatus = 'alle' | TopicStatus
const activeFilter = ref<FilterStatus>('alle')

const filters: { key: FilterStatus; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'offen', label: 'Offen' },
  { key: 'beschlossen', label: 'Beschlossen' },
  { key: 'vertagt', label: 'Vertagt' },
  { key: 'archiviert', label: 'Archiviert' },
]

const filteredTopics = computed(() =>
  activeFilter.value === 'alle' ? topics : topics.filter(t => t.status === activeFilter.value)
)

const statusConfig: Record<TopicStatus, { label: string; class: string; dot: string }> = {
  offen: {
    label: 'Offen',
    class: 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300',
    dot: 'bg-gray-400',
  },
  beschlossen: {
    label: 'Beschlossen',
    class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    dot: 'bg-green-500',
  },
  vertagt: {
    label: 'Vertagt',
    class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-400',
  },
  archiviert: {
    label: 'Archiviert',
    class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dot: 'bg-blue-400',
  },
}

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  filteredTopics.value.forEach(t => {
    counts[t.category] = (counts[t.category] ?? 0) + 1
  })
  return counts
})
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

        <!-- Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Themen-Übersicht</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Alle diskutierten Themen mit Notizen aus den Sitzungen</p>
        </div>

        <!-- Amber info banner -->
        <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Icon name="lucide:flask-conical" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p class="text-sm text-amber-700 dark:text-amber-300">Entwurf – keine echten Daten, kein Backend.</p>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="(count, cat) in categoryCounts"
            :key="cat"
            class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 px-4 py-3"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ cat }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{{ count }}</p>
          </div>
        </div>

        <!-- Status filter tabs -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f.key"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="activeFilter === f.key
              ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-sm'
              : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-700 hover:border-purple-300'"
            @click="activeFilter = f.key"
          >
            {{ f.label }}
            <span v-if="f.key !== 'alle'" class="ml-1 text-xs opacity-70">
              ({{ topics.filter(t => t.status === f.key).length }})
            </span>
          </button>
        </div>

        <!-- Topic cards -->
        <div class="space-y-4">
          <div
            v-for="topic in filteredTopics"
            :key="topic.id"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden"
          >
            <!-- Topic header -->
            <div class="px-5 pt-5 pb-4 flex items-start justify-between gap-3 border-b border-gray-100 dark:border-neutral-700">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="lucide:message-circle" class="text-green-600 dark:text-green-400 text-sm" />
                </div>
                <div>
                  <h2 class="font-semibold text-gray-900 dark:text-white leading-snug">{{ topic.title }}</h2>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ topic.category }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5" :class="statusConfig[topic.status].class">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[topic.status].dot" />
                  {{ statusConfig[topic.status].label }}
                </span>
              </div>
            </div>

            <!-- Discussion timeline -->
            <div class="p-5 space-y-0">
              <div
                v-for="(discussion, i) in topic.discussions"
                :key="i"
                class="relative flex gap-4"
                :class="i < topic.discussions.length - 1 ? 'pb-5' : ''"
              >
                <!-- Timeline line -->
                <div class="flex flex-col items-center shrink-0">
                  <div class="w-2.5 h-2.5 rounded-full bg-purple-400 dark:bg-purple-500 mt-1 shrink-0 z-10" />
                  <div
                    v-if="i < topic.discussions.length - 1"
                    class="w-px flex-1 bg-gray-200 dark:bg-neutral-700 mt-1"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0 pb-0.5">
                  <!-- Meeting label + date -->
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ discussion.sitzungLabel }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ discussion.date }}</span>
                  </div>

                  <!-- Notes -->
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ discussion.notes }}</p>

                  <!-- Required field values (if any filled) -->
                  <div
                    v-if="discussion.requiredFields && discussion.requiredFields.length > 0"
                    class="mt-3 space-y-1.5"
                  >
                    <div
                      v-for="field in discussion.requiredFields"
                      :key="field.label"
                      class="flex items-baseline gap-2 text-sm"
                    >
                      <span class="font-medium text-gray-600 dark:text-gray-400 shrink-0">{{ field.label }}:</span>
                      <span class="text-gray-900 dark:text-white">{{ field.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Empty state -->
          <div v-if="filteredTopics.length === 0" class="text-center py-12">
            <Icon name="lucide:message-circle" class="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">Keine Themen in dieser Kategorie</p>
          </div>
        </div>

      </div>
    </div>

    <Toast />
  </div>
</template>
