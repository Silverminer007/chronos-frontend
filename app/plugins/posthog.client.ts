import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const { consent } = useCookieConsent()

    posthog.init(config.public.posthogKey, {
        api_host: config.public.posthogHost,
        capture_pageview: false,
        capture_pageleave: false,
        opt_out_capturing_by_default: true,
    })

    // Apply stored consent on init
    if (consent.value === 'accepted') {
        posthog.opt_in_capturing()
    }

    // React to consent changes (e.g. user clicks accept/decline in the banner)
    watch(consent, (val) => {
        if (val === 'accepted') {
            posthog.opt_in_capturing()
        } else {
            posthog.opt_out_capturing()
        }
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