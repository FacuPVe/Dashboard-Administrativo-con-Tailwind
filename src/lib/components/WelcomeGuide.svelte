<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { X } from '@lucide/svelte';
  
  export let show = false;
  
  // Comprueba si es la primera visita
  onMount(() => {
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisited) {
      show = true;
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  });
  
  /**
   * Cierra la guía de bienvenida.
   * Establece la variable show a false para ocultar el diálogo.
   */
  function closeGuide() {
    show = false;
  }
  
  // Pasos de la guía
  const steps = [
    {
      title: "Panel de control interactivo",
      description: "Visualiza métricas clave y gráficos interactivos para tomar decisiones informadas.",
      image: "/images/dashboard.svg"
    },
    {
      title: "Gestión de clientes",
      description: "Administra tu base de clientes con una interfaz intuitiva y potentes herramientas de filtrado.",
      image: "/images/customers.svg"
    },
    {
      title: "Seguimiento de pedidos",
      description: "Controla todos tus pedidos en tiempo real y gestiona el estado de cada uno.",
      image: "/images/orders.svg"
    },
    {
      title: "Personalización completa",
      description: "Adapta la interfaz a tus preferencias con el modo oscuro y otras opciones de personalización.",
      image: "/images/settings.svg"
    }
  ];
  
  let currentStep = 0;
  
  /**
   * Avanza al siguiente paso de la guía.
   * Si se está en el último paso, cierra la guía.
   */
  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      closeGuide();
    }
  }
  
  /**
   * Retrocede al paso anterior de la guía.
   * Solo funciona si no se está en el primer paso.
   */
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }
</script>

{#if show}
  <dialog 
    class="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 m-0 max-w-none max-h-none"
    on:click={closeGuide}
    on:keydown={(e) => e.key === 'Escape' && closeGuide()}
    aria-modal="true"
    transition:fade={{ duration: 200 }}
    open
  >
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4"
      transition:fly={{ y: 20, duration: 300 }}
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      tabindex="-1"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Bienvenido a AdminDash</h2>
        <button 
          on:click={closeGuide}
          class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label="Cerrar guía"
          type="button"
          title="Cerrar guía"
          name="close-guide"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="relative overflow-hidden" style="height: 320px;">
        {#each steps as step, i}
          {#if i === currentStep}
            <div 
              class="absolute inset-0 flex flex-col md:flex-row items-center gap-6 p-4 transition-all duration-500"
              in:fly={{ x: 200, duration: 400, delay: 100 }}
              out:fly={{ x: -200, duration: 400 }}
            >
              <div class="w-full md:w-1/2 h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                <!-- Placeholder para imágenes -->
                <div class="text-5xl text-gray-400 dark:text-gray-500">
                  {i + 1}
                </div>
              </div>
              <div class="w-full md:w-1/2">
                <h3 class="text-lg font-medium mb-2">{step.title}</h3>
                <p class="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>
          {/if}
        {/each}
      </div>
      
      <!-- Indicadores y controles -->
      <div class="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <div class="flex space-x-1 mb-4 sm:mb-0">
          {#each steps as _, i}
            <button 
              class={`w-2 h-2 rounded-full transition-colors cursor-pointer ${i === currentStep ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              on:click={() => currentStep = i}
              aria-label={`Ir al paso ${i + 1}`}
              type="button"
              name="step-indicator"
            ></button>
          {/each}
        </div>
        <div class="flex space-x-2">
          {#if currentStep > 0}
            <button 
              on:click={prevStep}
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              type="button"
            >
              Anterior
            </button>
          {/if}
          <button 
            on:click={nextStep}
            class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer"
            type="button"
            name="next-step"
          >
            {currentStep === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  </dialog>
{/if} 