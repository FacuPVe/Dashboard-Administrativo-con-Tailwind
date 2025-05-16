<script lang="ts">
  import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Eye,
    Info,
    Users,
  } from "@lucide/svelte";

  // Datos de muestra de clientes
  const customers = [
    {
      id: "CUS-001",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+34 623 456 789",
      status: "Active",
      segment: "Premium",
      orders: 28,
      spent: "$3,245.89",
      lastOrder: "2025-03-15",
      joinDate: "2023-02-10",
      location: "Madrid, España",
      retention: "94%",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "CUS-002",
      name: "María García",
      email: "maria.garcia@example.com",
      phone: "+34 612 345 678",
      status: "Active",
      segment: "Standard",
      orders: 16,
      spent: "$1,876.50",
      lastOrder: "2025-03-22",
      joinDate: "2023-05-15",
      location: "Barcelona, España",
      retention: "87%",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "CUS-003",
      name: "Roberto Jiménez",
      email: "roberto.jimenez@example.com",
      phone: "+34 634 567 890",
      status: "Inactive",
      segment: "Standard",
      orders: 5,
      spent: "$750.25",
      lastOrder: "2024-09-12",
      joinDate: "2023-08-22",
      location: "Valencia, España",
      retention: "42%",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "CUS-004",
      name: "Elena Martínez",
      email: "elena.martinez@example.com",
      phone: "+34 645 678 901",
      status: "Active",
      segment: "Premium",
      orders: 32,
      spent: "$4,890.75",
      lastOrder: "2025-04-01",
      joinDate: "2023-01-18",
      location: "Sevilla, España",
      retention: "96%",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: "CUS-005",
      name: "Miguel Fernández",
      email: "miguel.fernandez@example.com",
      phone: "+34 656 789 012",
      status: "Active",
      segment: "Standard",
      orders: 14,
      spent: "$1,720.30",
      lastOrder: "2025-03-05",
      joinDate: "2024-01-15",
      location: "Bilbao, España",
      retention: "85%",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: "CUS-006",
      name: "Sara Torres",
      email: "sara.torres@example.com",
      phone: "+34 667 890 123",
      status: "Inactive",
      segment: "Basic",
      orders: 3,
      spent: "$250.00",
      lastOrder: "2024-06-28",
      joinDate: "2024-03-10",
      location: "Málaga, España",
      retention: "38%",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      id: "CUS-007",
      name: "David Sánchez",
      email: "david.sanchez@example.com",
      phone: "+34 678 901 234",
      status: "Active",
      segment: "Premium",
      orders: 24,
      spent: "$3,980.45",
      lastOrder: "2025-03-22",
      joinDate: "2023-04-12",
      location: "Zaragoza, España",
      retention: "92%",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: "CUS-008",
      name: "Laura Rodríguez",
      email: "laura.rodriguez@example.com",
      phone: "+34 689 012 345",
      status: "Active",
      segment: "Standard",
      orders: 18,
      spent: "$2,345.20",
      lastOrder: "2025-02-18",
      joinDate: "2023-07-08",
      location: "Alicante, España",
      retention: "88%",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      id: "CUS-009",
      name: "Carlos Ruiz",
      email: "carlos.ruiz@example.com",
      phone: "+34 690 123 456",
      status: "Active",
      segment: "Premium",
      orders: 30,
      spent: "$4,120.75",
      lastOrder: "2025-03-28",
      joinDate: "2023-03-25",
      location: "Madrid, España",
      retention: "93%",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      id: "CUS-010",
      name: "Isabel López",
      email: "isabel.lopez@example.com",
      phone: "+34 601 234 567",
      status: "Active",
      segment: "Standard",
      orders: 12,
      spent: "$1,450.90",
      lastOrder: "2025-02-15",
      joinDate: "2024-02-10",
      location: "Barcelona, España",
      retention: "82%",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  ];

  // Estadísticas de clientes actualizadas para el período 2023-2025
  const customerStats = [
    {
      title: "Total Clientes",
      value: "3,245",
      change: "+15.8%",
      isPositive: true,
    },
    {
      title: "Clientes Activos",
      value: "2,782",
      change: "+12.5%",
      isPositive: true,
    },
    {
      title: "Nuevos este Mes",
      value: "124",
      change: "+18.4%",
      isPositive: true,
    },
    {
      title: "Valor Prom. Cliente",
      value: "$1,845",
      change: "+21.3%",
      isPositive: true,
    },
  ];

  // Estado de paginación
  let currentPage = 1;
  const totalPages = 5;
  const itemsPerPage = 5; // Set to 5 to show fewer customers per page

  // Estado para el panel informativo
  let showInfoPanel = false;

  // Estado de búsqueda
  let searchQuery = "";

  // Estado de filtros
  let showFilters = false;
  let statusFilter = "All";
  let segmentFilter = "All";
  let sortBy = "name";
  let sortOrder = "asc";

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function toggleFilters() {
    showFilters = !showFilters;
  }

  // Clientes filtrados y ordenados
  $: filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        searchQuery === "" ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      const matchesSegment = 
        segmentFilter === "All" || customer.segment === segmentFilter;

      return matchesSearch && matchesStatus && matchesSegment;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "orders") {
        return sortOrder === "desc"
          ? b.orders - a.orders
          : a.orders - b.orders;
      }
      return 0;
    });

  // Clientes paginados
  $: paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
