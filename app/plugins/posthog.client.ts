import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    posthog.init(config.public.posthogKey, {
        api_host: config.public.posthogHost,
        capture_pageview: false,
        capture_pageleave: false,
    })

    watch(
        () => authStore.user,
        (user) => {
            if (!user) return
            posthog.identify(String(user.id), {
                email: user.email,
                name: `${user.first_name} ${user.last_name}`.trim(),
            })
        },
        { immediate: true },
    )
})