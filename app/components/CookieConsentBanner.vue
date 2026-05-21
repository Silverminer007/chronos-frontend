<script setup lang="ts">
const { hasDecided, accept, decline } = useCookieConsent()
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="!hasDecided"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div class="max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-gray-100 dark:border-neutral-700 p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <div class="w-10 h-10 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="lucide:cookie" class="text-purple-600 dark:text-purple-400 text-lg" />
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">Cookies & Analyse</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Wir verwenden PostHog zur Nutzungsanalyse, um Chronos zu verbessern. Es werden keine Daten ohne deine Zustimmung erhoben.
                <NuxtLink to="/datenschutz" class="text-purple-600 dark:text-purple-400 hover:underline">Datenschutzerklärung</NuxtLink>
              </p>
            </div>
          </div>

          <div class="flex gap-2 flex-shrink-0 sm:flex-col md:flex-row">
            <button
              class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
              @click="decline"
            >
              Ablehnen
            </button>
            <button
              class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-md bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-500 dark:to-pink-400"
              @click="accept"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>