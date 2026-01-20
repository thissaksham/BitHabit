import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
    const basePath = process.env.NODE_ENV === 'production' ? '/BitHabit' : ''

    return {
        name: 'BitHabit',
        short_name: 'BitHabit',
        description: 'Your mobile-first habit tracker app',
        start_url: `${basePath}/`,
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        orientation: 'portrait',
        scope: `${basePath}/`,
        icons: [
            {
                src: `${basePath}/icon-192.png`,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: `${basePath}/icon-192.png`,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: `${basePath}/icon-512.png`,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: `${basePath}/icon-512.png`,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
