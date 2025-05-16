<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { Sun, Moon } from '@lucide/svelte';
  import { showToast } from './Toast.svelte';

  let currentTheme: 'light' | 'dark';

  // Suscribirse al store de tema
  theme.subscribe(value => {
    currentTheme = value;
  });

  /**
   * Cambia entre los temas 'light' y 'dark'.
   * Muestra un toast indicando el tema activado.
   */
  function toggleTheme() {
    theme.toggle();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    showToast(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, "success");
  }
</script>

<button 
  on:click={toggleTheme}
  class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
  aria-label="Toggle dark mode"
  title={currentTheme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
  type="button"
>
  {#if currentTheme === 'dark'}
    <Sun class="w-5 h-5 text-amber-500" />
  {:else}
    <Moon class="w-5 h-5 text-indigo-500" />
  {/if}
</button> 