<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <SearchHeader />

    <div class="container mx-auto px-4 sm:px-6 pb-24">
      <div class="max-w-4xl mx-auto space-y-6 pt-6">

        <!-- Amber info banner -->
        <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Icon name="lucide:flask-conical" class="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 text-lg" />
          <div>
            <p class="font-semibold text-amber-900 dark:text-amber-200">Entwurfs-Modus</p>
            <p class="text-sm text-amber-700 dark:text-amber-300">Diese Seiten sind Entwürfe – noch kein Backend, keine echten Daten. Sie dienen zur Diskussion neuer Funktionen.</p>
          </div>
        </div>

        <!-- Title -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Neue Funktionen – Entwürfe</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Klicke auf eine Funktion, um den interaktiven Entwurf zu erkunden.</p>
        </div>

        <!-- Feature cards -->
        <div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">

          <!-- Termintypen -->
          <NuxtLink to="/mockup/termintypen" class="block bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:calendar-cog" class="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Termintypen</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Wiederverwendbare Termin-Vorlagen mit Wiederholungsregeln. Generiere automatisch Termine nach Muster.</p>
            <div class="mt-4 flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <span>Entwurf erkunden</span>
              <Icon name="lucide:arrow-right" class="text-sm group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>

          <!-- Aufgaben & Dienste -->
          <NuxtLink to="/mockup/aufgaben" class="block bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:circle-check-big" class="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Aufgaben & Dienste</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Aufgaben mit Status-Lebenszyklus und Dienste als zeitlich begrenzte Rollen im Team.</p>
            <div class="mt-4 flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <span>Entwurf erkunden</span>
              <Icon name="lucide:arrow-right" class="text-sm group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>

          <!-- Team-Planner -->
          <NuxtLink to="/mockup/planner" class="block bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:layout-dashboard" class="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Team-Planner</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">KanBan-Board: Spalten sind Teamsitzungen, Karten sind Agenda-Punkte mit Notizen und Pflichtfeldern.</p>
            <div class="mt-4 flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm font-medium">
              <span>Entwurf erkunden</span>
              <Icon name="lucide:arrow-right" class="text-sm group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>

        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>
