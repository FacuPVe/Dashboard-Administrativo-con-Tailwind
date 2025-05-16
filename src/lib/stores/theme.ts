import { writable } from 'svelte/store';

function createThemeStore() {
    // Crear el store con un valor inicial
    const { subscribe, set, update } = writable<'light' | 'dark'>('light');

    /**
     * Aplica el tema especificado al documento.
     * @param theme - El tema a aplicar ('light' o 'dark').
     */
    function applyTheme(theme: 'light' | 'dark') {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        // Asegurar que las transiciones CSS se apliquen suavemente
        document.documentElement.style.colorScheme = theme;
    }

    /**
     * Inicializa el tema basado en el almacenamiento local o la preferencia del sistema.
     */
    function initialize() {
        // Verificar si hay un tema guardado en localStorage
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || savedTheme === 'light') {
            set(savedTheme);
            applyTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Si no hay tema guardado, usar la preferencia del sistema
            set('dark');
            applyTheme('dark');
        }

        // Escuchar cambios en el tema del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                set(newTheme);
                applyTheme(newTheme);
            }
        });
    }

    /**
     * Cambia el tema actual entre 'light' y 'dark'.
     */
    function toggle() {
        update(currentTheme => {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            return newTheme;
        });
    }

    /**
     * Establece un tema específico y lo guarda en el almacenamiento local.
     * @param newTheme - El nuevo tema a establecer ('light' o 'dark').
     */
    function setTheme(newTheme: 'light' | 'dark') {
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        set(newTheme);
    }

    /**
     * Usa el tema del sistema y lo aplica.
     */
    function useSystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme = prefersDark ? 'dark' : 'light';
        localStorage.removeItem('theme');
        applyTheme(newTheme);
        set(newTheme);
    }

    return {
        subscribe,
        toggle,
        setTheme,
        useSystemTheme,
        initialize
    };
}

export const theme = createThemeStore(); 