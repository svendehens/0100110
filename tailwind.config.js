const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    mode: 'jit',
    purge: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
                serif: ['Bradford', 'Georgia', 'Times New Roman', 'Times', 'serif']
            },
            textColor: {
                default: 'var(--color-text-default)',
                active: 'var(--color-text-active)',
                inactive: 'var(--color-text-inactive)',
                primary: 'var(--color-text-primary)',
                secondary: 'var(--color-text-secondary)',
                navhover: 'var(--color-text-navhover)'
            },
            backgroundColor: {
                main: 'var(--color-bg-main)',
                nav: 'var(--color-bg-nav)',
                navhover: 'var(--color-bg-navhover)',
                box: 'var(--color-bg-box)',
                primary: 'var(--color-bg-primary)',
                secondary: 'var(--color-bg-secondary)',
                inverse: 'var(--color-bg-inverse)',
                'front-main': 'var(--color-bg-front-main)'
            },
            borderColor: {
                active: 'var(--border-active)'
            },
        }, screens: {
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '769px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
    },

    variants: {
        extend: {
            opacity: ['disabled'],
            borderWidth: ['first']
        },
    },

    plugins: [require('@tailwindcss/typography')],
};
