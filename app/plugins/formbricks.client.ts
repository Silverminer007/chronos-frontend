import formbricks from '@formbricks/js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  watch(
    () => authStore.user,
    (user) => {
      if (!user) return
      formbricks.setup({
        environmentId: config.public.formbricksEnvId,
        appUrl: config.public.formbricksApiHost,
      })
    },
    { immediate: true },
  )
})
