import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    posthog.init(config.public.posthogKey, {
        api_host: config.public.posthogHost,
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        disable_session_recording: true,
        persistence: 'memory',
        person_profiles: 'never',
    })
})