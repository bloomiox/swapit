import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#119C21',
                    dark: '#416B40',
                    light: '#D8F7D7',
                },
                general: {
                    primary: '#021229',
                    secondary: '#6E6D7A',
                    white: '#FFFFFF',
                    bg: '#F7F5EC',
                    stroke: '#E7E8EC',
                },
                dark: {
                    primary: '#FFFFFF',
                    secondary: '#B0B0B0',
                    bg: '#0F172A',
                    'bg-secondary': '#1E293B',
                    'bg-tertiary': '#334155',
                    stroke: '#475569',
                    card: '#1E293B',
                },
                info: {
                    light: '#E9F1FD',
                },
                gray: {
                    200: '#EAECF0',
                }
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
            },
            fontSize: {
                'h1': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.27', fontWeight: '500' }],
                'h2': ['clamp(2rem, 4vw, 3.25rem)', { lineHeight: '1.38', fontWeight: '600' }],
                'h3': ['clamp(1.75rem, 3.5vw, 2.25rem)', { lineHeight: '1.33', fontWeight: '700' }],
                'h4': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.25', fontWeight: '700' }],
                'h5': ['24px', { lineHeight: '1.33', fontWeight: '700' }],
                'h6': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
                'body-large': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.2', fontWeight: '400' }],
                'body-normal': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
                'body-normal-bold': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
                'body-small': ['14px', { lineHeight: '1.43', fontWeight: '400' }],
                'body-small-bold': ['14px', { lineHeight: '1.43', fontWeight: '600' }],
                'body-small-regular': ['14px', { lineHeight: '1.43', fontWeight: '400' }],
                'caption': ['12px', { lineHeight: '1.33', fontWeight: '400' }],
                'caption-regular': ['12px', { lineHeight: '1.33', fontWeight: '400' }],
                'caption-medium': ['12px', { lineHeight: '1.33', fontWeight: '500' }],
            },
            spacing: {
                'section-mobile': '2rem',
                'section-tablet': '3rem',
                'section-desktop': '5rem',
                'container-mobile': '1rem',
                'container-tablet': '2rem',
                'container-desktop': '10.3125rem',
            },
            boxShadow: {
                'cards': '0px 16px 40px 0px rgba(0, 0, 0, 0.12)',
            },
            backgroundImage: {
                'boost-banner': 'linear-gradient(to bottom, #E8FFB7, #E8FFB7)',
            }
        },
    },
    plugins: [],
}
export default config