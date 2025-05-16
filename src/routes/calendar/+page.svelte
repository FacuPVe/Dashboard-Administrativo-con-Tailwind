<script lang="ts">
  import { onMount } from "svelte";
  import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    Users,
    X,
    Info,
  } from "@lucide/svelte";

  // Estado del calendario
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let selectedDate = new Date();
  let calendarDays: Array<{ date: Date; events: EventData[] }> = [];
  let currentView: "month" | "week" | "day" = "month";
  let isLoading = true;
  let showEventModal = false;
  let newEvent: Partial<EventData> = {};
  // Estado para el panel informativo
  let showInfoPanel = false;

  // Rastrea el ancho de la ventana para diseño responsivo - inicializa con valores predeterminados
  let windowWidth = 1024;
  let isSmallMobile = false;
  let isMobile = false;
  let isTablet = false;

  // Número de eventos a mostrar dependiendo del tamaño de pantalla
  let visibleEventsCount = 3;

  /**
   * Actualiza los valores del tamaño de la ventana y ajusta el número de eventos visibles según el tamaño de pantalla.
   */
  function handleResize() {
    windowWidth = window.innerWidth;
    isSmallMobile = windowWidth < 400;
    isMobile = windowWidth < 640;
    isTablet = windowWidth >= 640 && windowWidth < 1024;
    
    // Ajustar número de eventos visibles según el tamaño de pantalla
    visibleEventsCount = isMobile ? 1 : (isTablet ? 2 : (windowWidth >= 1280 ? 4 : 3));
  }

  type EventType = "meeting" | "event" | "call" | "deadline";

  interface EventData {
    id: number;
    title: string;
    date: Date;
    endTime?: Date;
    type: EventType;
    location: string;
    attendees: string[];
    description?: string;
  }

  // Datos de eventos de ejemplo
  const events: EventData[] = [
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(currentYear, currentMonth, 15, 10, 0),
      endTime: new Date(currentYear, currentMonth, 15, 11, 30),
      type: "meeting",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith", "Robert Johnson"],
      description:
        "Weekly team meeting to discuss project progress and upcoming tasks.",
    },
    {
      id: 2,
      title: "Product Launch",
      date: new Date(currentYear, currentMonth, 20, 14, 0),
      endTime: new Date(currentYear, currentMonth, 20, 16, 0),
      type: "event",
      location: "Main Hall",
      attendees: ["All Staff"],
      description:
        "Official launch of our new product line with presentations and demos.",
    },
    {
      id: 3,
      title: "Client Call",
      date: new Date(currentYear, currentMonth, 10, 9, 0),
      endTime: new Date(currentYear, currentMonth, 10, 10, 0),
      type: "call",
      location: "Zoom Meeting",
      attendees: ["Emily Davis", "Michael Brown"],
      description:
        "Follow-up call with client to discuss requirements and timeline.",
    },
    {
      id: 4,
      title: "Deadline: Q2 Report",
      date: new Date(currentYear, currentMonth, 28, 17, 0),
      type: "deadline",
      location: "",
      attendees: [],
      description: "Submit quarterly report to management team by end of day.",
    },
    {
      id: 5,
      title: "Marketing Strategy",
      date: new Date(currentYear, currentMonth, 5, 13, 0),
      endTime: new Date(currentYear, currentMonth, 5, 15, 0),
      type: "meeting",
      location: "Conference Room B",
      attendees: ["Sarah Wilson", "David Taylor"],
      description: "Discuss upcoming marketing campaigns and strategy for Q3.",
    },
    // Additional events
    {
      id: 6,
      title: "UI Design Review",
      date: new Date(currentYear, currentMonth, 8, 11, 0),
      endTime: new Date(currentYear, currentMonth, 8, 12, 30),
      type: "meeting",
      location: "Design Studio",
      attendees: ["Alex Johnson", "Maya Patel", "Carlos Rodriguez"],
      description: "Review the latest UI designs for the mobile app.",
    },
    {
      id: 7,
      title: "Budget Planning",
      date: new Date(currentYear, currentMonth, 12, 14, 0),
      endTime: new Date(currentYear, currentMonth, 12, 16, 0),
      type: "meeting",
      location: "Finance Department",
      attendees: ["Lisa Chen", "Mark Williams", "Sophia Garcia"],
      description: "Quarterly budget planning session for all departments.",
    },
    {
      id: 8,
      title: "Investor Presentation",
      date: new Date(currentYear, currentMonth, 17, 9, 0),
      endTime: new Date(currentYear, currentMonth, 17, 11, 0),
      type: "event",
      location: "Executive Boardroom",
      attendees: ["CEO", "CFO", "CTO", "Board Members"],
      description:
        "Present quarterly results and future projections to investors.",
    },
    {
      id: 9,
      title: "Tech Conference",
      date: new Date(currentYear, currentMonth, 22, 8, 0),
      endTime: new Date(currentYear, currentMonth, 24, 17, 0),
      type: "event",
      location: "Convention Center",
      attendees: ["Development Team", "Product Managers"],
      description:
        "Annual technology conference with workshops and networking.",
    },
    {
      id: 10,
      title: "Customer Support Training",
      date: new Date(currentYear, currentMonth, 14, 13, 0),
      endTime: new Date(currentYear, currentMonth, 14, 16, 0),
      type: "event",
      location: "Training Room",
      attendees: ["Support Team", "HR"],
      description: "Training session for new support tools and procedures.",
    },
    {
      id: 11,
      title: "Code Review",
      date: new Date(currentYear, currentMonth, 9, 15, 0),
      endTime: new Date(currentYear, currentMonth, 9, 16, 30),
      type: "meeting",
      location: "Dev Room",
      attendees: ["Engineering Team"],
      description: "Code review for the new features developed in Sprint 12.",
    },
    {
      id: 12,
      title: "Interview: Senior Developer",
      date: new Date(currentYear, currentMonth, 16, 10, 0),
      endTime: new Date(currentYear, currentMonth, 16, 11, 0),
      type: "call",
      location: "Zoom",
      attendees: ["HR Manager", "CTO", "Team Lead"],
      description: "Interview candidate for the Senior Developer position.",
    },
    {
      id: 13,
      title: "Website Deployment",
      date: new Date(currentYear, currentMonth, 27, 22, 0),
      type: "deadline",
      location: "",
      attendees: ["DevOps Team"],
      description: "Deploy the new website version to production.",
    },
    {
      id: 14,
      title: "Sales Strategy Review",
      date: new Date(currentYear, currentMonth, 19, 9, 0),
      endTime: new Date(currentYear, currentMonth, 19, 11, 0),
      type: "meeting",
      location: "Conference Room C",
      attendees: ["Sales Team", "Marketing Team"],
      description: "Review and update the sales strategy for Q3.",
    },
    {
      id: 15,
      title: "Monthly Team Lunch",
      date: new Date(currentYear, currentMonth, 30, 12, 0),
      endTime: new Date(currentYear, currentMonth, 30, 13, 30),
      type: "event",
      location: "Bistro Garden",
      attendees: ["All Team Members"],
      description: "Monthly team building lunch event.",
    },
    {
      id: 16,
      title: "Project Kickoff: Mobile App",
      date: new Date(currentYear, currentMonth, 3, 10, 0),
      endTime: new Date(currentYear, currentMonth, 3, 12, 0),
      type: "meeting",
      location: "Main Conference Room",
      attendees: ["Project Stakeholders", "Development Team"],
      description: "Kickoff meeting for the new mobile app project.",
    },
    {
      id: 17,
      title: "Security Audit",
      date: new Date(currentYear, currentMonth, 11, 14, 0),
      endTime: new Date(currentYear, currentMonth, 11, 17, 0),
      type: "event",
      location: "IT Department",
      attendees: ["Security Team", "IT Admins"],
      description:
        "Quarterly security audit of all systems and infrastructure.",
    },
    {
      id: 18,
      title: "Content Creation Workshop",
      date: new Date(currentYear, currentMonth, 25, 13, 0),
      endTime: new Date(currentYear, currentMonth, 25, 16, 0),
      type: "event",
      location: "Creative Studio",
      attendees: ["Marketing Team", "Content Writers"],
      description: "Workshop on creating engaging content for social media.",
    },
    {
      id: 19,
      title: "API Integration Call",
      date: new Date(currentYear, currentMonth, 7, 15, 0),
      endTime: new Date(currentYear, currentMonth, 7, 16, 0),
      type: "call",
      location: "Google Meet",
      attendees: ["Tech Lead", "Partner Company"],
      description: "Discuss API integration requirements with partner company.",
    },
    {
      id: 20,
      title: "User Testing Session",
      date: new Date(currentYear, currentMonth, 21, 11, 0),
      endTime: new Date(currentYear, currentMonth, 21, 13, 0),
      type: "meeting",
      location: "UX Lab",
      attendees: ["UX Team", "Test Participants"],
      description: "User testing session for the new dashboard interface.",
    },
  ];

  // Tipos de eventos con colores - mejor contraste para ambos temas (oscuro y claro)
  const eventTypes = {
    meeting: {
      color: "bg-blue-600",
      textColor: "text-blue-900 dark:text-blue-100",
      lightBg: "bg-blue-100 dark:bg-blue-900/50",
      borderColor: "border-blue-400 dark:border-blue-700",
      icon: "users",
    },
    event: {
      color: "bg-purple-600",
      textColor: "text-purple-900 dark:text-purple-100",
      lightBg: "bg-purple-100 dark:bg-purple-900/50",
      borderColor: "border-purple-400 dark:border-purple-700",
      icon: "calendar",
    },
    call: {
      color: "bg-green-600",
      textColor: "text-green-900 dark:text-green-100",
      lightBg: "bg-green-100 dark:bg-green-900/50",
      borderColor: "border-green-400 dark:border-green-700",
      icon: "phone",
    },
    deadline: {
      color: "bg-red-600",
      textColor: "text-red-900 dark:text-red-100",
      lightBg: "bg-red-100 dark:bg-red-900/50",
      borderColor: "border-red-400 dark:border-red-700",
      icon: "clock",
    },
  };

  /**
   * Genera los días del calendario para el mes actual.
   */
  function generateCalendarDays() {
    calendarDays = [];

    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    let startingDayOfWeek = firstDay.getDay();

    // Add days from previous month to fill the first row
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(
        currentYear,
        currentMonth - 1,
        prevMonthLastDay - i,
      );
      calendarDays.push({ date, events: getEventsForDate(date) });
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      calendarDays.push({ date, events: getEventsForDate(date) });
    }

    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const remainingCells = 42 - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      calendarDays.push({ date, events: getEventsForDate(date) });
    }
  }

  /**
   * Obtiene los eventos programados para una fecha específica.
   * @param date - La fecha para la que se desean obtener los eventos.
   * @returns Un array de eventos programados para la fecha dada.
   */
  function getEventsForDate(date: Date) {
    return events
      .filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear(),
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Formatea la hora en un formato legible.
   * @param date - La fecha que contiene la hora a formatear.
   * @returns La hora formateada como string.
   */
  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  /**
   * Formatea la fecha en un formato legible.
   * @param date - La fecha a formatear.
   * @returns La fecha formateada como string.
   */
  function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  /**
   * Navega al mes, semana o día anterior en el calendario.
   */
  function navigatePrevious() {
    if (currentView === "month") {
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
      generateCalendarDays();
    } else if (currentView === "week") {
      selectedDate = new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      currentMonth = selectedDate.getMonth();
      currentYear = selectedDate.getFullYear();
      generateCalendarDays();
    } else if (currentView === "day") {
      selectedDate = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);
      currentMonth = selectedDate.getMonth();
      currentYear = selectedDate.getFullYear();
      generateCalendarDays();
    }
  }

  /**
   * Navega al mes, semana o día siguiente en el calendario.
   */
  function navigateNext() {
    if (currentView === "month") {
      if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
      } else {
        currentMonth++;
      }
      generateCalendarDays();
    } else if (currentView === "week") {
      selectedDate = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      currentMonth = selectedDate.getMonth();
      currentYear = selectedDate.getFullYear();
      generateCalendarDays();
    } else if (currentView === "day") {
      selectedDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
      currentMonth = selectedDate.getMonth();
      currentYear = selectedDate.getFullYear();
      generateCalendarDays();
    }
  }

  /**
   * Selecciona una fecha en el calendario.
   * @param date - La fecha a seleccionar.
   */
  function selectDate(date: Date) {
    selectedDate = date;
  }

  /**
   * Cambia la vista actual del calendario.
   * @param view - La vista a establecer (mes, semana, día).
   */
  function setView(view: "month" | "week" | "day") {
    currentView = view;
    generateCalendarDays();
  }

  /**
   * Verifica si una fecha es hoy.
   * @param date - La fecha a verificar.
   * @returns Verdadero si la fecha es hoy, falso en caso contrario.
   */
  function isToday(date: Date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Verifica si una fecha está en el mes actual.
   * @param date - La fecha a verificar.
   * @returns Verdadero si la fecha está en el mes actual, falso en caso contrario.
   */
  function isCurrentMonth(date: Date) {
    return date.getMonth() === currentMonth;
  }

  /**
   * Verifica si una fecha está seleccionada.
   * @param date - La fecha a verificar.
   * @returns Verdadero si la fecha está seleccionada, falso en caso contrario.
   */
  function isSelected(date: Date) {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  }

  /**
   * Obtiene el nombre del mes a partir de su número.
   * @param month - El número del mes (0-11).
   * @returns El nombre del mes como string.
   */
  function getMonthName(month: number) {
    return new Date(0, month).toLocaleString("default", { month: "long" });
  }

  /**
   * Obtiene el rango de fechas para la vista de semana.
   * @returns Un objeto con las fechas de inicio y fin de la semana.
   */
  function getWeekRange() {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return { start, end };
  }

  /**
   * Alterna la visibilidad del modal para crear un nuevo evento.
   */
  function toggleEventModal() {
    showEventModal = !showEventModal;
    if (showEventModal) {
      newEvent = {
        date: new Date(selectedDate),
        type: "meeting",
        attendees: [],
      };
    }
  }

  // Inicializa el calendario
  onMount(() => {
    // Inicializa variables dependientes del ancho de la ventana
    windowWidth = window.innerWidth;
    isSmallMobile = windowWidth < 400;
    isMobile = windowWidth < 640;
    isTablet = windowWidth >= 640 && windowWidth < 1024;

    generateCalendarDays();
    isLoading = false;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<svelte:window on:resize={handleResize} />

<div class="max-w-full">
  <!-- Cabecera del Panel con Breadcrumb -->
  <div class="mb-8">
    <div
      class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2"
    >
      <a href="/" class="hover:text-primary-500 transition-colors cursor-pointer">Panel</a>
      <ChevronRight class="w-4 h-4 mx-2" />
      <span class="text-gray-900 dark:text-gray-200 font-medium">Calendario</span>
    </div>
    <div class="flex items-center gap-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Calendario</h1>
      <button
        on:click={() => showInfoPanel = !showInfoPanel}
        class="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
        title="Mostrar información"
      >
        <Info class="w-5 h-5" />
      </button>
    </div>
    <p class="text-gray-600 dark:text-gray-400 mt-1">
      Organiza tus eventos y mantén tu agenda actualizada
    </p>
  </div>

  <!-- Panel informativo (visible solo cuando se hace clic en el botón de información) -->
  {#if showInfoPanel}
    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-in fade-in duration-300"
    >
      <div class="flex items-start">
        <Calendar class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
            Gestión de calendario
          </h3>
          <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              • Visualiza todos tus eventos en vista mensual, semanal o diaria.
            </li>
            <li>
              • Crea nuevos eventos usando el botón "Añadir evento".
            </li>
            <li>
              • Navega entre meses usando las flechas de navegación.
            </li>
            <li>
              • Los eventos se codifican por colores según su tipo.
            </li>
            <li>
              • Haz clic en cualquier evento para ver detalles completos.
            </li>
          </ul>
        </div>
      </div>
    </div>
  {/if}

  <!-- Controles del calendario -->
  <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
    <div class="flex items-center gap-2">
      <button
        class="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-colors shadow-sm text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        on:click={toggleEventModal}
        type="button"
        name="createEvent"
      >
        <Plus class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Crear evento</span>
      </button>
    </div>
  </div>

  <!-- Área de contenido principal -->
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"
      ></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-4 sm:gap-6">
      <!-- Barra lateral - Ahora en la izquierda -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden lg:col-span-2 order-2 lg:order-1"
      >
        <!-- Mini calendario mensual -->
        <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 hidden sm:block">
          <div class="grid grid-cols-7 gap-1 mb-1 sm:mb-2">
            {#each ["D", "L", "M", "X", "J", "V", "S"] as day}
              <div
                class="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            {/each}
          </div>

          <div class="grid grid-cols-7 gap-1">
            {#each calendarDays.slice(0, 35) as { date }}
              <button
                class={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs rounded-full
                  ${isCurrentMonth(date) ? "text-gray-900 dark:text-gray-100" : "text-gray-500/80 dark:text-gray-400/80"}
                  ${isToday(date) ? "bg-primary-500 text-white" : ""}
                  ${isSelected(date) && !isToday(date) ? "bg-primary-100 dark:bg-primary-800/40 text-primary-700 dark:text-primary-300 font-medium" : ""}
                  ${!isToday(date) && !isSelected(date) ? "bg-transparent dark:bg-transparent" : ""}
                  hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50`}
                on:click={() => selectDate(date)}
                type="button"
              >
                {date.getDate()}
              </button>
            {/each}
          </div>
        </div>

        <!-- Información de la fecha seleccionada -->
        <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h3
            class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
          >
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
        </div>

        <!-- Eventos de la fecha seleccionada -->
        <div class="p-3 sm:p-4">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <h4
              class="font-medium text-gray-900 dark:text-white text-sm sm:text-base"
            >
              Eventos
            </h4>
            <button
              class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium flex items-center cursor-pointer focus:outline-none focus:underline"
              on:click={toggleEventModal}
              type="button"
            >
              <Plus class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Añadir Evento
            </button>
          </div>

          {#if getEventsForDate(selectedDate).length === 0}
            <div
              class="text-center py-4 sm:py-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <Calendar
                class="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-400 dark:text-gray-400 mb-2"
              />
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                No hay eventos programados
              </p>
              <button
                class="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs sm:text-sm rounded-lg flex items-center gap-1 sm:gap-2 mx-auto transition-colors shadow-sm dark:bg-primary-600 dark:hover:bg-primary-700 dark:active:bg-primary-800 cursor-pointer"
                on:click={toggleEventModal}
                type="button"
              >
                <Plus class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Nuevo Evento
              </button>
            </div>
          {:else}
            <div
              class="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-1"
            >
              {#each getEventsForDate(selectedDate) as event}
                <div
                  class={`border ${eventTypes[event.type].borderColor} rounded-lg p-2 sm:p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow hover:border-opacity-80 dark:hover:border-opacity-80 transition-shadow cursor-pointer hover:brightness-95 dark:hover:brightness-110`}
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        class={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1.5 ${eventTypes[event.type].color} flex-shrink-0`}
                      ></div>
                      <div class="min-w-0 flex-1">
                        <h4
                          class="font-medium text-gray-900 dark:text-white text-sm sm:text-base"
                        >
                          {event.title}
                        </h4>
                        {#if event.endTime}
                          <div
                            class="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2"
                          >
                            <Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                            <span
                              >{formatTime(event.date)} - {formatTime(
                                event.endTime,
                              )}</span
                            >
                          </div>
                        {:else}
                          <div
                            class="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2"
                          >
                            <Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                            <span class="truncate">{formatTime(event.date)}</span>
                          </div>
                        {/if}
                        {#if event.location}
                          <div
                            class="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5"
                          >
                            <MapPin class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                            <span class="truncate">{event.location}</span>
                          </div>
                        {/if}
                        {#if event.attendees && event.attendees.length > 0}
                          <div
                            class="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5"
                          >
                            <Users class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                            <span class="truncate"
                              >{event.attendees.length}
                              {event.attendees.length === 1
                                ? "asistente"
                                : "asistentes"}</span
                            >
                          </div>
                        {/if}
                        {#if event.description}
                          <div
                            class="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-1.5 sm:pt-2 line-clamp-2"
                          >
                            {event.description}
                          </div>
                        {/if}
                      </div>
                    </div>
                    <div
                      class={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full ${eventTypes[event.type].lightBg} ${eventTypes[event.type].textColor} font-medium ml-2 flex-shrink-0`}
                    >
                      {event.type === 'meeting' ? 'Reunión' :
                       event.type === 'event' ? 'Evento' :
                       event.type === 'call' ? 'Llamada' :
                       'Fecha límite'}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Contenido principal del calendario - Ahora en la derecha -->
      <div
        class="lg:col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden order-1 lg:order-2"
      >
        <!-- Navegación del calendario -->
        <div
          class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-white dark:bg-gray-800/95 sticky top-0 z-10 backdrop-blur-sm"
        >
          <div class="flex items-center gap-3">
            {#if currentView === "month"}
              <h2
                class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white"
              >
                {getMonthName(currentMonth)}
                <span class="font-normal text-gray-700 dark:text-gray-300">{currentYear}</span>
              </h2>
            {:else if currentView === "week"}
              <h2
                class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white"
              >
                {getWeekRange().start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} -
                {getWeekRange().end.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
            {:else}
              <h2
                class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none"
              >
                {formatDate(selectedDate)}
              </h2>
            {/if}
            
            <!-- Selector de vista -->
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex shadow-sm">
              <button
                class={`px-2 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${currentView === "day" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-500/60"}`}
                on:click={() => setView("day")}
                type="button"
                name="day"
              >
                Día
              </button>
              <button
                class={`px-2 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${currentView === "week" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-500/60"}`}
                on:click={() => setView("week")}
                type="button"
                name="week"
              >
                Semana
              </button>
              <button
                class={`px-2 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${currentView === "month" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-500/60"}`}
                on:click={() => setView("month")}
                type="button"
                name="month"
              >
                Mes
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-1 sm:space-x-2">
            <button
              class="p-1.5 sm:p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              on:click={navigatePrevious}
              aria-label="Previous"
              type="button"
              name="previous"
            >
              <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              on:click={() => {
                const today = new Date();
                selectedDate = today;
                currentMonth = today.getMonth();
                currentYear = today.getFullYear();
                generateCalendarDays();
              }}
              type="button"
              name="today"
            >
              Hoy
            </button>
            <button
              class="p-1.5 sm:p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              on:click={navigateNext}
              aria-label="Next"
              type="button"
              name="next"
            >
              <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <!-- Contenido principal del calendario -->
        <div class="p-2 sm:p-4">
          {#if currentView === "month"}
            <!-- Vista mensual -->
            <!-- Encabezados de días de la semana -->
            <div class="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1 sm:mb-2">
              {#each ["D", "L", "M", "X", "J", "V", "S"] as day, i}
                <div
                  class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                >
                  {#if windowWidth > 640}
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][i]}
                  {:else}
                    {day}
                  {/if}
                </div>
              {/each}
            </div>

            <!-- Grilla de días del calendario - Más compacta -->
            <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
              {#each calendarDays as { date, events }}
                <div
                  class={`${isSmallMobile ? 'min-h-[55px]' : 'min-h-[70px]'} sm:min-h-[100px] md:min-h-[110px] lg:min-h-[120px] p-1 sm:p-1.5 border border-gray-200 dark:border-gray-700 rounded-md sm:rounded-lg overflow-hidden flex flex-col ${
                    isCurrentMonth(date)
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400"
                  } ${
                    isSelected(date)
                      ? "ring-2 ring-primary-500/70 dark:ring-primary-400/70 ring-opacity-75 shadow-sm"
                      : ""
                  } hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/90 dark:hover:bg-gray-700/90 hover:shadow-sm active:bg-gray-100 dark:active:bg-gray-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50`}
                  on:click={() => selectDate(date)}
                  on:keydown={(e) => e.key === "Enter" && selectDate(date)}
                  role="button"
                  tabindex="0"
                >
                  <!-- Date Number -->
                  <div class="flex justify-between items-center mb-0.5 sm:mb-1">
                    <div
                      class={`flex items-center justify-center ${isSmallMobile ? 'w-5 h-5' : 'w-6 h-6'} sm:w-6 sm:h-6 text-xs ${
                        isToday(date)
                          ? "bg-primary-500 text-white rounded-full"
                          : isSelected(date) && !isToday(date)
                          ? "bg-primary-100 dark:bg-primary-900/30 font-medium"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {#if events.length > 0 && !isMobile}
                      <div
                        class="text-[8px] sm:text-[9px] font-medium text-gray-500 dark:text-gray-400 hidden sm:block bg-gray-100/70 dark:bg-gray-700/70 px-1 rounded-full"
                      >
                        {events.length}
                      </div>
                    {/if}
                  </div>

                  <!-- Event List -->
                  {#if events.length > 0}
                    <div
                      class="space-y-0.5 sm:space-y-1 flex-1 overflow-hidden flex flex-col"
                    >
                      {#each events.slice(0, visibleEventsCount) as event}
                        <div
                          class={`${isSmallMobile ? 'text-[8px] py-0 px-0.5' : 'text-[9px] py-0.5 px-1'} sm:text-xs sm:py-0.5 sm:px-1.5 rounded ${eventTypes[event.type].lightBg} ${eventTypes[event.type].textColor} border-l-2 ${eventTypes[event.type].borderColor} shadow-sm cursor-pointer hover:shadow hover:brightness-95 dark:hover:brightness-110 hover:border-opacity-80 dark:hover:border-opacity-80 transition-all flex items-center gap-1 overflow-hidden flex-shrink-0`}
                          title={`${event.title} - ${formatTime(event.date)}`}
                          on:click|stopPropagation={() => {
                            selectDate(event.date);
                            if (isMobile) {
                            }
                          }}
                          on:keydown|stopPropagation={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectDate(event.date);
                              if (isMobile) {
                              }
                            }
                          }}
                          role="button"
                          tabindex="0"
                        >
                          <div
                            class={`flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${eventTypes[event.type].color}`}
                          ></div>
                          <div class="flex-1 min-w-0 flex items-center gap-1">
                            {#if !isSmallMobile && !isMobile}
                              <span class="text-[8px] sm:text-[9px] font-medium inline-block bg-black/10 dark:bg-white/10 px-0.5 rounded whitespace-nowrap flex-shrink-0">{formatTime(event.date)}</span>
                            {/if}
                            <span class="truncate">{event.title}</span>
                          </div>
                        </div>
                      {/each}

                      {#if events.length > visibleEventsCount}
                        <div
                          class={`${isSmallMobile ? 'text-[8px] px-0.5 py-0' : 'text-[9px] px-1 py-0.5'} sm:text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100/50 dark:bg-gray-700/50 rounded text-center mt-auto flex-shrink-0`}
                          on:click|stopPropagation={() => selectDate(date)}
                          on:keydown|stopPropagation={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectDate(date);
                            }
                          }}
                          role="button"
                          tabindex="0"
                        >
                          +{events.length - visibleEventsCount}
                        </div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {:else if currentView === "week"}
            <!-- Vista semanal - Compacta/Responsiva -->
            <div class="flex flex-col h-[400px] sm:h-[500px]">
              <!-- Encabezados de horas -->
              <div
                class="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700"
              >
                <div
                  class="border-r border-gray-200 dark:border-gray-700 p-1 sm:p-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10"
                ></div>
                {#each Array(7) as _, i}
                  {@const weekStart = getWeekRange().start}
                  {@const currentDay = new Date(
                    weekStart.getFullYear(),
                    weekStart.getMonth(),
                    weekStart.getDate() + i,
                  )}
                  <div
                    class={`p-1 sm:p-2 text-center border-r border-gray-200 dark:border-gray-700 
                      ${isToday(currentDay) ? "bg-primary-50 dark:bg-primary-900/10" : ""}
                      ${isSelected(currentDay) ? "bg-primary-100/70 dark:bg-primary-800/25 border-b-2 border-primary-500/70 dark:border-primary-400/60" : ""}`}
                    on:click={() => selectDate(currentDay)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => e.key === "Enter" && selectDate(currentDay)}
                  >
                    <div class="font-medium text-xs sm:text-sm truncate">
                      {currentDay.toLocaleDateString("en-US", {
                        weekday: window.innerWidth < 640 ? "narrow" : "short",
                      })}
                    </div>
                    <div
                      class={`inline-flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 mt-0.5 sm:mt-1 rounded-full text-[10px] sm:text-sm ${
                        isToday(currentDay) ? "bg-primary-500 text-white" : ""
                      }`}
                    >
                      {currentDay.getDate()}
                    </div>
                  </div>
                {/each}
              </div>

              <!-- Espacios de tiempo -->
              <div class="flex-1 overflow-y-auto">
                {#each Array(12) as _, hour}
                  {@const hourValue = hour + 8}
                  <!-- Start at 8 AM -->
                  <div
                    class="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 min-h-[40px] sm:min-h-[60px]"
                  >
                    <!-- Hour marker -->
                    <div
                      class="border-r border-gray-200 dark:border-gray-700 p-1 sm:p-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-right pr-1 sm:pr-2 sticky left-0 bg-white dark:bg-gray-800 z-10"
                    >
                      {hourValue % 12 === 0 ? 12 : hourValue % 12}{hourValue <
                      12
                        ? "a"
                        : "p"}
                    </div>

                    <!-- Day columns -->
                    {#each Array(7) as _, i}
                      {@const weekStart = getWeekRange().start}
                      {@const currentDay = new Date(
                        weekStart.getFullYear(),
                        weekStart.getMonth(),
                        weekStart.getDate() + i,
                      )}

                      <div
                        class={`relative border-r border-gray-200 dark:border-gray-700 p-0.5 sm:p-1 
                        ${isToday(currentDay) ? "bg-primary-50 dark:bg-primary-900/10" : ""}
                        ${isSelected(currentDay) ? "bg-primary-100/50 dark:bg-primary-800/20 border-l-2 border-primary-500/50 dark:border-primary-400/50" : ""}
                        cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 active:bg-gray-100 dark:active:bg-gray-700/70 transition-colors z-10 min-w-0`}
                        on:click={() => {
                          // Crear una nueva fecha con la hora actual
                          const date = new Date(currentDay);
                          date.setHours(hourValue);
                          selectDate(date);
                        }}
                        role="button"
                        tabindex="0"
                        on:keydown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            const date = new Date(currentDay);
                            date.setHours(hourValue);
                            selectDate(date);
                          }
                        }}
                      >
                        {#each events.filter((e) => e.date.getDate() === currentDay.getDate() && e.date.getMonth() === currentDay.getMonth() && e.date.getFullYear() === currentDay.getFullYear() && e.date.getHours() === hourValue) as event}
                          <div
                            class={`absolute w-[calc(100%-4px)] sm:w-[calc(100%-8px)] py-0.5 sm:py-1 px-1 sm:px-2 rounded-md ${eventTypes[event.type].lightBg} ${eventTypes[event.type].textColor} 
                            border-l-2 ${eventTypes[event.type].borderColor} text-[9px] sm:text-xs shadow-sm cursor-pointer hover:shadow hover:brightness-95 dark:hover:brightness-110 active:brightness-90 dark:active:brightness-125 transition-all hover:border-opacity-80 dark:hover:border-opacity-80 z-20 overflow-hidden`}
                            style={`top: ${(event.date.getMinutes() / 60) * 100}%; ${event.endTime ? `height: ${Math.min(((event.endTime.getTime() - event.date.getTime()) / (60 * 60 * 1000)) * 100, 95)}%;` : ''}`}
                            title={`${event.title} - ${formatTime(event.date)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}`}
                            on:click|stopPropagation={() => {
                              selectDate(event.date);
                              if (isMobile) currentView = 'day';
                            }}
                            role="button"
                            tabindex="0"
                            on:keydown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                selectDate(event.date);
                                if (isMobile) currentView = 'day';
                              }
                            }}
                          >
                            <div class="font-medium truncate">
                              {event.title}
                            </div>
                            <div class="flex items-center gap-0.5 truncate hidden sm:flex">
                              <Clock class="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span class="truncate">{formatTime(event.date)}</span>
                            </div>
                          </div>
                        {/each}
                      </div>
                    {/each}
                  </div>
                {/each}
              </div>
            </div>
          {:else}
            <!-- Vista diaria -->
            <div class="flex flex-col h-[450px] sm:h-[600px]">
              <div class="flex-1 overflow-y-auto">
                {#each Array(12) as _, hour}
                  {@const hourValue = hour + 8}
                  <!-- Start at 8 AM -->
                  <div
                    class="flex border-b border-gray-200 dark:border-gray-700 min-h-[60px] sm:min-h-[80px]"
                  >
                    <!-- Hour marker -->
                    <div
                      class="w-10 sm:w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 p-1 sm:p-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-right pr-1 sm:pr-3 font-medium sticky left-0 bg-white dark:bg-gray-800 z-10"
                    >
                      {hourValue % 12 === 0 ? 12 : hourValue % 12}{hourValue <
                      12
                        ? "am"
                        : "pm"}
                    </div>

                    <!-- Contenedor de eventos -->
                    <div class="flex-1 p-1 sm:p-2 relative min-w-0">
                      {#each events.filter((e) => e.date.getDate() === selectedDate.getDate() && e.date.getMonth() === selectedDate.getMonth() && e.date.getFullYear() === selectedDate.getFullYear() && e.date.getHours() === hourValue) as event}
                        <div
                          class={`relative w-[calc(100%-4px)] sm:w-[calc(100%-8px)] px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg ${eventTypes[event.type].lightBg} ${eventTypes[event.type].textColor} 
                          border-l-2 ${eventTypes[event.type].borderColor} shadow-sm cursor-pointer hover:shadow-md hover:brightness-95 dark:hover:brightness-110 active:brightness-90 dark:active:brightness-125 transition-all hover:border-opacity-80 dark:hover:border-opacity-80 z-10 overflow-hidden`}
                          style={`top: ${(event.date.getMinutes() / 60) * 100}%; ${event.endTime ? `height: ${Math.min(((event.endTime.getTime() - event.date.getTime()) / (60 * 60 * 1000)) * 100, 95)}%;` : ''}`}
                          title={`${event.title} - ${formatTime(event.date)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}`}
                          on:click|stopPropagation={() => selectDate(event.date)}
                          role="button"
                          tabindex="0"
                          on:keydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectDate(event.date);
                            }
                          }}
                        >
                          <div class="flex items-center gap-1.5 flex-shrink-0 mb-1">
                            <div class={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${eventTypes[event.type].color} flex-shrink-0`}></div>
                            <h4 class="text-xs sm:text-sm font-medium truncate">{event.title}</h4>
                          </div>
                          
                          <div class="flex items-center gap-1 text-[9px] sm:text-xs mb-1">
                            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span>
                              {formatTime(event.date)}
                              {event.endTime ? ` - ${formatTime(event.endTime)}` : ""}
                            </span>
                          </div>

                          {#if event.location}
                            <div class="flex items-center gap-1 text-[9px] sm:text-xs truncate">
                              <MapPin class="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                              <span class="truncate">{event.location}</span>
                            </div>
                          {/if}
                          
                          {#if event.attendees && event.attendees.length > 0 && (event.endTime && (event.endTime.getTime() - event.date.getTime()) > 30 * 60 * 1000)}
                            <div class="flex items-center gap-1 text-[9px] sm:text-xs truncate mt-1">
                              <Users class="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                              <span class="truncate">
                                {event.attendees.length} {event.attendees.length === 1 ? "asistente" : "asistentes"}
                              </span>
                            </div>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Nuevo evento (oculto por defecto) -->
  {#if showEventModal}
    <div
      class="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col"
      >
        <div
          class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
        >
          <h3
            class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
          >
            Crear Nuevo Evento
          </h3>
          <button
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
            on:click={toggleEventModal}
            aria-label="Close"
            type="button"
          >
            <X class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div class="p-3 sm:p-4 overflow-y-auto flex-1">
          <form class="space-y-3 sm:space-y-4">
            <div>
              <label
                for="title"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
              >
                Título del Evento
              </label>
              <input
                type="text"
                id="title"
                class="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm transition-shadow duration-200"
                placeholder="Título del evento"
                name="title"
                autocomplete="off"
              />
            </div>

            <div>
              <label
                for="type"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
              >
                Tipo de Evento
              </label>
              <select
                id="type"
                class="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-xs sm:text-sm cursor-pointer appearance-none bg-no-repeat bg-right pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M6%208c-.3%200-.5-.1-.7-.3l-3-3c-.4-.4-.4-1%200-1.4s1-.4%201.4%200L6%205.6l2.3-2.3c.4-.4%201-.4%201.4%200s.4%201%200%201.4l-3%203c-.2.2-.4.3-.7.3z%22%2F%3E%3C%2Fsvg%3E')]"
                name="event-type"
                autocomplete="off"
              >
                <option value="meeting">Reunión</option>
                <option value="event">Evento</option>
                <option value="call">Llamada</option>
                <option value="deadline">Fecha límite</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div>
                <label
                  for="date"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
                >
                  Fecha
                </label>
                <input
                  type="date"
                  id="date"
                  class="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-xs sm:text-sm cursor-pointer transition-shadow duration-200"
                  value={selectedDate.toISOString().substring(0, 10)}
                  name="event-date"
                  autocomplete="off"
                />
              </div>
              <div>
                <label
                  for="time"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
                >
                  Hora
                </label>
                <input
                  type="time"
                  id="time"
                  class="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-xs sm:text-sm cursor-pointer transition-shadow duration-200"
                  name="event-time"
                  autocomplete="off"
                  value={`${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`}
                />
              </div>
            </div>

            <div>
              <label
                for="location"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
              >
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                class="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-xs sm:text-sm transition-shadow duration-200"
                placeholder="Ubicación del evento"
                name="event-location"
                autocomplete="off"
              />
            </div>

            <div>
              <label
                for="description"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer"
              >
                Descripción
              </label>
              <textarea
                id="description"
                rows="3"
                class="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-xs sm:text-sm resize-none transition-shadow duration-200"
                placeholder="Descripción del evento"
                name="event-description"
              ></textarea>
            </div>
          </form>
        </div>

        <div
          class="flex justify-end gap-2 sm:gap-3 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30"
        >
          <button
            class="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500 text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            on:click={toggleEventModal}
            type="button"
          >
            Cancelar
          </button>
          <button
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md shadow-sm text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700 dark:active:bg-primary-800 transition-colors duration-200"
            on:click={toggleEventModal}
            type="button"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
