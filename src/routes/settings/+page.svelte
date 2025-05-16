<script lang="ts">
  import {
    Save,
    User,
    Lock,
    Bell,
    Moon,
    Sun,
    Globe,
    Shield,
    CreditCard,
    Settings,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    Info,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";
  import { showToast } from "$lib/components/Toast.svelte";

  // Estados de configuración
  let activeTab = "profile";
  let emailNotifications = true;
  let pushNotifications = false;
  let marketingEmails = true;
  let saveInProgress = false;
  let showInfoPanel = false; // Estado para controlar la visibilidad del panel informativo

  // Datos del formulario de perfil
  let profileForm = {
    firstName: "Admin",
    lastName: "Usuario",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    role: "Administrador",
  };

  // Datos del formulario de contraseña
  let passwordForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Estado del modo oscuro
  let darkMode: boolean;

  // Suscribirse a cambios de tema
  theme.subscribe((value) => {
    darkMode = value === "dark";
  });

  // Inicializar el tema al montar
  onMount(() => {
    theme.initialize();
  });

  // Establecer pestaña activa
  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  // Guardar perfil
  function saveProfile() {
    saveInProgress = true;

    // Simular llamada API
    setTimeout(() => {
      saveInProgress = false;
      showToast("¡Perfil guardado correctamente!", "success");
    }, 800);
  }

  // Guardar contraseña
  function savePassword() {
    // En una aplicación real, validarías y guardarías la contraseña aquí
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("¡Las contraseñas no coinciden!", "error");
      return;
    }

    saveInProgress = true;

    // Simular llamada API
    setTimeout(() => {
      saveInProgress = false;
      showToast("¡Contraseña cambiada correctamente!", "success");
      passwordForm.currentPassword = "";
      passwordForm.newPassword = "";
      passwordForm.confirmPassword = "";
    }, 800);
  }

  // Aplicar tema con efecto visual
  function applyTheme(newTheme: 'light' | 'dark' | 'system') {
    if (newTheme === 'light') {
      theme.setTheme('light');
    } else if (newTheme === 'dark') {
      theme.setTheme('dark');
    } else {
      theme.useSystemTheme();
    }
    
    // Mostrar feedback y recargar para asegurar que todos los componentes se actualicen
    showToast(`Tema ${newTheme === 'system' ? 'del sistema' : newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, "success");
    
    // Pequeño retraso para permitir que se muestre el toast
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  // Guardar preferencias de notificación
  function saveNotificationPreferences() {
    saveInProgress = true;

    // Simular llamada API
    setTimeout(() => {
      saveInProgress = false;
      showToast("¡Preferencias de notificación guardadas!", "success");
    }, 800);
  }
</script>

<div class="max-w-7xl mx-auto">
  <!-- Cabecera del Panel con Breadcrumb -->
  <div class="mb-8">
    <div
      class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2"
    >
      <a href="/" class="hover:text-primary-500 transition-colors cursor-pointer">Panel</a>
      <ChevronRight class="w-4 h-4 mx-2" />
      <span class="text-gray-900 dark:text-gray-200 font-medium"
        >Configuración</span
      >
    </div>
    <div class="flex items-center gap-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Configuración de la Cuenta
      </h1>
      <button
        on:click={() => showInfoPanel = !showInfoPanel}
        class="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
        title="Mostrar información"
      >
        <Info class="w-5 h-5" />
      </button>
    </div>
    <p class="text-gray-600 dark:text-gray-400 mt-1">
      Gestiona tus preferencias e información de cuenta
    </p>
  </div>

  <!-- Panel informativo (visible solo cuando se hace clic en el botón de información) -->
  {#if showInfoPanel}
    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-in fade-in duration-300"
    >
      <div class="flex items-start">
        <Settings class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
            Guía de configuración
          </h3>
          <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              • El perfil permite actualizar tus datos personales y añadir un avatar personalizado.
            </li>
            <li>
              • En la sección de contraseña puedes cambiar tus credenciales de acceso.
            </li>
            <li>
              • Las notificaciones te permiten configurar qué alertas recibes y cómo.
            </li>
            <li>
              • En apariencia puedes personalizar el tema claro/oscuro o usar el tema del sistema.
            </li>
            <li>
              • La sección de seguridad te permite habilitar la autenticación de dos factores.
            </li>
          </ul>
        </div>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Navegación de Configuración -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500"
          >
            <Settings class="w-5 h-5" />
          </div>
          <div class="ml-3">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Configuración
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Configura tu cuenta
            </p>
          </div>
        </div>
      </div>
      <nav class="p-2">
        <ul class="space-y-1">
          <li>
            <button
              class={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${activeTab === "profile" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              on:click={() => setActiveTab("profile")}
            >
              <User class="w-5 h-5 mr-3" />
              <span>Información de Perfil</span>
            </button>
          </li>
          <li>
            <button
              class={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${activeTab === "password" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              on:click={() => setActiveTab("password")}
            >
              <Lock class="w-5 h-5 mr-3" />
              <span>Contraseña y Seguridad</span>
            </button>
          </li>
          <li>
            <button
              class={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${activeTab === "notifications" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              on:click={() => setActiveTab("notifications")}
            >
              <Bell class="w-5 h-5 mr-3" />
              <span>Notificaciones</span>
            </button>
          </li>
          <li>
            <button
              class={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${activeTab === "appearance" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              on:click={() => setActiveTab("appearance")}
            >
              <Moon class="w-5 h-5 mr-3" />
              <span>Apariencia</span>
            </button>
          </li>
          <li>
            <button
              class={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${activeTab === "security" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              on:click={() => setActiveTab("security")}
            >
              <Shield class="w-5 h-5 mr-3" />
              <span>Seguridad</span>
            </button>
          </li>
          <li>
            <button
              class={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${activeTab === "billing" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
              on:click={() => setActiveTab("billing")}
            >
              <CreditCard class="w-5 h-5 mr-3" />
              <span>Facturación y Suscripción</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Contenido de Configuración -->
    <div class="lg:col-span-3">
      {#if activeTab === "profile"}
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Información de Perfil
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Actualiza tu información personal y detalles de perfil
            </p>
          </div>

          <div class="p-6">
            <div class="mb-8">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  class="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-sm cursor-pointer"
                >
                  {profileForm.firstName.charAt(0)}{profileForm.lastName.charAt(
                    0,
                  )}
                </div>
                <div class="flex flex-col sm:flex-row gap-2">
                  <button
                    class="inline-flex items-center justify-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Subir Avatar
                  </button>
                  <button
                    class="inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Recomendado: JPG, PNG o GIF cuadrado, al menos 300x300 píxeles
                (máx. 5MB)
              </p>
            </div>

            <form on:submit|preventDefault={saveProfile}>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    bind:value={profileForm.firstName}
                    class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Introduce tu nombre"
                    autocomplete="given-name"
                  />
                </div>
                <div>
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    bind:value={profileForm.lastName}
                    class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Introduce tu apellido"
                    autocomplete="family-name"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    bind:value={profileForm.email}
                    class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="tu@ejemplo.com"
                    autocomplete="email"
                  />
                </div>
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Número de Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    bind:value={profileForm.phone}
                    class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                    autocomplete="tel"
                  />
                </div>
                <div>
                  <label
                    for="company"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Empresa <span class="text-gray-400 dark:text-gray-500"
                      >(Opcional)</span
                    >
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    bind:value={profileForm.company}
                    class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Nombre de tu empresa"
                    autocomplete="organization"
                  />
                </div>
                <div>
                  <label
                    for="role"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    bind:value={profileForm.role}
                    class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Desarrollador">Desarrollador</option>
                    <option value="Analista">Analista</option>
                    <option value="Soporte">Soporte</option>
                  </select>
                </div>
              </div>

              <div
                class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end"
              >
                <button
                  type="submit"
                  class="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 hover:bg-primary-700 focus:bg-primary-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-70 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 cursor-pointer"
                  disabled={saveInProgress}
                >
                  {#if saveInProgress}
                    <span
                      class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
                    ></span>
                    Guardando...
                  {:else}
                    <Save class="w-4 h-4 mr-2" />
                    Guardar Cambios
                  {/if}
                </button>
              </div>
            </form>
          </div>
        </div>
      {:else if activeTab === "password"}
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Contraseña y Seguridad
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Actualiza tu contraseña y mejora la seguridad de tu cuenta
            </p>
          </div>

          <div class="p-6">
            <form on:submit|preventDefault={savePassword}>
              <div class="max-w-md space-y-5">
                <div>
                  <div class="flex justify-between mb-1">
                    <label
                      for="currentPassword"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Contraseña Actual
                    </label>
                    <a
                      href="/forgot-password"
                      class="text-xs text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div class="relative">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      bind:value={passwordForm.currentPassword}
                      class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Introduce tu contraseña actual"
                      required
                      autocomplete="current-password"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="newPassword"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nueva Contraseña
                  </label>
                  <div class="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      bind:value={passwordForm.newPassword}
                      class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Introduce nueva contraseña"
                      required
                      minlength="8"
                      autocomplete="new-password"
                    />
                  </div>
                  <div class="mt-2">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      La contraseña debe contener:
                    </p>
                    <ul class="mt-1 ml-2 space-y-1">
                      <li
                        class="text-xs flex items-center text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle class="w-3 h-3 mr-1 text-green-500" />
                        Al menos 8 caracteres
                      </li>
                      <li
                        class="text-xs flex items-center text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle class="w-3 h-3 mr-1 text-green-500" />
                        Al menos una letra mayúscula
                      </li>
                      <li
                        class="text-xs flex items-center text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle class="w-3 h-3 mr-1 text-green-500" />
                        Al menos un número
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Confirmar Nueva Contraseña
                  </label>
                  <div class="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      bind:value={passwordForm.confirmPassword}
                      class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Confirma tu nueva contraseña"
                      required
                      autocomplete="new-password"
                    />
                  </div>
                  {#if passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword}
                    <p class="mt-1 text-xs text-red-500 flex items-center">
                      <AlertTriangle class="w-3 h-3 mr-1" />
                      Las contraseñas no coinciden
                    </p>
                  {/if}
                </div>
              </div>

              <div
                class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end"
              >
                <button
                  type="submit"
                  class="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 hover:bg-primary-700 focus:bg-primary-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-70 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 cursor-pointer"
                  disabled={saveInProgress ||
                    !!(passwordForm.newPassword !==
                      passwordForm.confirmPassword &&
                      passwordForm.newPassword &&
                      passwordForm.confirmPassword)}
                >
                  {#if saveInProgress}
                    <span
                      class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
                    ></span>
                    Actualizando...
                  {:else}
                    <Lock class="w-4 h-4 mr-2" />
                    Actualizar Contraseña
                  {/if}
                </button>
              </div>
            </form>
          </div>
        </div>
      {:else if activeTab === "notifications"}
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Preferencias de Notificación
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configura cómo recibes notificaciones y actualizaciones
            </p>
          </div>

          <div class="p-6">
            <form on:submit|preventDefault={saveNotificationPreferences}>
              <div class="space-y-8">
                <div>
                  <h3
                    class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                  >
                    Notificaciones por Correo
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4
                          class="font-medium text-gray-800 dark:text-gray-200"
                        >
                          Notificaciones del Sistema
                        </h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Recibe notificaciones por correo para actualizaciones
                          importantes del sistema y alertas de seguridad
                        </p>
                      </div>
                      <label
                        class="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="email-notifications"
                          name="email-notifications"
                          bind:checked={emailNotifications}
                          class="sr-only peer"
                          autocomplete="off"
                        />
                        <div
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 peer-checked:shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:peer-checked:shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:peer-checked:bg-emerald-500 transition-all duration-300"
                        ></div>
                      </label>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4
                          class="font-medium text-gray-800 dark:text-gray-200"
                        >
                          Notificaciones Push
                        </h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Recibe notificaciones push en tu dispositivo para
                          actualizaciones en tiempo real
                        </p>
                      </div>
                      <label
                        class="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="push-notifications"
                          name="push-notifications"
                          bind:checked={pushNotifications}
                          class="sr-only peer"
                          autocomplete="off"
                        />
                        <div
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 peer-checked:shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:peer-checked:shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:peer-checked:bg-emerald-500 transition-all duration-300"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                  >
                    Comunicaciones de Marketing
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4
                          class="font-medium text-gray-800 dark:text-gray-200"
                        >
                          Correos de Marketing
                        </h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Recibe actualizaciones sobre nuevas funciones,
                          productos y ofertas promocionales
                        </p>
                      </div>
                      <label
                        class="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id="marketing-emails"
                          name="marketing-emails"
                          bind:checked={marketingEmails}
                          class="sr-only peer"
                          autocomplete="off"
                        />
                        <div
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 peer-checked:shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:peer-checked:shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:peer-checked:bg-emerald-500 transition-all duration-300"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                  >
                    Frecuencia de Notificaciones
                  </h3>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input
                        id="daily"
                        type="radio"
                        name="notification-frequency"
                        value="daily"
                        checked
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                      />
                      <label
                        for="daily"
                        class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Resumen diario
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input
                        id="weekly"
                        type="radio"
                        name="notification-frequency"
                        value="weekly"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                      />
                      <label
                        for="weekly"
                        class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Resumen semanal
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input
                        id="realtime"
                        type="radio"
                        name="notification-frequency"
                        value="realtime"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                      />
                      <label
                        for="realtime"
                        class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Notificaciones en tiempo real
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end"
              >
                <button
                  type="submit"
                  class="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 hover:bg-primary-700 focus:bg-primary-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-70 cursor-pointer dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 "
                  disabled={saveInProgress}
                >
                  {#if saveInProgress}
                    <span
                      class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
                    ></span>
                    Guardando...
                  {:else}
                    <Save class="w-4 h-4 mr-2" />
                    Guardar Preferencias
                  {/if}
                </button>
              </div>
            </form>
          </div>
        </div>
      {:else if activeTab === "appearance"}
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Preferencias de Apariencia
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Personaliza la apariencia visual del panel de control
            </p>
          </div>

          <div class="p-6">
            <div class="space-y-8">
              <div>
                <h3
                  class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                >
                  Modo de Tema
                </h3>
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1">
                    <button
                      class={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer ${!darkMode ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/70"}`}
                      on:click={() => {
                        theme.setTheme("light");
                        showToast("Tema claro activado", "success");
                      }}
                      aria-label="Activar tema claro"
                    >
                      <div class="flex items-center justify-center">
                        <div
                          class="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
                        >
                          <Sun class="w-8 h-8 text-amber-500" />
                        </div>
                      </div>
                      <div class="mt-3 text-center">
                        <h4 class="font-medium text-gray-900 dark:text-white">
                          Modo Claro
                        </h4>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        >
                          Apariencia clara para entornos bien iluminados
                        </p>
                      </div>
                    </button>
                  </div>

                  <div class="flex-1">
                    <button
                      class={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer ${darkMode ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/70"}`}
                      on:click={() => {
                        theme.setTheme("dark");
                        showToast("Tema oscuro activado", "success");
                      }}
                      aria-label="Activar tema oscuro"
                    >
                      <div class="flex items-center justify-center">
                        <div
                          class="w-16 h-16 rounded-full bg-gray-800 shadow-lg flex items-center justify-center"
                        >
                          <Moon class="w-8 h-8 text-indigo-300" />
                        </div>
                      </div>
                      <div class="mt-3 text-center">
                        <h4 class="font-medium text-gray-900 dark:text-white">
                          Modo Oscuro
                        </h4>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        >
                          Apariencia oscura para trabajar en entornos con poca
                          luz
                        </p>
                      </div>
                    </button>
                  </div>

                  <div class="flex-1">
                    <button
                      class="w-full p-4 rounded-lg border-2 transition-all cursor-pointer border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/70"
                      on:click={() => {
                        theme.useSystemTheme();
                        showToast("Tema del sistema activado", "success");
                      }}
                      aria-label="Usar tema del sistema"
                    >
                      <div class="flex items-center justify-center">
                        <div
                          class="w-16 h-16 rounded-full bg-gradient-to-r from-white to-gray-800 flex items-center justify-center shadow-lg overflow-hidden"
                        >
                          <div class="flex w-full h-full">
                            <div
                              class="w-1/2 h-full bg-white flex items-center justify-center"
                            >
                              <Sun class="w-6 h-6 text-amber-500" />
                            </div>
                            <div
                              class="w-1/2 h-full bg-gray-800 flex items-center justify-center"
                            >
                              <Moon class="w-6 h-6 text-indigo-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-3 text-center">
                        <h4 class="font-medium text-gray-900 dark:text-white">
                          Sistema
                        </h4>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        >
                          Sincronizar con la configuración de tu sistema
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3
                  class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                >
                  Distribución del Panel
                </h3>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center">
                    <input
                      id="compact-layout"
                      name="layout"
                      type="radio"
                      checked
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                    />
                    <label
                      for="compact-layout"
                      class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Compacto
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="comfortable-layout"
                      name="layout"
                      type="radio"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                    />
                    <label
                      for="comfortable-layout"
                      class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Cómodo
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end"
            >
              <button
                class="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 hover:bg-primary-700 focus:bg-primary-700 text-white rounded-lg shadow-sm transition-colors dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 cursor-pointer"
              >
                <Save class="w-4 h-4 mr-2" />
                Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      {:else if activeTab === "security"}
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Configuración de Seguridad
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Mejora la seguridad de tu cuenta con medidas adicionales
            </p>
          </div>

          <div class="p-6">
            <div class="space-y-8">
              <div>
                <div class="flex items-start">
                  <div class="flex-1">
                    <h3
                      class="text-base font-medium text-gray-900 dark:text-white"
                    >
                      Autenticación de Dos Factores (2FA)
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Añade una capa extra de seguridad a tu cuenta requiriendo
                      tanto tu contraseña como un código de verificación.
                    </p>
                  </div>
                  <div class="ml-4">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    >
                      No Habilitado
                    </span>
                  </div>
                </div>
                <div class="mt-4">
                  <button
                    class="inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-primary-700 focus:bg-primary-700 text-white rounded-lg shadow-sm transition-colors text-sm dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 cursor-pointer"
                  >
                    Habilitar Autenticación de Dos Factores
                  </button>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3
                  class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                >
                  Actividad Reciente de la Cuenta
                </h3>
                <div
                  class="overflow-x-auto">
                  <div
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
                  >
                    <table
                      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Dispositivo</th
                          >
                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Ubicación</th
                          >
                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Hora</th
                          >
                          <th
                            scope="col"
                            class="relative px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Acción</th
                          >
                        </tr>
                      </thead>
                      <tbody
                        class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800"
                      >
                        <tr
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        >
                          <td
                            class="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            <div class="flex items-center">
                              <div
                                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                              Chrome en Windows
                            </div>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            Barcelona, España
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            <div class="flex items-center">
                              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"
                              ></span>
                              Activo ahora
                            </div>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-right"
                          >
                            <span
                              class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium"
                            >
                              Actual
                            </span>
                          </td>
                        </tr>
                        <tr
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        >
                          <td
                            class="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            <div class="flex items-center">
                              <div
                                class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17A3 3 0 015 5zm8.5 14V5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5zm-3-7a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-7zm-3 4a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-3z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                              Aplicación Móvil iOS
                            </div>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            Barcelona, España
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            Hace 2 horas
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-right"
                          >
                            <button
                              class="text-red-600 hover:text-red-800 dark:text-red-400 hover:underline text-xs cursor-pointer"
                              type="button"
                            >
                              Revocar
                            </button>
                          </td>
                        </tr>
                        <tr
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        >
                          <td
                            class="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            <div class="flex items-center">
                              <div
                                class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm8.5 14V5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5zm-3-7a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-7zm-3 4a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-3z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                              Firefox en macOS
                            </div>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            Madrid, España
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            Hace 1 día
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-right"
                          >
                            <button
                              class="text-red-600 hover:text-red-800 dark:text-red-400 hover:underline text-xs cursor-pointer"
                              type="button"
                            >
                              Revocar
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="mt-3 text-right">
                  <button
                    class="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm hover:underline cursor-pointer"
                    type="button"
                  >
                    Ver Registro Completo de Actividad
                  </button>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3
                  class="text-base font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Verificación de Inicio de Sesión
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Te pediremos un código de verificación si detectamos un inicio
                  de sesión desde un dispositivo o navegador no reconocido.
                </p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="login-verification"
                    name="login-verification"
                    class="sr-only peer"
                    autocomplete="off"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 peer-checked:shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:peer-checked:shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:peer-checked:bg-emerald-500 transition-all duration-300"
                  ></div>
                  <span
                    class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Habilitar Verificación de Inicio de Sesión</span
                  >
                </label>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-start justify-between">
                  <div>
                    <h3
                      class="text-base font-medium text-red-600 dark:text-red-400"
                    >
                      Zona de Peligro
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Elimina permanentemente tu cuenta y todos tus datos
                    </p>
                  </div>
                  <button
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors text-sm cursor-pointer"
                    type="button"
                  >
                    Eliminar Cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === "billing"}
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Facturación y Suscripción
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestiona tu plan de suscripción y métodos de pago
            </p>
          </div>

          <div class="p-6">
            <div class="space-y-8">
              <div>
                <h3
                  class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                >
                  Plan Actual
                </h3>
                <div
                  class="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-xl p-5 relative overflow-hidden"
                >
                  <div
                    class="absolute right-0 top-0 h-full w-24 bg-primary-500/10 transform rotate-12 translate-x-8"
                  ></div>

                  <div
                    class="flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <span
                        class="px-3 py-1 bg-primary-500 text-white text-xs rounded-full font-medium dark:bg-primary-700"
                        >Plan Empresarial</span
                      >
                      <h4 class="text-xl font-bold mt-2">
                        49,99€<span
                          class="text-sm font-normal text-gray-600 dark:text-gray-400"
                          >/mes</span
                        >
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Próxima fecha de facturación: 15 de mayo, 2023
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <button
                        class="inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-primary-700 focus:bg-primary-700 text-white rounded-lg shadow-sm transition-colors text-sm dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 cursor-pointer flex-1 sm:flex-none"
                        type="button"
                      >
                        Mejorar Plan
                      </button>
                      <button
                        class="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg shadow-sm transition-colors text-sm dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800 cursor-pointer flex-1 sm:flex-none"
                        type="button"
                      >
                        Cancelar Suscripción
                      </button>
                    </div>
                  </div>

                  <div class="mt-4 space-y-2">
                    <div class="flex items-center text-sm">
                      <CheckCircle class="w-4 h-4 text-primary-500 mr-2" />
                      <span>Proyectos ilimitados</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <CheckCircle class="w-4 h-4 text-primary-500 mr-2" />
                      <span>Análisis avanzados</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <CheckCircle class="w-4 h-4 text-primary-500 mr-2" />
                      <span>Soporte 24/7</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                  <h3
                    class="text-base font-medium text-gray-900 dark:text-white"
                  >
                    Métodos de Pago
                  </h3>
                  <button
                    class="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm cursor-pointer"
                  >
                    + Añadir Nuevo
                  </button>
                </div>

                <div class="space-y-4">
                  <div
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center">
                        <div
                          class="h-10 w-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md mr-4 flex items-center justify-center text-white font-bold"
                        >
                          VISA
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-white">
                            Visa terminada en 4242
                          </h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Expira 12/2025 • Predeterminada
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          class="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm cursor-pointer"
                        >
                          Editar
                        </button>
                        <span class="text-gray-300 dark:text-gray-600">|</span>
                        <button
                          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center">
                        <div
                          class="h-10 w-14 bg-gradient-to-r from-gray-600 to-gray-400 rounded-md mr-4 flex items-center justify-center text-white font-bold"
                        >
                          PAYPAL
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-white">
                            PayPal
                          </h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Conectado a admin@example.com
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm cursor-pointer"
                        >
                          Desconectar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                  <h3
                    class="text-base font-medium text-gray-900 dark:text-white"
                  >
                    Historial de Facturación
                  </h3>
                  <button
                    class="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm cursor-pointer"
                  >
                    Descargar Todo
                  </button>
                </div>

                <div
                  class="overflow-x-auto">
                  <div
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
                  >
                    <table
                      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Factura #</th
                          >
                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Fecha</th
                          >
                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Importe</th
                          >
                          <th
                            scope="col"
                            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Estado</th
                          >
                          <th
                            scope="col"
                            class="relative px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >Acciones</th
                          >
                        </tr>
                      </thead>
                      <tbody
                        class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800"
                      >
                        <tr
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                        >
                          <td
                            class="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            FAC-001-2023
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            15 Abr, 2023
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-900 dark:text-white font-medium"
                          >
                            49,99€
                          </td>
                          <td class="whitespace-nowrap px-3 py-3">
                            <span
                              class="px-2.5 py-0.5 text-xs rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              Pagada
                            </span>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-right"
                          >
                            <a
                              href="/invoices/apr-2023.pdf"
                              class="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm hover:underline cursor-pointer"
                            >
                              Descargar
                            </a>
                          </td>
                        </tr>
                        <tr
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                        >
                          <td
                            class="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            FAC-002-2023
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            15 Mar, 2023
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-900 dark:text-white font-medium"
                          >
                            49,99€
                          </td>
                          <td class="whitespace-nowrap px-3 py-3">
                            <span
                              class="px-2.5 py-0.5 text-xs rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              Pagada
                            </span>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-right"
                          >
                            <a
                              href="/invoices/mar-2023.pdf"
                              class="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm hover:underline cursor-pointer"
                            >
                              Descargar
                            </a>
                          </td>
                        </tr>
                        <tr
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                        >
                          <td
                            class="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            FAC-003-2023
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-400"
                          >
                            15 Feb, 2023
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-gray-900 dark:text-white font-medium"
                          >
                            49,99€
                          </td>
                          <td class="whitespace-nowrap px-3 py-3">
                            <span
                              class="px-2.5 py-0.5 text-xs rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              Pagada
                            </span>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-3 text-sm text-right"
                          >
                            <a
                              href="/invoices/feb-2023.pdf"
                              class="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm hover:underline cursor-pointer"
                            >
                              Descargar
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Mostrando 3 de 12 facturas. <a
                    href="/billing/history"
                    class="text-primary-600 hover:underline cursor-pointer"
                    >Ver todas las facturas</a
                  >
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3
                  class="text-base font-medium mb-4 text-gray-900 dark:text-white"
                >
                  Información de Facturación
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Dirección de Facturación
                    </h4>
                    <address
                      class="not-italic text-sm text-gray-600 dark:text-gray-400"
                    >
                      Acme Inc.<br />
                      123 Avenida de Negocios<br />
                      Suite 4B<br />
                      Madrid, 28001<br />
                      España
                    </address>
                    <button
                      class="mt-2 text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm hover:underline cursor-pointer"
                    >
                      Editar Dirección
                    </button>
                  </div>

                  <div>
                    <h4
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Información Fiscal
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      NIF: ES123456789<br />
                      Número de IVA: No proporcionado
                    </p>
                    <button
                      class="mt-2 text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm hover:underline cursor-pointer"
                    >
                      Actualizar Información Fiscal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
