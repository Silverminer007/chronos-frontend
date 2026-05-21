const STORAGE_KEY = 'cookieConsent'

export function useCookieConsent() {
    const consent = useState<'accepted' | 'declined' | null>('cookieConsent', () => null)

    // useState initializer only runs on the server; hydrate from localStorage on the client
    if (import.meta.client && consent.value === null) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'accepted' || stored === 'declined') {
            consent.value = stored
        }
    }

    const hasDecided = computed(() => consent.value !== null)

    function accept() {
        consent.value = 'accepted'
        localStorage.setItem(STORAGE_KEY, 'accepted')
    }

    function decline() {
        consent.value = 'declined'
        localStorage.setItem(STORAGE_KEY, 'declined')
    }

    return { consent, hasDecided, accept, decline }
}