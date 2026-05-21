import formbricks from '@formbricks/js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    if (typeof window !== "undefined") {
        formbricks.setup({
            environmentId: config.public.formbricksEnvId,
            appUrl: config.public.formbricksApiHost,
        })
    }

    watch(
        () => authStore.user,
        (user) => {
            if (!user) return
            formbricks.setUserId(String(user.id))
            formbricks.setEmail(user.email ?? "")
        },
        {immediate: true},
    )
})
