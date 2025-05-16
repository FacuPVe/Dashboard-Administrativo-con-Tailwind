<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import type { ChartItem, TooltipItem } from "chart.js";
  import {
    DollarSign,
    ShoppingCart,
    Users,
    TrendingUp,
    Eye,
    Download,
    RefreshCw,
    Info,
    ChevronRight,
  } from "@lucide/svelte";
  import { showToast } from "$lib/components/Toast.svelte";
  import SkeletonLoader from "$lib/components/SkeletonLoader.svelte";
  import WelcomeGuide from "$lib/components/WelcomeGuide.svelte";

  // Definir interfaz para objetos de gráficos
  interface ChartObjects {
    [key: string]: Chart;
  }

  let charts: ChartObjects = {};
  let isLoading = true;
  let chartInitialized = false;
  let showInfoPanel = false; // Estado para controlar la visibilidad del panel informativo

  // Variable para controlar si el componente está montado
  let isMounted = false;

  // Variables para los controles de gráficos
  let salesViewMode = "yearly";
  let timeRange = "last6Months";
  let activeChartType = "bar"; // Para el gráfico de actividad de usuarios
  let selectedYear = "2024";

  // Agregar opciones comunes de Chart.js para mejorar la visualización
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as "index",
      intersect: false,
    },
    animation: {
      duration: 400,
      easing: "easeOutQuad" as "easeOutQuad",
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            weight: 500
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 6,
        boxPadding: 3,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        displayColors: true,
        caretPadding: 5,
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              // Si es un gráfico monetario, mostramos el símbolo de $
              if (
                (context.dataset.label?.includes("Ingresos")) ||
                context.dataset.label?.includes("Ventas")
              ) {
                label += "$" + context.parsed.y.toLocaleString();
              } else {
                label += context.parsed.y.toLocaleString();
              }
            }
            return label;
          },
        },
      },
    },
  };

  // Mejorar datos de ventas con colores más atractivos y datos de 2023-2025
  const salesData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ventas 2025",
        data: [75, 82, 90, 105, 115, 125, 135, 148, 160, 175, 190, 205],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Ventas 2024",
        data: [50, 60, 65, 75, 85, 95, 105, 115, 125, 140, 155, 170],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Ventas 2023",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 110, 120, 140],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: true,
      },
    ],
  };

  // Mejorar datos de ingresos para barras con gradientes
  const revenueData = {
    labels: ["2023", "2024", "2025"],
    datasets: [
      {
        label: "T1",
        data: [35000, 48500, 67000],
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Azul
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 6,
        hoverOffset: 6,
      },
      {
        label: "T2",
        data: [42000, 57500, 78000],
        backgroundColor: "rgba(14, 165, 233, 0.7)", // Azul claro
        borderColor: "rgb(14, 165, 233)",
        borderWidth: 1,
        borderRadius: 6,
        hoverOffset: 6,
      },
      {
        label: "T3",
        data: [51000, 69000, 85000],
        backgroundColor: "rgba(16, 185, 129, 0.7)", // Verde
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 6,
        hoverOffset: 6,
      },
      {
        label: "T4",
        data: [58000, 75000, 92000],
        backgroundColor: "rgba(245, 158, 11, 0.7)", // Naranja
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1,
        borderRadius: 6,
        hoverOffset: 6,
      },
    ],
  };

  // Mejorar datos de usuarios activos para 2023-2025
  const userActivityData = {
    labels: ["2023", "2024", "2025"],
    datasets: [
      {
        label: "Usuarios Activos",
        data: [15000, 26500, 42000],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(79, 70, 229)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: "flex" as const,
        maxBarThickness: 40,
        hoverBackgroundColor: "rgba(79, 70, 229, 0.9)",
      },
      {
        label: "Nuevos Registros",
        data: [8500, 14000, 21000],
        backgroundColor: "rgba(168, 85, 247, 0.7)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: "flex" as const,
        maxBarThickness: 40,
        hoverBackgroundColor: "rgba(147, 51, 234, 0.9)",
      },
    ],
  };

  // Datos del tráfico por fuente para 2023, 2024, y 2025
  const trafficSourceData = {
    2023: {
      labels: [
        "Búsqueda orgánica",
        "Redes sociales",
        "Referencia directa",
        "Email",
        "Otros",
      ],
      data: [32, 27, 18, 15, 8],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)", // Azul
        "rgba(16, 185, 129, 0.7)", // Verde
        "rgba(245, 158, 11, 0.7)", // Ámbar
        "rgba(99, 102, 241, 0.7)", // Índigo
        "rgba(209, 213, 219, 0.7)", // Gris
      ],
      detalle: [
        { crecimiento: "+5.2%", visitas: "384,000", conversion: "3.8%" },
        { crecimiento: "+12.4%", visitas: "324,000", conversion: "2.7%" },
        { crecimiento: "+1.8%", visitas: "216,000", conversion: "4.2%" },
        { crecimiento: "+3.5%", visitas: "180,000", conversion: "3.1%" },
        { crecimiento: "-0.8%", visitas: "96,000", conversion: "1.2%" },
      ],
    },
    2024: {
      labels: [
        "Búsqueda orgánica",
        "Redes sociales",
        "Referencia directa",
        "Email",
        "Otros",
      ],
      data: [35, 30, 15, 12, 8],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(99, 102, 241, 0.7)",
        "rgba(209, 213, 219, 0.7)",
      ],
      detalle: [
        { crecimiento: "+8.5%", visitas: "525,000", conversion: "4.2%" },
        { crecimiento: "+15.6%", visitas: "450,000", conversion: "3.5%" },
        { crecimiento: "-3.2%", visitas: "225,000", conversion: "4.5%" },
        { crecimiento: "+1.3%", visitas: "180,000", conversion: "3.8%" },
        { crecimiento: "+0.2%", visitas: "120,000", conversion: "1.5%" },
      ],
    },
    2025: {
      labels: [
        "Búsqueda orgánica",
        "Redes sociales",
        "Referencia directa",
        "Email",
        "Otros",
      ],
      data: [38, 32, 12, 10, 8],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(99, 102, 241, 0.7)",
        "rgba(209, 213, 219, 0.7)",
      ],
      detalle: [
        { crecimiento: "+7.2%", visitas: "684,000", conversion: "4.8%" },
        { crecimiento: "+11.2%", visitas: "576,000", conversion: "4.1%" },
        { crecimiento: "-1.5%", visitas: "216,000", conversion: "4.7%" },
        { crecimiento: "+2.8%", visitas: "180,000", conversion: "4.2%" },
        { crecimiento: "+3.1%", visitas: "144,000", conversion: "2.0%" },
      ],
    },
  };

  // Información de ejemplo para las tarjetas de estadísticas
  const stats = [
    {
      title: "Ingresos Totales",
      value: "$54,350",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Ventas Totales",
      value: "2,450",
      change: "+18.2%",
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: "Nuevos Clientes",
      value: "854",
      change: "+9.1%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Tasa de Conversión",
      value: "3.2%",
      change: "-2.4%",
      isPositive: false,
      icon: TrendingUp,
    },
  ];

  // Datos de pedidos recientes
  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Juan Pérez",
      date: "2023-04-12",
      status: "Completado",
      amount: "$345.00",
    },
    {
      id: "#ORD-002",
      customer: "Ana García",
      date: "2023-04-11",
      status: "Procesando",
      amount: "$125.50",
    },
    {
      id: "#ORD-003",
      customer: "Roberto Gómez",
      date: "2023-04-10",
      status: "Completado",
      amount: "$750.00",
    },
    {
      id: "#ORD-004",
      customer: "Elena Martínez",
      date: "2023-04-09",
      status: "Pendiente",
      amount: "$89.99",
    },
    {
      id: "#ORD-005",
      customer: "Miguel Fernández",
      date: "2023-04-08",
      status: "Cancelado",
      amount: "$432.25",
    },
  ];

  onMount(() => {
    // Marcar componente como montado
    isMounted = true;
    console.log("Dashboard component mounted");

    // Simular carga de datos
    isLoading = true;
    setTimeout(() => {
      // Verificar que el componente siga montado
      if (!isMounted) return;
      
      isLoading = false;

      // Inicializar gráficos después de carga
      setTimeout(() => {
        // Verificar nuevamente que el componente siga montado
        if (!isMounted) return;
        
        initializeCharts();
      }, 100);
    }, 800);

    // Función de limpieza al desmontar
    return () => {
      // Marcar componente como desmontado
      isMounted = false;
      
      // Destruir todos los gráficos al desmontar
      Object.values(charts).forEach((chart) => {
        if (chart) {
          try {
            chart.destroy();
          } catch (e) {
            console.error("Error al destruir gráfico:", e);
          }
        }
      });
    };
  });

  /**
   * Inicializa los gráficos en el componente.
   * Verifica que el componente esté montado antes de proceder.
   */
  function initializeCharts() {
    // Verificar si el componente sigue montado
    if (!isMounted) {
      console.log("No se inicializan los gráficos porque el componente ya no está montado");
      return;
    }
    
    try {
      console.log("Inicializando gráficos...");

      const salesTrendCtx = document.getElementById(
        "salesTrendChart",
      ) as HTMLCanvasElement | null;

      if (salesTrendCtx && isMounted) {
        console.log("Canvas de ventas encontrado");
        charts.salesTrend = new Chart(salesTrendCtx, {
          type: "line",
          data: salesData,
          options: {
            ...chartDefaults,
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                  callback: function (tickValue: string | number) {
                    return "$" + Number(tickValue).toLocaleString();
                  },
                },
              },
            },
            plugins: {
              ...chartDefaults.plugins,
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  ...chartDefaults.plugins.tooltip.callbacks,
                  title: function (tooltipItems) {
                    return "Ventas: " + tooltipItems[0].label;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas de ventas no encontrado");
      }

      // Verificar de nuevo si el componente sigue montado
      if (!isMounted) return;

      const revenueChartCtx = document.getElementById(
        "revenueChart",
      ) as HTMLCanvasElement | null;

      if (revenueChartCtx && isMounted) {
        console.log("Canvas de ingresos encontrado");
        charts.revenue = new Chart(revenueChartCtx, {
          type: "bar",
          data: revenueData,
          options: {
            ...chartDefaults,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  callback: function (tickValue: string | number) {
                    return "$" + Number(tickValue).toLocaleString();
                  },
                },
              },
            },
            plugins: {
              ...chartDefaults.plugins,
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += "$" + context.parsed.y.toLocaleString();
                    }
                    return label;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas de ingresos no encontrado");
      }

      // Verificar de nuevo si el componente sigue montado
      if (!isMounted) return;

      const userActivityCtx = document.getElementById(
        "userActivityChart",
      ) as HTMLCanvasElement | null;

      if (userActivityCtx && isMounted) {
        console.log("Canvas de actividad de usuarios encontrado");
        charts.userActivity = new Chart(userActivityCtx, {
          type: "bar",
          data: userActivityData,
          options: {
            ...chartDefaults,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  callback: function (tickValue: string | number) {
                    return Number(tickValue).toLocaleString();
                  },
                },
              },
            },
            plugins: {
              ...chartDefaults.plugins,
            },
          },
        });
      } else {
        console.error("Canvas de actividad de usuarios no encontrado");
      }

      // Verificar de nuevo si el componente sigue montado
      if (!isMounted) return;

      const trafficSourceCtx = document.getElementById(
        "trafficSourceChart",
      ) as HTMLCanvasElement | null;

      if (trafficSourceCtx && isMounted) {
        console.log("Canvas de fuentes de tráfico encontrado");
        charts.trafficSource = new Chart(trafficSourceCtx, {
          type: "doughnut",
          data: {
            labels: trafficSourceData[selectedYear as "2023" | "2024" | "2025"].labels,
            datasets: [
              {
                data: trafficSourceData[selectedYear as "2023" | "2024" | "2025"].data,
                backgroundColor:
                  trafficSourceData[selectedYear as "2023" | "2024" | "2025"].backgroundColor,
                borderWidth: 0,
                hoverOffset: 15,
              },
            ],
          },
          options: {
            ...chartDefaults,
            cutout: "70%",
            plugins: {
              ...chartDefaults.plugins,
              legend: {
                position: "right",
                labels: {
                  padding: 15,
                  usePointStyle: true,
                  pointStyle: "circle",
                },
              },
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce(
                      (acc: number, data: number) => acc + data,
                      0,
                    );
                    const percentage = Math.round((value * 100) / total) + "%";
                    return `${label}: ${percentage} (${value.toLocaleString()})`;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas de fuentes de tráfico no encontrado");
      }

      if (isMounted) {
        chartInitialized = true;
        console.log("Gráficos inicializados correctamente");
      }
    } catch (error) {
      console.error("Error al inicializar los gráficos:", error);
    }
  }

  /**
   * Actualiza los datos en el componente.
   * Verifica que el componente esté montado antes de continuar.
   */
  function refreshData() {
    // Verificar que el componente esté montado antes de actualizar
    if (!isMounted) return;
    
    isLoading = true;
    showToast("Actualizando datos...", "info");

    // Limpiar gráficos existentes
    if (chartInitialized) {
      Object.values(charts).forEach((chart) => {
        if (chart) chart.destroy();
      });
      charts = {};
      chartInitialized = false;
    }

    setTimeout(() => {
      // Verificar nuevamente que el componente siga montado
      if (!isMounted) return;
      
      isLoading = false;
      // Esperamos a que el DOM se actualice
      setTimeout(() => {
        // Verificar nuevamente que el componente siga montado
        if (!isMounted) return;
        
        initializeCharts();
      }, 100); // Aumentamos el tiempo a 100ms para dar más margen al DOM
      showToast("Datos actualizados correctamente", "success");
    }, 1500);
  }

  /**
   * Exporta los datos a un archivo Excel.
   * Simula la generación de un archivo y descarga.
   */
  function exportData() {
    showToast("Preparando exportación de datos...", "info");

    try {
      // Simulamos la generación de un archivo Excel
      setTimeout(() => {
        const dataType = "data:application/vnd.ms-excel;charset=utf-8";

        // Creamos una tabla HTML con los datos
        let tableHTML =
          "<table><tr><th>Mes</th><th>Ventas 2025</th><th>Ventas 2024</th><th>Ventas 2023</th></tr>";

        // Añadimos datos de ventas
        salesData.labels.forEach((month, index) => {
          tableHTML += `<tr>
            <td>${month}</td>
            <td>${salesData.datasets[0].data[index]}</td>
            <td>${salesData.datasets[1].data[index]}</td>
            <td>${salesData.datasets[2].data[index]}</td>
          </tr>`;
        });

        tableHTML += "</table>";

        // Creamos un elemento de enlace temporal para la descarga
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = `${dataType},${encodeURIComponent(tableHTML)}`;
        link.download =
          "dashboard_data_" + new Date().toISOString().slice(0, 10) + ".xls";
        link.click();

        // Limpiamos
        document.body.removeChild(link);

        showToast("Datos exportados correctamente", "success");
      }, 1500);
    } catch (error) {
      console.error("Error al exportar datos:", error);
      showToast("Error al exportar datos", "error");
    }
  }

  /**
   * Descarga la imagen del gráfico especificado.
   * @param chartId - El ID del gráfico a descargar.
   * @param filename - El nombre del archivo para la descarga.
   */
  function downloadChartImage(chartId: string, filename: string) {
    const chart = charts[chartId];
    if (!chart) {
      showToast("No se pudo encontrar el gráfico seleccionado", "error");
      return;
    }

    try {
      // Obtener URL de la imagen del canvas
      const canvas = chart.canvas;
      const dataUrl = canvas.toDataURL("image/png");

      // Crear enlace temporal y descargar
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename || "chart.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("Imagen descargada correctamente", "success");
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      showToast("Error al descargar la imagen", "error");
    }
  }

  /**
   * Cambia la vista de ventas entre semanal, mensual y anual.
   * @param mode - El modo de vista a establecer.
   */
  function toggleSalesView(mode: string) {
    salesViewMode = mode;

    // Modificar los datos según el modo
    if (salesViewMode === "monthly") {
      // Vista mensual - últimos 30 días
      charts.salesTrend.data.labels = ["1", "5", "10", "15", "20", "25", "30"];
      charts.salesTrend.data.datasets[0].data = [75, 80, 85, 90, 95, 100, 105];
      charts.salesTrend.data.datasets[0].label = "Ventas (Últimos 30 días)";
      // Ocultar datasets de comparación
      charts.salesTrend.data.datasets[1].hidden = true;
      charts.salesTrend.data.datasets[2].hidden = true;
    } else if (salesViewMode === "yearly") {
      // Vista anual - comparación año a año
      charts.salesTrend.data.labels = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      // Restaurar datos originales
      charts.salesTrend.data.datasets[0].data = salesData.datasets[0].data;
      charts.salesTrend.data.datasets[0].label = "Ventas 2025";
      charts.salesTrend.data.datasets[1].data = salesData.datasets[1].data;
      charts.salesTrend.data.datasets[1].label = "Ventas 2024";
      charts.salesTrend.data.datasets[2].data = salesData.datasets[2].data;
      charts.salesTrend.data.datasets[2].label = "Ventas 2023";

      // Por defecto, mostrar solo el año activo seleccionado
      const yearIndex = {
        "2025": 0,
        "2024": 1,
        "2023": 2,
      };

      // Mostrar solo el dataset del año seleccionado
      charts.salesTrend.data.datasets.forEach((dataset, index) => {
        if (index === yearIndex[selectedYear as keyof typeof yearIndex]) {
          dataset.hidden = false;
        } else {
          dataset.hidden = true;
        }
      });
    } else if (salesViewMode === "weekly") {
      // Vista semanal - últimos 7 días
      charts.salesTrend.data.labels = [
        "Lun",
        "Mar",
        "Mié",
        "Jue",
        "Vie",
        "Sáb",
        "Dom",
      ];
      charts.salesTrend.data.datasets[0].data = [65, 70, 75, 72, 80, 85, 82];
      charts.salesTrend.data.datasets[0].label = "Ventas (Última semana)";
      // Ocultar datasets de comparación
      charts.salesTrend.data.datasets[1].hidden = true;
      charts.salesTrend.data.datasets[2].hidden = true;
    }

    // Actualizar el gráfico
    charts.salesTrend.update();
    showToast(`Vista de ventas actualizada: ${mode}`, "info");
  }

  /**
   * Cambia el rango de tiempo para el gráfico de ingresos.
   * @param range - El rango de tiempo a establecer.
   */
  function changeTimeRange(range: string) {
    timeRange = range;

    // Actualizar el gráfico de ingresos
    if (charts.revenue) {
      let labels = [];
      let datasets = [];

      if (range === "ytd") {
        // Year-to-date (primer semestre)
        labels = ["2023 H1", "2024 H1", "2025 H1"];
        datasets = [
          {
            label: "T1",
            data: [35000, 48500, 67000],
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: "T2",
            data: [42000, 57500, 78000],
            backgroundColor: "rgba(14, 165, 233, 0.7)",
            borderColor: "rgb(14, 165, 233)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ];
      } else if (range === "q1") {
        // Solo Q1
        labels = ["2023 Q1", "2024 Q1", "2025 Q1"];
        datasets = [
          {
            label: "T1",
            data: [35000, 48500, 67000],
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ];
      } else if (range === "q2") {
        // Solo Q2
        labels = ["2023 Q2", "2024 Q2", "2025 Q2"];
        datasets = [
          {
            label: "T2",
            data: [42000, 57500, 78000],
            backgroundColor: "rgba(14, 165, 233, 0.7)",
            borderColor: "rgb(14, 165, 233)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ];
      } else if (range === "last12Months") {
        // Comparación anual
        labels = ["2023", "2024", "2025"];
        datasets = [
          {
            label: "Total Anual",
            data: [186000, 250000, 322000],
            backgroundColor: "rgba(99, 102, 241, 0.7)",
            borderColor: "rgb(99, 102, 241)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ];
      } else {
        // Vista por trimestres (default)
        labels = ["2023", "2024", "2025"];
        datasets = revenueData.datasets;
      }

      // Actualizar datos del gráfico
      charts.revenue.data.labels = labels;
      charts.revenue.data.datasets = datasets;
      charts.revenue.update();
    }

    showToast(`Rango de tiempo actualizado: ${range}`, "info");
  }

  /**
   * Cambia el tipo de gráfico para la actividad de usuarios.
   * @param type - El tipo de gráfico a establecer (bar, line, area).
   */
  function changeChartType(type: string) {
    activeChartType = type;

    // Guardar datos actuales
    const currentData = {
      labels: charts.userActivity.data.labels,
      datasets: charts.userActivity.data.datasets,
    };

    // Destruir el gráfico actual
    charts.userActivity.destroy();

    // Crear un nuevo gráfico con el tipo seleccionado
    const userActivityCtx = document.getElementById(
      "userActivityChart",
    ) as HTMLCanvasElement;

    if (userActivityCtx) {
      charts.userActivity = new Chart(userActivityCtx, {
        type: type as any, // 'bar', 'line', o 'area'
        data: {
          labels: currentData.labels,
          datasets:
            type === "line"
              ? [
                  {
                    ...currentData.datasets[0],
                    type: "line",
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: "rgba(99, 102, 241, 1)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  },
                  {
                    ...currentData.datasets[1],
                    type: "line",
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: "rgba(168, 85, 247, 1)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  },
                ]
              : type === "area"
                ? [
                    {
                      ...currentData.datasets[0],
                      type: "line",
                      fill: true,
                      tension: 0.4,
                      borderWidth: 2,
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                      pointBackgroundColor: "rgba(99, 102, 241, 1)",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                    {
                      ...currentData.datasets[1],
                      type: "line",
                      fill: true,
                      tension: 0.4,
                      borderWidth: 2,
                      backgroundColor: "rgba(168, 85, 247, 0.2)",
                      pointBackgroundColor: "rgba(168, 85, 247, 1)",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ]
                : currentData.datasets,
        },
        options: {
          ...chartDefaults,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                callback: function (tickValue: string | number) {
                  return Number(tickValue).toLocaleString();
                },
              },
            },
          },
          plugins: {
            ...chartDefaults.plugins,
          },
        },
      });
    }

    showToast(`Tipo de gráfico actualizado: ${type}`, "info");
  }

  /**
   * Cambia el año para los gráficos de ventas y tráfico.
   * @param year - El año a establecer (2023, 2024, 2025).
   */
  function changeYear(year: "2023" | "2024" | "2025") {
    selectedYear = year;

    // Actualizar la visibilidad de los datasets para ventas
    if (charts.salesTrend) {
      const yearIndex = {
        "2025": 0,
        "2024": 1,
        "2023": 2,
      };

      // Mostrar solo el dataset del año seleccionado y ocultar los demás
      charts.salesTrend.data.datasets.forEach((dataset, index) => {
        if (index === yearIndex[year as keyof typeof yearIndex]) {
          dataset.hidden = false;
        } else {
          dataset.hidden = true;
        }
      });
      charts.salesTrend.update();
    }

    // Actualizar el gráfico de fuentes de tráfico con los datos del año seleccionado
    if (charts.trafficSource) {
      const yearData = trafficSourceData[year];
      charts.trafficSource.data.labels = yearData.labels;
      charts.trafficSource.data.datasets[0].data = yearData.data;
      charts.trafficSource.data.datasets[0].backgroundColor =
        yearData.backgroundColor;
      charts.trafficSource.update();
    }

    showToast(`Datos actualizados para el año ${year}`, "info");
  }
</script>

<div>
  <!-- Dashboard Header -->
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
  >
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button
          on:click={() => showInfoPanel = !showInfoPanel}
          class="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
          title="Mostrar información"
          type="button"
          name="info"
        >
          <Info class="w-5 h-5" />
        </button>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Vista general del rendimiento de tu negocio
      </p>
    </div>
    <div class="flex gap-2">
      <button
        on:click={refreshData}
        class="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors duration-200 cursor-pointer"
        title="Actualizar datos"
        type="button"
        name="refresh"
      >
        <RefreshCw class="w-4 h-4" />
        Actualizar
      </button>
      <button
        on:click={exportData}
        class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center gap-2 transition-colors duration-200 cursor-pointer"
        title="Exportar datos"
        type="button"
        name="export"
      >
        <Download class="w-4 h-4" />
        Exportar
      </button>
    </div>
  </div>

  <!-- Panel informativo (visible solo cuando se hace clic en el botón de información) -->
  {#if showInfoPanel}
    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-in fade-in duration-300"
    >
      <div class="flex items-start">
        <Info class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
            Funcionalidades de los gráficos
          </h3>
          <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              • Cambia entre diferentes vistas (semanal, mensual, anual) para
              analizar tendencias.
            </li>
            <li>
              • Filtra por año o período específico para un análisis más detallado.
            </li>
            <li>
              • Cambia el tipo de gráfico para diferentes visualizaciones de los
              mismos datos.
            </li>
            <li>
              • Descarga imágenes de cada gráfico usando el botón de descarga.
            </li>
            <li>
              • Exporta todos los datos a Excel usando el botón "Exportar" en la
              parte superior.
            </li>
          </ul>
        </div>
      </div>
    </div>
  {/if}

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {#if isLoading}
      {#each Array(4) as _}
        <SkeletonLoader type="card" height="h-32" />
      {/each}
    {:else}
      {#each stats as stat}
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px] cursor-pointer"
        >
          <div class="flex justify-between">
            <div
              class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-400"
            >
              <svelte:component this={stat.icon} class="w-6 h-6" />
            </div>
            <div
              class={`px-2 py-1 text-xs rounded-full flex items-center ${stat.isPositive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
            >
              {stat.change}
            </div>
          </div>
          <p class="mt-4 text-2xl font-semibold">{stat.value}</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <!-- Tendencia de Ventas -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Tendencia de Ventas</h2>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 text-xs">
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${salesViewMode === "weekly" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => toggleSalesView("weekly")}
              type="button"
              name="weekly"
            >
              Sem
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${salesViewMode === "monthly" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => toggleSalesView("monthly")}
              type="button"
              name="monthly"
            >
              Mes
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${salesViewMode === "yearly" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => toggleSalesView("yearly")}
              type="button"
              name="yearly"
            >
              Año
            </button>
          </div>
          <select
            class="bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-xs p-1.5 sm:p-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            bind:value={selectedYear}
            on:change={() => changeYear(selectedYear as "2023" | "2024" | "2025")}
            aria-label="Seleccionar año"
            title="Seleccionar año"
            id="year-selector"
            name="year-selector"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button
            class="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() =>
              downloadChartImage("salesTrend", "ventas_tendencia.png")}
            title="Descargar imagen de tendencia de ventas"
            type="button"
            name="salesTrend"
          >
            <Download class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="h-64 relative cursor-pointer">
          <canvas id="salesTrendChart" width="400" height="200"></canvas>
        </div>
      {/if}
    </div>

    <!-- Distribución de Ingresos -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Distribución de Ingresos</h2>
        <div class="flex items-center gap-2">
          <select
            class="cursor-pointer bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-xs p-1.5 sm:p-2 focus:ring-primary-500 focus:outline-none"
            bind:value={timeRange}
            on:change={() => changeTimeRange(timeRange)}
            aria-label="Seleccionar período de tiempo"
            title="Seleccionar período de tiempo"
            id="time-range-selector"
            name="time-range-selector"
          >
            <option value="last6Months">Últimos 6 meses</option>
            <option value="last12Months">Últimos 12 meses</option>
            <option value="ytd">Año hasta la fecha</option>
            <option value="q1">T1 2023-2025</option>
            <option value="q2">T2 2023-2025</option>
          </select>
          <button
            class="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() => downloadChartImage("revenue", "ingresos.png")}
            title="Descargar imagen de ingresos"
            type="button"
            name="revenue"
          >
            <Download class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="h-64 relative cursor-pointer">
          <canvas id="revenueChart" width="400" height="200"></canvas>
        </div>
      {/if}
    </div>

    <!-- Actividad de Usuarios -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Actividad de Usuarios</h2>
        <div class="flex items-center gap-2">
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 text-xs">
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${activeChartType === "bar" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeChartType("bar")}
              type="button"
              name="chart-bar"
            >
              Barras
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${activeChartType === "line" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeChartType("line")}
              type="button"
              name="chart-line"
            >
              Línea
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${activeChartType === "area" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeChartType("area")}
              type="button"
              name="chart-area"
            >
              Área
            </button>
          </div>
          <button
            class="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() =>
              downloadChartImage("userActivity", "actividad_usuarios.png")}
            title="Descargar imagen de actividad de usuarios"
            type="button"
            name="userActivity"
          >
            <Download class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="h-64 relative cursor-pointer">
          <canvas id="userActivityChart" width="400" height="200"></canvas>
        </div>
      {/if}
    </div>

    <!-- Fuentes de Tráfico -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Fuentes de Tráfico</h2>
        <div class="flex items-center gap-2">
          <div
            class="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md font-medium"
          >
            <span class="text-primary-500">Total: </span>
            <span>
              {#if selectedYear === "2023"}
                1,200,000 visitas
              {:else if selectedYear === "2024"}
                1,500,000 visitas
              {:else}
                1,800,000 visitas
              {/if}
            </span>
          </div>
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() =>
              downloadChartImage("trafficSource", "fuentes_trafico.png")}
            title="Descargar imagen de fuentes de tráfico"
            type="button"
            name="trafficSource"
          >
            <Download class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="lg:w-1/2 h-64 relative cursor-pointer">
            <canvas id="trafficSourceChart" width="400" height="200"></canvas>
          </div>
          <div class="lg:w-1/2">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th
                      class="py-2 text-left font-medium text-gray-500 dark:text-gray-400"
                      >Fuente</th
                    >
                    <th
                      class="py-2 text-right font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-4"
                      >Crecimiento</th
                    >
                    <th
                      class="py-2 text-right font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-4"
                      >Visitas</th
                    >
                    <th
                      class="py-2 text-right font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-4"
                      >Conversión</th
                    >
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  {#if trafficSourceData[selectedYear as "2023" | "2024" | "2025"] && trafficSourceData[selectedYear as "2023" | "2024" | "2025"].detalle}
                    {#each trafficSourceData[selectedYear as "2023" | "2024" | "2025"].labels as label, i}
                      <tr
                        class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 cursor-pointer"
                      >
                        <td class="py-2">
                          <div class="flex items-center">
                            <div
                              class="w-3 h-3 rounded-full mr-2"
                              style="background-color: {trafficSourceData[
                                selectedYear as "2023" | "2024" | "2025"
                              ].backgroundColor[i]}"
                            ></div>
                            <span class="truncate max-w-[90px] sm:max-w-full">{label}</span>
                          </div>
                        </td>
                        <td class="py-2 text-right px-2 sm:px-4">
                          <span
                            class={trafficSourceData[selectedYear as "2023" | "2024" | "2025"].detalle[
                              i
                            ].crecimiento.startsWith("+")
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"}
                          >
                            {trafficSourceData[selectedYear as "2023" | "2024" | "2025"].detalle[i]
                              .crecimiento}
                          </span>
                        </td>
                        <td class="py-2 text-right px-2 sm:px-4"
                          >{trafficSourceData[selectedYear as "2023" | "2024" | "2025"].detalle[i]
                            .visitas}</td
                        >
                        <td class="py-2 text-right px-2 sm:px-4"
                          >{trafficSourceData[selectedYear as "2023" | "2024" | "2025"].detalle[i]
                            .conversion}</td
                        >
                      </tr>
                    {/each}
                  {/if}
                </tbody>
              </table>
            </div>
            <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
              * Los datos de crecimiento son comparados con el año anterior
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Tabla de Pedidos Recientes -->
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Pedidos Recientes</h2>
        <a
          href="/orders"
          class="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200 cursor-pointer"
          >Ver todos</a
        >
      </div>
    </div>

    {#if isLoading}
      <SkeletonLoader type="table" repeat={5} />
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
            >
              <th class="px-3 sm:px-6 py-3">ID</th>
              <th class="px-3 sm:px-6 py-3">Cliente</th>
              <th class="px-3 sm:px-6 py-3 hidden sm:table-cell">Fecha</th>
              <th class="px-3 sm:px-6 py-3">Estado</th>
              <th class="px-3 sm:px-6 py-3">Importe</th>
              <th class="px-3 sm:px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each recentOrders as order}
              <tr
                class="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              >
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium"
                  >{order.id}</td
                >
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm"
                  >{order.customer}</td
                >
                <td
                  class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell"
                  >{order.date}</td
                >
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span
                    class={`px-2 py-1 text-xs rounded-full ${order.status === "Completado" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : order.status === "Procesando" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : order.status === "Pendiente" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm"
                  >{order.amount}</td
                >
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm">
                  <a
                    href={`/orders/${order.id}`}
                    class="text-primary-500 hover:text-primary-600 transition-colors duration-200 cursor-pointer"
                    >Ver</a
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Componente de guía de bienvenida -->
<WelcomeGuide />
