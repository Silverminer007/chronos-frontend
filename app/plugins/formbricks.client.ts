import formbricks from '@formbricks/js'

export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig()

    await formbricks.setup({
        environmentId: config.public.formbricksEnvId,
        appUrl: config.public.formbricksApiHost,
    })
})
