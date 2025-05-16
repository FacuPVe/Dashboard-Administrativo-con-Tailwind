<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import {
    Home,
    Users,
    BarChart2,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown,
    Layers,
    ShoppingCart,
    Calendar,
    User,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import { navigating } from "$app/stores";
  import { fly, fade } from "svelte/transition";

  // Gestión de estado
  let sidebarOpen = false;
  let windowWidth: number;
  let isMobile = false;
  let dropdownOpen = false;
  let showOverlay = false;

  // Inicializar tema al cargar la página
  onMount(() => {
    theme.initialize();

    // Comprobar si el modo oscuro fue establecido previamente en localStorage
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Establecer la clase dark en el elemento html según la preferencia del usuario
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Configurar listener para cambios en el tema del sistema
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!("theme" in localStorage)) {
          if (e.matches) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      });

    // Inicializar comprobación de dispositivo móvil
    checkMobile();
  });

  // Elementos de navegación
  const navItems = [
    { path: "/", label: "Panel", icon: Home },
    { path: "/analytics", label: "Análisis", icon: BarChart2 },
    { path: "/customers", label: "Clientes", icon: Users },
    { path: "/orders", label: "Pedidos", icon: ShoppingCart },
    { path: "/calendar", label: "Calendario", icon: Calendar },
    { path: "/settings", label: "Configuración", icon: Settings },
  ];

  // Función para obtener el título de la página actual
  function getPageTitle() {
    const baseTitle = "AdminDashboard";
    const currentPath = $page.url.pathname;
    
    // Buscar el ítem de navegación correspondiente a la ruta actual
    const currentNavItem = navItems.find(item => 
      currentPath === item.path || currentPath.startsWith(item.path + '/')
    );
    
    // Si encontramos una coincidencia, usar su etiqueta; de lo contrario, solo mostrar el título base
    return currentNavItem 
      ? `${baseTitle} - ${currentNavItem.label}` 
      : baseTitle;
  }

  // Función para comprobar si estamos en móvil
  function checkMobile() {
    windowWidth = window.innerWidth;
    isMobile = windowWidth < 768;
    if (isMobile) {
      sidebarOpen = false;
    } else {
      sidebarOpen = true;
    }
  }

  // Alternar sidebar
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    showOverlay = sidebarOpen && isMobile;
  }

  // Cerrar sidebar al hacer clic en overlay
  function closeOverlay() {
    sidebarOpen = false;
    showOverlay = false;
  }

  // Alternar dropdown
  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  // Comprobar si una ruta está activa
  function isActive(path: string) {
    return $page.url.pathname === path;
  }

  // Cerrar dropdown al hacer clic fuera
  let profileDropdown: HTMLDivElement;
  function handleClickOutside(event: MouseEvent) {
    if (
      profileDropdown &&
      !profileDropdown.contains(event.target as Node) &&
      dropdownOpen
    ) {
      dropdownOpen = false;
    }
  }

  // Observar cambios de navegación
  $: if ($navigating) {
    if (isMobile) {
      sidebarOpen = false;
      showOverlay = false;
    }
    dropdownOpen = false;
  }
</script>

<svelte:head>
  <title>{getPageTitle()}</title>
</svelte:head>

<svelte:window
  bind:innerWidth={windowWidth}
  on:resize={checkMobile}
  on:click={handleClickOutside}
/>

<div
  class="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300"
>
  <!-- Overlay móvil -->
  {#if showOverlay}
    <div
      class="fixed inset-0 backdrop-blur-xs z-40 md:hidden cursor-pointer"
      on:click={closeOverlay}
      on:keydown={(e) => e.key === "Escape" && closeOverlay()}
      role="button"
      tabindex="0"
      transition:fade={{ duration: 200 }}
    ></div>
  {/if}

  <!-- Barra lateral -->
  <aside
    class={`fixed inset-y-0 z-50 flex flex-col w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
  >
    <!-- Cabecera de la barra lateral -->
    <div
      class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center">
        <Layers class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <span class="ml-2 text-lg font-semibold">AdminDashboard</span>
      </div>
      <button
        class="p-1 rounded-md md:hidden hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        on:click={toggleSidebar}
        aria-label="Cerrar menú lateral"
        title="Cerrar menú lateral"
        type="button"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Contenido de la barra lateral -->
    <nav class="flex-1 px-2 py-4 overflow-y-auto">
      <ul class="space-y-1">
        {#each navItems as item}
          <li>
            <a
              href={item.path}
              class={`flex items-center w-full px-4 py-2 text-left rounded-md transition-all duration-200 cursor-pointer ${isActive(item.path) ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"}`}
            >
              <svelte:component this={item.icon} class="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- Pie de la barra lateral con selector de tema -->
    <div
      class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <span class="text-sm text-gray-500 dark:text-gray-400"
        >© 2025 AdminDashboard</span
      >
      <ThemeToggle />
    </div>
  </aside>

  <!-- Contenido principal -->
  <div class="flex flex-col flex-1 overflow-hidden">
    <!-- Barra de navegación superior -->
    <header
      class="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <div class="flex items-center">
        <button
          class="p-1 mr-4 rounded-md md:hidden hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          on:click={toggleSidebar}
          aria-label="Abrir menú lateral"
          title="Abrir menú lateral"
          type="button"
        >
          <Menu class="w-6 h-6" />
        </button>
        <div class="relative md:w-64">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Buscar..."
            class="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 cursor-pointer"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button
          class="cursor-pointer relative p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
          aria-label="Ver notificaciones"
          title="Ver notificaciones"
          type="button"
        >
          <Bell class="w-6 h-6" />
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button>

        <!-- Selector de tema en la barra de navegación para móvil -->
        <div class="md:hidden">
          <ThemeToggle />
        </div>

        <div class="relative" bind:this={profileDropdown}>
          <button
            class="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-md transition-colors duration-200 cursor-pointer"
            on:click={toggleDropdown}
            type="button"
          >
            <div
              class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"
            >
              <User class="w-5 h-5" />
            </div>
            <span class="hidden md:block">Admin</span>
            <ChevronDown class="w-4 h-4" />
          </button>
          {#if dropdownOpen}
            <div
              class="absolute right-0 z-10 w-48 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
              transition:fly={{ y: 5, duration: 200 }}
            >
              <ul class="py-1">
                <li>
                  <a
                    href="/settings"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >Perfil</a
                  >
                </li>
                <li>
                  <a
                    href="/settings"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >Configuración</a
                  >
                </li>
                <li>
                  <a
                    href="#logout"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >Cerrar sesión</a
                  >
                </li>
              </ul>
            </div>
          {/if}
        </div>
      </div>
    </header>

    <!-- Contenido de la página con transiciones -->
    <main class="flex-1 overflow-y-auto p-6 md:p-9">
      {#if $navigating}
        <div class="flex items-center justify-center h-full">
          <div
            class="w-8 h-8 border-t-2 border-b-2 border-primary-500 rounded-full animate-spin"
          ></div>
        </div>
      {:else}
        <div class="w-full">
          <PageTransition url={$page.url.pathname}>
            <slot />
          </PageTransition>
        </div>
      {/if}
    </main>
  </div>
</div>

<Toast />
