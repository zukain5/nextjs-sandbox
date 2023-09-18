/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    purge: {
        content: [
            './pages/**/*.{js,jsx,ts,tsx}',
        ],
        options: {
            safelist: {
                standard: [/^bg-/, /^text-/],
            },
        },
    },
    content: [],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
}

