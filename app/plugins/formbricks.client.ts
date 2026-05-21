import formbricks from '@formbricks/js'

export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    await formbricks.setup({
        environmentId: config.public.formbricksEnvId,
        appUrl: config.public.formbricksApiHost,
    })

    watch(
        () => authStore.user,
        async (user) => {
            if (!user) return
            await formbricks.setUserId(String(user.id))
            await formbricks.setEmail(user.email ?? "")
        },
        {immediate: true},
    )
})