</script>

<div>
  <!-- Cabecera del Panel con Breadcrumb -->
  <div class="mb-8">
    <div
      class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2"
    >
      <a href="/" class="hover:text-primary-500 transition-colors cursor-pointer">Panel</a>
      <ChevronRight class="w-4 h-4 mx-2" />
      <span class="text-gray-900 dark:text-gray-200 font-medium">Clientes</span>
    </div>
    <div class="flex items-center gap-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
      <button
        on:click={() => showInfoPanel = !showInfoPanel}
        class="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
        title="Mostrar información"
      >
        <Info class="w-5 h-5" />
      </button>
    </div>
    <p class="text-gray-600 dark:text-gray-400 mt-1">
      Gestiona tu base de datos de clientes y analiza su comportamiento
    </p>
  </div>

  <!-- Panel informativo (visible solo cuando se hace clic en el botón de información) -->
  {#if showInfoPanel}
    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-in fade-in duration-300"
    >
      <div class="flex items-start">
        <Users class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
            Gestión de clientes
          </h3>
          <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              • Visualiza estadísticas clave como clientes totales, activos y nuevos.
            </li>
            <li>
              • Analiza la segmentación de clientes y ciclos de vida.
            </li>
            <li>
              • Filtra la lista por estado, segmento o usando la búsqueda.
            </li>
            <li>
              • Accede a detalles completos haciendo clic en cada cliente.
            </li>
            <li>
              • Añade nuevos clientes con el botón "Añadir cliente".
            </li>
          </ul>
        </div>
      </div>
    </div>
  {/if}

  <!-- Customer Stats -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
    {#each customerStats as stat}
      <div
        class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
        <p class="text-2xl font-semibold mt-1">{stat.value}</p>
        <div class="mt-2">
          <span
            class={`text-sm ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {stat.change}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            comparado con 2024</span
          >
        </div>
      </div>
    {/each}
  </div>

  <!-- Customer Insights -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <!-- Segmentation Chart -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
    >
      <h3 class="text-lg font-medium mb-4">Segmentación de clientes</h3>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Premium</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">40%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-purple-600 h-2.5 rounded-full"
              style="width: 40%"
            ></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Standard</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">45%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full"
              style="width: 45%"
            ></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Basic</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">15%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-gray-500 h-2.5 rounded-full"
              style="width: 15%"
            ></div>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Los clientes Premium representan el 68% de los ingresos totales.
        </p>
      </div>
    </div>

    <!-- Customer Lifecycle -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
    >
      <h3 class="text-lg font-medium mb-4">Ciclo de vida del cliente</h3>
      <div class="grid grid-cols-2 gap-4">
        <div
          class="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">Nuevos</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            412
          </p>
          <p class="text-xs text-green-500">+24% vs 2024</p>
        </div>
        <div
          class="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">Activos</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            1,845
          </p>
          <p class="text-xs text-green-500">+16% vs 2024</p>
        </div>
        <div
          class="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">En riesgo</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            268
          </p>
          <p class="text-xs text-red-500">+8% vs 2024</p>
        </div>
        <div
          class="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">Inactivos</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            720
          </p>
          <p class="text-xs text-red-500">+5% vs 2024</p>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Tasa de retención promedio: 85% (+3.5% comparado con 2024)
        </p>
      </div>
    </div>

    <!-- Recent Activities -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
    >
      <h3 class="text-lg font-medium mb-4">Actividad reciente</h3>
      <div class="space-y-4">
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://randomuser.me/api/portraits/women/4.jpg"
              alt="Elena Martínez"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="ml-3">
            <p class="text-xs sm:text-sm font-medium">Elena Martínez realizó un pedido</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              $1,250.00 - hace 2 horas
            </p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://randomuser.me/api/portraits/men/7.jpg"
              alt="David Sánchez"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="ml-3">
            <p class="text-xs sm:text-sm font-medium">David Sánchez actualizó sus datos</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Nuevo teléfono - hace 5 horas
            </p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://randomuser.me/api/portraits/women/10.jpg"
              alt="Isabel López"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="ml-3">
            <p class="text-xs sm:text-sm font-medium">
              Isabel López solicitó un reembolso
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              $89.99 - hace 1 día
            </p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://randomuser.me/api/portraits/men/9.jpg"
              alt="Carlos Ruiz"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="ml-3">
            <p class="text-xs sm:text-sm font-medium">Carlos Ruiz dejó una reseña</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              5 estrellas - hace 1 día
            </p>
          </div>
        </div>
      </div>
      <div
        class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center"
      >
        <a
          href="#actividad"
          class="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Ver toda la actividad →
        </a>
      </div>
    </div>
  </div>

  <!-- Customer Table -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            name="search"
            placeholder="Buscar clientes..."
            bind:value={searchQuery}
            class="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 sm:px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md flex items-center gap-2 cursor-pointer"
            on:click={toggleFilters}
            aria-label="Mostrar filtros"
          >
            <Filter class="w-4 h-4" />
            <span class="hidden sm:inline">Filtros</span>
          </button>
          <button
            class="px-3 sm:px-4 py-2 text-sm bg-primary-500 text-white rounded-md flex items-center gap-2 cursor-pointer"
            aria-label="Añadir nuevo cliente"
          >
            <Plus class="w-4 h-4" />
            <span class="hidden sm:inline">Añadir Cliente</span>
          </button>
        </div>
      </div>

      {#if showFilters}
        <div class="mt-4 p-4 bg-white dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                for="status-filter"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Estado</label
              >
              <select
                id="status-filter"
                bind:value={statusFilter}
                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="All">Todos</option>
                <option value="Active">Activos</option>
                <option value="Inactive">Inactivos</option>
              </select>
            </div>
            <div>
              <label
                for="segment-filter"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Segmento</label
              >
              <select
                id="segment-filter"
                name="segment-filter"
                bind:value={segmentFilter}
                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="All">Todos</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
                <option value="Basic">Básico</option>
              </select>
            </div>
            <div>
              <label
                for="date-range"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Período</label
              >
              <select
                id="date-range"
                name="date-range"
                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="all">Todo el tiempo</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="lastMonth">Último mes</option>
                <option value="last3Months">Últimos 3 meses</option>
                <option value="last6Months">Últimos 6 meses</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label
                for="location-filter"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Ubicación</label
              >
              <select
                id="location-filter"
                name="location-filter"
                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="All">Todas</option>
                <option value="Spain">España</option>
                <option value="Europe">Europa</option>
                <option value="Others">Otros</option>
              </select>
            </div>
            <div>
              <label
                for="retention-filter"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Retención</label
              >
              <select
                id="retention-filter"
                name="retention-filter"
                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="All">Todos</option>
                <option value="high">Alta (>85%)</option>
                <option value="medium">Media (50-85%)</option>
                <option value="low">Baja (&lt;50%)</option>
              </select>
            </div>
            <div>
              <label
                for="sort-by"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Ordenar por</label
              >
              <select
                id="sort-by"
                name="sort-by"
                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="nameAsc">Nombre (A-Z)</option>
                <option value="nameDesc">Nombre (Z-A)</option>
                <option value="dateDesc">Más recientes</option>
                <option value="dateAsc">Más antiguos</option>
                <option value="spentDesc">Mayor gasto</option>
                <option value="spentAsc">Menor gasto</option>
                <option value="ordersDesc">Mayor número de pedidos</option>
                <option value="retentionDesc">Mayor retención</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
              class="px-3 sm:px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              aria-label="Restablecer filtros"
            >
              Restablecer
            </button>
            <button
              class="px-3 sm:px-4 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer"
              aria-label="Aplicar filtros seleccionados"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      {/if}
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-xs sm:text-sm">
        <thead>
          <tr
            class="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
          >
            <th class="px-3 sm:px-4 py-3">Cliente</th>
            <th class="px-3 sm:px-4 py-3">Contacto</th>
            <th class="px-3 sm:px-4 py-3">Segmento</th>
            <th class="px-3 sm:px-4 py-3">Estado</th>
            <th class="px-3 sm:px-4 py-3">Retención</th>
            <th class="px-3 sm:px-4 py-3">Pedidos</th>
            <th class="px-3 sm:px-4 py-3">Total Gastado</th>
            <th class="px-3 sm:px-4 py-3">Última Compra</th>
            <th class="px-3 sm:px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          {#each paginatedCustomers as customer}
            <tr
              class="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
            >
              <td class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="ml-3">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {customer.id}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4">
                <div class="text-xs sm:text-sm text-gray-900 dark:text-white">
                  {customer.email}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customer.phone}
                </div>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                <span
                  class={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                    ${
                      customer.segment === "Premium"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        : customer.segment === "Standard"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                >
                  {customer.segment === "Premium" 
                    ? "Premium" 
                    : customer.segment === "Standard" 
                      ? "Estándar"
                      : "Básico"}
                </span>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                <span
                  class={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                    ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                >
                  {customer.status === "Active" ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class={`h-2 rounded-full ${
                      parseInt(customer.retention) > 85
                        ? "bg-green-500"
                        : parseInt(customer.retention) > 70
                          ? "bg-blue-500"
                          : parseInt(customer.retention) > 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                    style={`width: ${customer.retention}`}
                  ></div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {customer.retention}
                </div>
              </td>
              <td
                class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              >
                {customer.orders}
              </td>
              <td
                class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {customer.spent}
              </td>
              <td
                class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {customer.lastOrder}
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button
                    class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                    title="Ver detalle"
                    aria-label="Ver detalle del cliente"
                  >
                    <Eye class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                    title="Editar"
                    aria-label="Editar cliente"
                  >
                    <Edit class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                    title="Eliminar"
                    aria-label="Eliminar cliente"
                  >
                    <Trash2 class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div
      class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          class="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          Anterior
        </button>
        <button
          class="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-400">
            Mostrando <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a
            <span class="font-medium">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span>
            de <span class="font-medium">{filteredCustomers.length}</span> resultados
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Paginación"
          >
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              on:click={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <span class="sr-only">Anterior</span>
              <ChevronLeft class="h-5 w-5" />
            </button>

            {#each Array(Math.min(5, totalPages)) as _, i}
              {#if currentPage - 2 + i > 0 && currentPage - 2 + i <= totalPages}
                <button
                  class={`relative inline-flex items-center px-4 py-2 border ${currentPage === currentPage - 2 + i ? "bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-300" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"} text-sm font-medium cursor-pointer`}
                  on:click={() => goToPage(currentPage - 2 + i)}
                >
                  {currentPage - 2 + i}
                </button>
              {/if}
            {/each}

            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              on:click={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente"
            >
              <span class="sr-only">Siguiente</span>
              <ChevronRight class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div>
