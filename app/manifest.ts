import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
    const basePath = process.env.NODE_ENV === 'production' ? '/BitHabit' : ''

    return {
        name: 'BitHabit',
        short_name: 'BitHabit',
        description: 'Mobile-first habit tracker app',
        start_url: `${basePath}/`,
        scope: `${basePath}/`,
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        icons: [
            {
                src: `${basePath}/icon-192.png`,
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: `${basePath}/icon-512.png`,
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        screenshots: [
            {
                src: `${basePath}/screenshot-mobile.png`,
                sizes: '375x812',
                type: 'image/png',
                form_factor: 'narrow',
                label: 'Habit Tracker Mobile View',
            },
            {
                src: `${basePath}/screenshot-desktop.png`,
                sizes: '1280x800',
                type: 'image/png',
                form_factor: 'wide',
                label: 'Habit Tracker Desktop View',
            },
        ],
    }
}
