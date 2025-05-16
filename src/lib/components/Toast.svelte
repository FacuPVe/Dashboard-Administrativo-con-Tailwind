<script lang="ts" context="module">
  import { writable } from 'svelte/store';

  // Definir el store fuera del componente para que sea accesible globalmente
  export const toastStore = writable<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  }>({
    visible: false,
    message: '',
    type: 'info',
    duration: 3000
  });
  
  /**
   * Muestra un toast (alerta temporal) con el mensaje y tipo especificados.
   * @param message - El mensaje a mostrar en el toast.
   * @param type - El tipo de toast ('success', 'error', 'warning', 'info').
   * @param duration - La duración en milisegundos que el toast debe ser visible.
   */
  export function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    if (timeoutId) clearTimeout(timeoutId);
    
    toastStore.set({
      visible: true,
      message,
      type,
      duration
    });
    
    timeoutId = setTimeout(() => {
      toastStore.update(state => ({ ...state, visible: false }));
    }, duration);
  }
  
  // Variable global para el timeoutId
  let timeoutId: ReturnType<typeof setTimeout>;
</script>

<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { Check, X, AlertTriangle, Info } from '@lucide/svelte';
  
  /**
   * Cierra el toast manualmente.
   * Limpia el timeout si está activo y actualiza el estado del toast a no visible.
   */
  function closeToast() {
    if (timeoutId) clearTimeout(timeoutId);
    toastStore.update(state => ({ ...state, visible: false }));
  }
  
  // Suscribirse al store
  let toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  };
  
  toastStore.subscribe(value => {
    toast = value;
  });
  
  // Iconos según el tipo
  const icons = {
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info
  };
  
  // Colores según el tipo
  const colors = {
    success: 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-600 dark:text-green-200',
    error: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-600 dark:text-red-200',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-600 dark:text-yellow-200',
    info: 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/50 dark:border-blue-600 dark:text-blue-200'
  };
</script>

{#if toast.visible}
  <div
    class="fixed bottom-4 right-4 z-50 max-w-md"
    in:fly={{ y: 50, duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <div class={`flex items-center p-4 border-l-4 rounded-md shadow-lg ${colors[toast.type]}`}>
      <div class="mr-3">
        <svelte:component this={icons[toast.type]} class="w-5 h-5" />
      </div>
      <div class="mr-2 flex-1">
        {toast.message}
      </div>
      <button 
        on:click={closeToast}
        class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
{/if} 