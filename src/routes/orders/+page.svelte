<script lang="ts">
    import {
        Search,
        Filter,
        Download,
        Eye,
        Trash2,
        MoreHorizontal,
        ChevronLeft,
        ChevronRight,
        ShoppingCart,
        Package,
        TruckIcon,
        CheckCircle,
        XCircle,
        Calendar,
        DollarSign,
        CreditCard,
        TrendingUp,
        AlertCircle,
        Info,
    } from "@lucide/svelte";
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import type { Chart as ChartType, ChartItem } from "chart.js";
    import { fade } from 'svelte/transition';

    // Definir interfaz para los pedidos
    interface Order {
        id: string;
        customer: string;
        customerEmail: string;
        date: string;
        status: string;
        items: number;
        amount: string;
        payment: string;
        shippingAddress: string;
        trackingNumber: string;
        estimatedDelivery: string;
        priority: string;
        notes: string;
    }

    // Datos de muestra de pedidos con información más realista
    const orders: Order[] = [
        {
            id: "#ORD-2025-001",
            customer: "Juan Pérez",
            customerEmail: "juan.perez@example.com",
            date: "2025-03-15",
            status: "Completed",
            items: 3,
            amount: "$1,245.00",
            payment: "Credit Card",
            shippingAddress: "Calle Principal 123, Madrid, 28001",
            trackingNumber: "TRK-2025-789456",
            estimatedDelivery: "2025-03-18",
            priority: "High",
            notes: "Se solicita envoltorio para regalo",
        },
        {
            id: "#ORD-2025-002",
            customer: "María García",
            customerEmail: "maria.garcia@example.com",
            date: "2025-03-14",
            status: "Processing",
            items: 2,
            amount: "$875.50",
            payment: "PayPal",
            shippingAddress: "Avenida Roble 456, Barcelona, 08001",
            trackingNumber: "TRK-2025-123456",
            estimatedDelivery: "2025-03-17",
            priority: "Medium",
            notes: "Cliente solicitó envío express",
        },
        {
            id: "#ORD-2025-003",
            customer: "Roberto Jiménez",
            customerEmail: "roberto.jimenez@example.com",
            date: "2025-03-13",
            status: "Shipped",
            items: 5,
            amount: "$2,750.00",
            payment: "Credit Card",
            shippingAddress: "Calle Pino 789, Valencia, 46001",
            trackingNumber: "TRK-2025-456789",
            estimatedDelivery: "2025-03-16",
            priority: "High",
            notes: "Envío internacional",
        },
        {
            id: "#ORD-2025-004",
            customer: "Elena Martínez",
            customerEmail: "elena.martinez@example.com",
            date: "2025-03-12",
            status: "Pending",
            items: 1,
            amount: "$589.99",
            payment: "Bank Transfer",
            shippingAddress: "Calle Olmo 321, Sevilla, 41001",
            trackingNumber: "TRK-2025-987654",
            estimatedDelivery: "2025-03-15",
            priority: "Low",
            notes: "Esperando confirmación de pago",
        },
        {
            id: "#ORD-2025-005",
            customer: "Miguel Fernández",
            customerEmail: "miguel.fernandez@example.com",
            date: "2025-03-11",
            status: "Cancelled",
            items: 4,
            amount: "$1,432.25",
            payment: "Credit Card",
            shippingAddress: "Avenida Arce 654, Bilbao, 48001",
            trackingNumber: "TRK-2025-321654",
            estimatedDelivery: "2025-03-14",
            priority: "Medium",
            notes: "Cancelado por el cliente",
        },
        {
            id: "#ORD-2025-006",
            customer: "Sara Torres",
            customerEmail: "sara.torres@example.com",
            date: "2025-03-10",
            status: "Shipped",
            items: 2,
            amount: "$915.75",
            payment: "PayPal",
            shippingAddress: "Calle Cedro 987, Málaga, 29001",
            trackingNumber: "TRK-2025-147258",
            estimatedDelivery: "2025-03-13",
            priority: "High",
            notes: "Se requiere firma",
        },
        {
            id: "#ORD-2025-007",
            customer: "David Sánchez",
            customerEmail: "david.sanchez@example.com",
            date: "2025-03-09",
            status: "Processing",
            items: 3,
            amount: "$1,178.50",
            payment: "Credit Card",
            shippingAddress: "Calle Abedul 147, Zaragoza, 50001",
            trackingNumber: "TRK-2025-963852",
            estimatedDelivery: "2025-03-12",
            priority: "Medium",
            notes: "Envío dividido",
        },
        {
            id: "#ORD-2025-008",
            customer: "Jennifer López",
            customerEmail: "jennifer.lopez@example.com",
            date: "2025-03-08",
            status: "Completed",
            items: 1,
            amount: "$759.99",
            payment: "PayPal",
            shippingAddress: "Calle Sauce 258, Alicante, 03001",
            trackingNumber: "TRK-2025-852963",
            estimatedDelivery: "2025-03-11",
            priority: "Low",
            notes: "Entregado correctamente",
        },
    ];

    // Estadísticas de pedidos con información más detallada
    const orderStats = [
        {
            title: "Total Pedidos",
            value: "12,845",
            change: "+15.8%",
            isPositive: true,
            icon: ShoppingCart,
            trend: [65, 75, 85, 90, 95, 100],
            period: "Últimos 6 meses",
        },
        {
            title: "En Proceso",
            value: "342",
            change: "-3.8%",
            isPositive: false,
            icon: Package,
            trend: [30, 35, 32, 28, 25, 22],
            period: "Últimos 6 meses",
        },
        {
            title: "Enviados",
            value: "585",
            change: "+9.1%",
            isPositive: true,
            icon: TruckIcon,
            trend: [45, 50, 55, 60, 65, 70],
            period: "Últimos 6 meses",
        },
        {
            title: "Completados",
            value: "11,918",
            change: "+18.3%",
            isPositive: true,
            icon: CheckCircle,
            trend: [80, 85, 90, 95, 98, 100],
            period: "Últimos 6 meses",
        },
    ];

    // Distribución de métodos de pago
    const paymentMethods = [
        { method: "Tarjeta de Crédito", percentage: 65, amount: "$8,348.25" },
        { method: "PayPal", percentage: 25, amount: "$3,211.25" },
        { method: "Transferencia Bancaria", percentage: 10, amount: "$1,284.50" },
    ];

    // Datos de tendencias mensuales de pedidos
    const monthlyTrends = {
        months: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"],
        completed: [280, 350, 400, 420, 450, 500],
        processing: [45, 50, 42, 35, 40, 35],
        shipped: [80, 90, 95, 100, 110, 125],
        cancelled: [15, 10, 12, 8, 5, 3],
    };

    // Estado de paginación
    let currentPage = 1;
    const totalPages = 5;
    const itemsPerPage = 10;

    // Estado de búsqueda
    let searchQuery = "";

    // Estado de filtros
    let showFilters = false;
    let statusFilter = "All";
    let dateRangeFilter = "All";
    let paymentFilter = "All";
    let priorityFilter = "All";

    // Estado de ordenamiento
    let sortBy = "date";
    let sortOrder = "desc";

    // Instancias de gráficos
    let orderTrendsChart: ChartType;

    // Estado del modal
    let showOrderModal = false;
    let selectedOrder: Order | null = null;

    // Estado para el panel informativo
    let showInfoPanel = false;

    function viewOrderDetails(order: Order): void {
        selectedOrder = order;
        showOrderModal = true;
    }

    function closeOrderModal(): void {
        showOrderModal = false;
        setTimeout(() => {
            selectedOrder = null;
        }, 300);
    }

    function goToPage(page: number): void {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    function toggleFilters() {
        showFilters = !showFilters;
    }

    function getStatusClass(status: string) {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Processing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    }

    function getPriorityClass(priority: string) {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "Medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Low":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    }

    // Filtered and sorted orders
    $: filteredOrders = orders
        .filter((order) => {
            const matchesSearch =
                searchQuery === "" ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                order.customerEmail
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || order.status === statusFilter;
            const matchesPayment =
                paymentFilter === "All" || order.payment === paymentFilter;
            const matchesPriority =
                priorityFilter === "All" || order.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment &&
                matchesPriority
            );
        })
        .sort((a, b) => {
            if (sortBy === "date") {
                return sortOrder === "desc"
                    ? new Date(b.date).getTime() - new Date(a.date).getTime()
                    : new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            if (sortBy === "amount") {
                return sortOrder === "desc"
                    ? parseFloat(b.amount.replace("$", "").replace(",", "")) -
                          parseFloat(a.amount.replace("$", "").replace(",", ""))
                    : parseFloat(a.amount.replace("$", "").replace(",", "")) -
                          parseFloat(
                              b.amount.replace("$", "").replace(",", ""),
                          );
            }
            return 0;
        });

    // Paginated orders
    $: paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    // Función para inicializar gráficos
    function initializeCharts() {
        const orderTrendsCtx = document.getElementById("orderTrendsChart") as HTMLCanvasElement;

        if (orderTrendsCtx) {
            // Destruir gráfico existente si existe
            if (orderTrendsChart) {
                orderTrendsChart.destroy();
            }

            // Crear nuevo gráfico
            orderTrendsChart = new Chart(orderTrendsCtx, {
                type: "line",
                data: {
                    labels: monthlyTrends.months,
                    datasets: [
                        {
                            label: "Completado",
                            data: monthlyTrends.completed,
                            borderColor: "#10B981",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            tension: 0.4,
                            fill: true,
                        },
                        {
                            label: "Enviado",
                            data: monthlyTrends.shipped,
                            borderColor: "#8B5CF6",
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            tension: 0.4,
                            fill: true,
                        },
                        {
                            label: "En proceso",
                            data: monthlyTrends.processing,
                            borderColor: "#3B82F6",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            tension: 0.4,
                            fill: true,
                        },
                        {
                            label: "Cancelado",
                            data: monthlyTrends.cancelled,
                            borderColor: "#EF4444",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "top",
                            labels: {
                                usePointStyle: true,
                                boxWidth: 6,
                            },
                        },
                        tooltip: {
                            mode: "index",
                            intersect: false,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                // Propiedad drawBorder eliminada ya que no está disponible en esta versión
                            },
                        },
                        x: {
                            grid: {
                                display: false,
                            },
                        },
                    },
                    interaction: {
                        mode: "nearest",
                        axis: "x",
                        intersect: false,
                    },
                    elements: {
                        point: {
                            radius: 2,
                            hoverRadius: 4,
                        },
                    },
                },
            });
        }
    }

    // Inicializar gráficos al montar el componente
    onMount(() => {
        // Pequeño retraso para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            initializeCharts();
        }, 100);

        // Limpiar cuando el componente sea destruido
        return () => {
            if (orderTrendsChart) {
                orderTrendsChart.destroy();
            }
        };
    });
</script>

<div class="space-y-6">
    <!-- Cabecera del Panel con Breadcrumb -->
    <div class="mb-8">
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <a href="/" class="hover:text-primary-500 transition-colors cursor-pointer">Panel</a>
            <ChevronRight class="w-4 h-4 mx-2" />
            <span class="text-gray-900 dark:text-gray-200 font-medium">Pedidos</span>
        </div>
        <div class="flex items-center gap-2">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
            <button
                on:click={() => showInfoPanel = !showInfoPanel}
                class="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                title="Mostrar información"
            >
                <Info class="w-5 h-5" />
            </button>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus pedidos y monitoriza su estado en tiempo real
        </p>
    </div>

    <!-- Panel informativo (visible solo cuando se hace clic en el botón de información) -->
    {#if showInfoPanel}
        <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-in fade-in duration-300"
        >
            <div class="flex items-start">
                <ShoppingCart class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Gestión de pedidos
                    </h3>
                    <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>
                            • Visualiza todos los pedidos con su estado actual y detalles.
                        </li>
                        <li>
                            • Filtra pedidos por estado, fecha, método de pago y prioridad.
                        </li>
                        <li>
                            • Accede a información detallada haciendo clic en cada pedido.
                        </li>
                        <li>
                            • Actualiza el estado de los pedidos desde la vista detallada.
                        </li>
                        <li>
                            • Exporta informes de pedidos con el botón "Exportar".
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    {/if}

    <!-- Estadísticas de Pedidos -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each orderStats as stat}
            <div
                class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
                <div class="flex items-center justify-between mb-4">
                    <div
                        class="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg"
                    >
                        <svelte:component
                            this={stat.icon}
                            class="w-6 h-6 text-primary-600 dark:text-primary-400"
                        />
                    </div>
                    <div class="flex items-center gap-1">
                        <TrendingUp class="w-4 h-4 text-green-500" />
                        <span class="text-sm font-medium text-green-500"
                            >{stat.change}</span
                        >
                    </div>
                </div>
                <h3
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                >
                    {stat.title}
                </h3>
                <p
                    class="text-2xl font-semibold text-gray-900 dark:text-white mb-2"
                >
                    {stat.value}
                </p>
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                    <span>{stat.period}</span>
                </div>
            </div>
        {/each}
    </div>

    <!-- Distribución de Métodos de Pago -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
            class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Tendencias de Pedidos
            </h3>
            <div class="h-48 sm:h-64 w-full cursor-pointer">
                <!-- Reemplazar el placeholder con el canvas del gráfico real -->
                <canvas id="orderTrendsChart"></canvas>
            </div>
        </div>
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Métodos de Pago
            </h3>
            <div class="space-y-4">
                {#each paymentMethods as method}
                    <div>
                        <div class="flex justify-between mb-1">
                            <span
                                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {method.method}
                            </span>
                            <span
                                class="text-sm text-gray-600 dark:text-gray-400"
                            >
                                {method.percentage}%
                            </span>
                        </div>
                        <div
                            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                        >
                            <div
                                class="bg-primary-600 h-2 rounded-full"
                                style="width: {method.percentage}%"
                            ></div>
                        </div>
                        <p
                            class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                            {method.amount}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Tabla de Pedidos -->
    <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div class="relative flex-1">
                    <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                        <Search class="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        id="order-search"
                        name="order-search"
                        placeholder="Buscar pedidos por ID, cliente o email..."
                        bind:value={searchQuery}
                        class="w-full py-2 pl-10 pr-4 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        autocomplete="off"
                    />
                </div>
                <div class="flex gap-2">
                    <button
                        class="px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        on:click={toggleFilters}
                    >
                        <Filter class="w-4 h-4" />
                        Filtros
                    </button>
                </div>
            </div>

            {#if showFilters}
                <div class="mt-4 p-4 bg-white dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label
                                for="status-filter"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Estado
                            </label>
                            <select
                                id="status-filter"
                                name="status-filter"
                                bind:value={statusFilter}
                                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            >
                                <option value="All">Todos los estados</option>
                                <option value="Completed">Completado</option>
                                <option value="Processing">En proceso</option>
                                <option value="Pending">Pendiente</option>
                                <option value="Shipped">Enviado</option>
                                <option value="Cancelled">Cancelado</option>
                            </select>
                        </div>
                        <div>
                            <label
                                for="payment-filter"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Método de pago
                            </label>
                            <select
                                id="payment-filter"
                                name="payment-filter"
                                bind:value={paymentFilter}
                                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            >
                                <option value="All">Todos los métodos</option>
                                <option value="Credit Card">Tarjeta de crédito</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Bank Transfer">Transferencia bancaria</option>
                            </select>
                        </div>
                        <div>
                            <label
                                for="priority-filter"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Prioridad
                            </label>
                            <select
                                id="priority-filter"
                                name="priority-filter"
                                bind:value={priorityFilter}
                                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            >
                                <option value="All">Todas las prioridades</option>
                                <option value="High">Alta</option>
                                <option value="Medium">Media</option>
                                <option value="Low">Baja</option>
                            </select>
                        </div>
                        <div>
                            <label
                                for="date-range"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Rango de fechas
                            </label>
                            <select
                                id="date-range"
                                name="date-range"
                                bind:value={dateRangeFilter}
                                class="w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            >
                                <option value="All">Todo el tiempo</option>
                                <option value="Today">Hoy</option>
                                <option value="Yesterday">Ayer</option>
                                <option value="Last7Days">Últimos 7 días</option>
                                <option value="Last30Days">Últimos 30 días</option>
                                <option value="ThisMonth">Este mes</option>
                                <option value="LastMonth">Mes pasado</option>
                            </select>
                        </div>
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
                        <th class="px-3 sm:px-6 py-3 sm:py-4">ID Pedido</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Cliente</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Fecha</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Estado</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Prioridad</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Artículos</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Importe</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4">Pago</th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    {#each paginatedOrders as order}
                        <tr
                            class="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                        >
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div
                                    class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    {order.id}
                                </div>
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4">
                                <div
                                    class="text-xs sm:text-sm text-gray-900 dark:text-white"
                                >
                                    {order.customer}
                                </div>
                                <div
                                    class="text-xs text-gray-500 dark:text-gray-400"
                                >
                                    {order.customerEmail}
                                </div>
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div
                                    class="text-xs sm:text-sm text-gray-900 dark:text-white"
                                >
                                    {order.date}
                                </div>
                                <div
                                    class="text-xs text-gray-500 dark:text-gray-400"
                                >
                                    Est. Entrega: {order.estimatedDelivery}
                                </div>
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <span
                                    class={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                                        order.status,
                                    )}`}
                                >
                                    {order.status === "Completed" ? "Completado" : 
                                     order.status === "Processing" ? "En proceso" : 
                                     order.status === "Pending" ? "Pendiente" : 
                                     order.status === "Shipped" ? "Enviado" : 
                                     order.status === "Cancelled" ? "Cancelado" : 
                                     order.status}
                                </span>
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <span
                                    class={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(
                                        order.priority,
                                    )}`}
                                >
                                    {order.priority === "High" ? "Alta" : 
                                     order.priority === "Medium" ? "Media" : 
                                     order.priority === "Low" ? "Baja" : 
                                     order.priority}
                                </span>
                            </td>
                            <td
                                class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                            >
                                {order.items}
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div
                                    class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    {order.amount}
                                </div>
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div class="flex items-center gap-1 sm:gap-2">
                                    <CreditCard class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                    <span
                                        class="text-xs sm:text-sm text-gray-900 dark:text-white"
                                    >
                                        {order.payment}
                                    </span>
                                </div>
                            </td>
                            <td
                                class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm"
                            >
                                <div class="flex justify-end space-x-1 sm:space-x-2">
                                    <button
                                        class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                                        title="Ver"
                                        on:click={() => viewOrderDetails(order)}
                                        aria-label="Ver detalles del pedido"
                                    >
                                        <Eye
                                            class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400"
                                        />
                                    </button>
                                    <button
                                        class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                                        title="Editar"
                                        aria-label="Editar pedido"
                                    >
                                        <Trash2
                                            class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400"
                                        />
                                    </button>
                                    <button
                                        class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                                        title="Eliminar"
                                        aria-label="Eliminar pedido"
                                    >
                                        <MoreHorizontal
                                            class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400"
                                        />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div
            class="px-6 py-3 sm:py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700"
        >
            <div class="flex-1 flex justify-between sm:hidden">
                <button
                    class="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    on:click={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                >
                    Anterior
                </button>
                <button
                    class="ml-3 relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    on:click={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                >
                    Siguiente
                </button>
            </div>
            <div
                class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
                <div>
                    <p class="text-sm text-gray-700 dark:text-gray-400">
                        Mostrando
                        <span class="font-medium"
                            >{(currentPage - 1) * itemsPerPage + 1}</span
                        >
                        a
                        <span class="font-medium">
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredOrders.length,
                            )}
                        </span>
                        de
                        <span class="font-medium">{filteredOrders.length}</span>
                        resultados
                    </p>
                </div>
                <div>
                    <nav
                        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
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
                                    class={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                                        currentPage === currentPage - 2 + i
                                            ? "z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-300"
                                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                    on:click={() =>
                                        goToPage(currentPage - 2 + i)}
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

    <!-- Modal de detalles del pedido -->
    {#if showOrderModal}
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 200 }}>
            <div 
                class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                transition:fade={{ duration: 150, delay: 50 }}
            >
                <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                        Detalles del Pedido
                    </h3>
                    <button 
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        on:click={closeOrderModal}
                        aria-label="Cerrar modal"
                    >
                        <XCircle class="w-6 h-6" />
                    </button>
                </div>
                
                {#if selectedOrder}
                <div class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Información del Pedido</h4>
                            <div class="space-y-3">
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">ID del Pedido</p>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">{selectedOrder.date}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                                    <span
                                        class={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                                            selectedOrder.status,
                                        )}`}
                                    >
                                        {selectedOrder.status === "Completed" ? "Completado" : 
                                         selectedOrder.status === "Processing" ? "En proceso" : 
                                         selectedOrder.status === "Pending" ? "Pendiente" : 
                                         selectedOrder.status === "Shipped" ? "Enviado" : 
                                         selectedOrder.status === "Cancelled" ? "Cancelado" : 
                                         selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Prioridad</p>
                                    <span
                                        class={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(
                                            selectedOrder.priority,
                                        )}`}
                                    >
                                        {selectedOrder.priority === "High" ? "Alta" : 
                                         selectedOrder.priority === "Medium" ? "Media" : 
                                         selectedOrder.priority === "Low" ? "Baja" : 
                                         selectedOrder.priority}
                                    </span>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">{selectedOrder.amount}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Método de Pago</p>
                                    <div class="flex items-center gap-2">
                                        <CreditCard class="w-4 h-4 text-gray-400" />
                                        <p class="text-base text-gray-900 dark:text-white">{selectedOrder.payment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Información del Cliente</h4>
                            <div class="space-y-3">
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">{selectedOrder.customer}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p class="text-base text-gray-900 dark:text-white">{selectedOrder.customerEmail}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Dirección de Envío</p>
                                    <p class="text-base text-gray-900 dark:text-white">{selectedOrder.shippingAddress}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Número de Seguimiento</p>
                                    <p class="text-base text-gray-900 dark:text-white">{selectedOrder.trackingNumber}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Fecha Estimada de Entrega</p>
                                    <p class="text-base text-gray-900 dark:text-white">{selectedOrder.estimatedDelivery}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notas</h4>
                        <p class="text-base text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{selectedOrder.notes}</p>
                    </div>
                </div>
                
                <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button 
                        class="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        on:click={closeOrderModal}
                        aria-label="Cerrar modal"
                    >
                        Cerrar
                    </button>
                    <button 
                        class="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                        aria-label="Editar pedido"
                    >
                        Editar Pedido
                    </button>
                </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
