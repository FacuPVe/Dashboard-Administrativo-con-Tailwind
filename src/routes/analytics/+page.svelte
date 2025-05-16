<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    ChevronRight,
    Info,
  } from "@lucide/svelte";
  import { showToast } from "$lib/components/Toast.svelte";
  import SkeletonLoader from "$lib/components/SkeletonLoader.svelte";

  // Estado de carga y datos
  let isLoading = true;
  let activeYear = "2024";
  let activeTimeRange = "year";
  let deviceFilter = "all";
  let demographicsView = "age";
  let geoView = "region";
  let showInfoPanel = false; 

  // Opciones comunes de Chart.js para mejorar la visualización
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as "x" | "y" | "nearest" | "index" | "dataset" | "point",
      intersect: false,
    },
    animation: {
      duration: 400,
      easing: "easeOutQuad" as "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad" | "easeInCubic" | "easeOutCubic" | "easeInOutCubic" | "easeInQuart" | "easeOutQuart" | "easeInOutQuart" | "easeInQuint",
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            weight: "bold" as "bold" | "normal" | "lighter" | "bolder",
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
      },
    },
  };

  // Analytics data (datos de 2023-2025)
  const performanceMetrics = [
    {
      title: "Visitas de Página",
      value: "1.7M",
      change: "+12.5%",
      isPositive: true,
      period: "vs año ant.",
      data: {
        "2023": { value: "1.2M", change: "+8.2%", isPositive: true },
        "2024": { value: "1.7M", change: "+12.5%", isPositive: true },
        "2025": { value: "2.3M", change: "+15.8%", isPositive: true },
      },
    },
    {
      title: "Tasa de Rebote",
      value: "42.3%",
      change: "-3.8%",
      isPositive: true,
      period: "vs año ant.",
      data: {
        "2023": { value: "48.2%", change: "-1.2%", isPositive: true },
        "2024": { value: "42.3%", change: "-3.8%", isPositive: true },
        "2025": { value: "37.1%", change: "-5.2%", isPositive: true },
      },
    },
    {
      title: "Duración Media Sesión",
      value: "3:42",
      change: "+0:56",
      isPositive: true,
      period: "vs año ant.",
      data: {
        "2023": { value: "2:23", change: "+0:18", isPositive: true },
        "2024": { value: "3:42", change: "+0:56", isPositive: true },
        "2025": { value: "4:15", change: "+0:33", isPositive: true },
      },
    },
    {
      title: "Tasa de Conversión",
      value: "4.6%",
      change: "+1.2%",
      isPositive: true,
      period: "vs año ant.",
      data: {
        "2023": { value: "2.8%", change: "+0.4%", isPositive: true },
        "2024": { value: "4.6%", change: "+1.2%", isPositive: true },
        "2025": { value: "6.3%", change: "+1.7%", isPositive: true },
      },
    },
  ];

  // Datos de tráfico mensuales (2023-2025)
  const trafficData = {
    // Datos para 2023
    "2023": {
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
          label: "Escritorio",
          data: [45, 52, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110],
          backgroundColor: "rgba(59, 130, 246, 0.7)", // Azul
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Móvil",
          data: [60, 65, 70, 75, 85, 90, 100, 110, 120, 125, 130, 140],
          backgroundColor: "rgba(239, 68, 68, 0.7)", // Rojo
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Tablet",
          data: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42],
          backgroundColor: "rgba(16, 185, 129, 0.7)", // Verde
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    // Datos para 2024
    "2024": {
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
          label: "Escritorio",
          data: [115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170],
          backgroundColor: "rgba(59, 130, 246, 0.7)", // Azul
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Móvil",
          data: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260],
          backgroundColor: "rgba(239, 68, 68, 0.7)", // Rojo
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Tablet",
          data: [45, 48, 50, 52, 55, 58, 60, 62, 65, 68, 70, 72],
          backgroundColor: "rgba(16, 185, 129, 0.7)", // Verde
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    // Datos para 2025
    "2025": {
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
          label: "Escritorio",
          data: [175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230],
          backgroundColor: "rgba(59, 130, 246, 0.7)", // Azul
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Móvil",
          data: [270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380],
          backgroundColor: "rgba(239, 68, 68, 0.7)", // Rojo
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Tablet",
          data: [75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102],
          backgroundColor: "rgba(16, 185, 129, 0.7)", // Verde
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
  };

  // Datos demográficos 2023-2025
  const demographicsData = {
    age: {
      "2023": {
        labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        datasets: [
          {
            label: "Distribución por Edad 2023",
            data: [15, 28, 24, 18, 10, 5],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 1,
          },
        ],
      },
      "2024": {
        labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        datasets: [
          {
            label: "Distribución por Edad 2024",
            data: [18, 32, 25, 15, 7, 3],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 1,
          },
        ],
      },
      "2025": {
        labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        datasets: [
          {
            label: "Distribución por Edad 2025",
            data: [22, 35, 25, 12, 4, 2],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 1,
          },
        ],
      },
    },
    gender: {
      "2023": {
        labels: ["Hombre", "Mujer", "No binario", "Prefiero no decirlo"],
        datasets: [
          {
            label: "Distribución por Género 2023",
            data: [45, 52, 2, 1],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 1,
          },
        ],
      },
      "2024": {
        labels: ["Hombre", "Mujer", "No binario", "Prefiero no decirlo"],
        datasets: [
          {
            label: "Distribución por Género 2024",
            data: [42, 54, 3, 1],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 1,
          },
        ],
      },
      "2025": {
        labels: ["Hombre", "Mujer", "No binario", "Prefiero no decirlo"],
        datasets: [
          {
            label: "Distribución por Género 2025",
            data: [40, 55, 4, 1],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 1,
          },
        ],
      },
    },
  };

  // Datos geográficos actualizados
  const geoData = {
    region: {
      "2023": {
        labels: [
          "América del Norte",
          "Europa",
          "Asia",
          "América del Sur",
          "África",
          "Oceanía",
        ],
        datasets: [
          {
            label: "Usuarios por Región 2023",
            data: [35, 30, 18, 12, 3, 2],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
      "2024": {
        labels: [
          "América del Norte",
          "Europa",
          "Asia",
          "América del Sur",
          "África",
          "Oceanía",
        ],
        datasets: [
          {
            label: "Usuarios por Región 2024",
            data: [32, 29, 22, 13, 2, 2],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
      "2025": {
        labels: [
          "América del Norte",
          "Europa",
          "Asia",
          "América del Sur",
          "África",
          "Oceanía",
        ],
        datasets: [
          {
            label: "Usuarios por Región 2025",
            data: [30, 28, 24, 14, 2, 2],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
    },
    countries: {
      "2023": {
        labels: ["EEUU", "Reino Unido", "China", "Alemania", "Brasil", "India", "Otros"],
        datasets: [
          {
            label: "Usuarios por País 2023",
            data: [28, 12, 10, 8, 7, 5, 30],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(232, 121, 249, 0.7)", // Rosa
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
      "2024": {
        labels: ["EEUU", "Reino Unido", "China", "Alemania", "Brasil", "India", "Otros"],
        datasets: [
          {
            label: "Usuarios por País 2024",
            data: [25, 14, 9, 8, 8, 6, 30],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(232, 121, 249, 0.7)", // Rosa
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
      "2025": {
        labels: ["EEUU", "Reino Unido", "China", "Alemania", "Brasil", "India", "Otros"],
        datasets: [
          {
            label: "Usuarios por País 2025",
            data: [22, 15, 9, 7, 9, 8, 30],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)", // Azul
              "rgba(239, 68, 68, 0.7)", // Rojo
              "rgba(16, 185, 129, 0.7)", // Verde
              "rgba(245, 158, 11, 0.7)", // Naranja
              "rgba(139, 92, 246, 0.7)", // Morado
              "rgba(232, 121, 249, 0.7)", // Rosa
              "rgba(107, 114, 128, 0.7)", // Gris
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
    },
  };

  // Top referrers data (actualizado con datos más recientes)
  const topReferrers = [
    { source: "Google", visits: "624,853", conversion: "4.2%", trend: "up" },
    { source: "Facebook", visits: "235,974", conversion: "3.1%", trend: "up" },
    { source: "Instagram", visits: "189,452", conversion: "3.8%", trend: "up" },
    {
      source: "Twitter/X",
      visits: "124,836",
      conversion: "2.2%",
      trend: "down",
    },
    { source: "Directo", visits: "117,539", conversion: "5.6%", trend: "up" },
    { source: "YouTube", visits: "98,427", conversion: "3.3%", trend: "up" },
    { source: "LinkedIn", visits: "76,321", conversion: "4.5%", trend: "up" },
    { source: "TikTok", visits: "54,289", conversion: "2.9%", trend: "up" },
  ];

  interface ChartObjects {
    [key: string]: Chart;
  }

  interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  }

  let charts: ChartObjects = {};

  /**
   * Formatea números grandes a un formato legible (K, M).
   * @param num - El número a formatear.
   * @returns El número formateado como string.
   */
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
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
   * Cambia el año activo y actualiza los gráficos correspondientes.
   * @param year - El año activo.
   */
  function changeYear(year: string) {
    activeYear = year;
    updateTrafficChart();
    showToast(`Datos actualizados para el año ${year}`, "info");
  }

  /**
   * Cambia el rango de tiempo para el análisis.
   * @param range - El rango de tiempo a establecer (anual, trimestral, mensual).
   */
  function changeTimeRange(range: string) {
    activeTimeRange = range;
    updateTrafficChart();
    showToast(
      `Vista cambiada a ${range === "year" ? "anual" : range === "quarter" ? "trimestral" : "mensual"}`,
      "info",
    );
  }

  /**
   * Filtra los datos por tipo de dispositivo.
   * @param device - El tipo de dispositivo a filtrar (all, desktop, mobile, tablet).
   */
  function filterByDevice(device: string) {
    deviceFilter = device;
    updateTrafficChart();
    showToast(
      `Filtrando por: ${device === "all" ? "Todos los dispositivos" : device}`,
      "info",
    );
  }

  /**
   * Cambia la vista demográfica.
   * @param view - La vista demográfica a establecer (edad, género).
   */
  function changeDemographicsView(view: string) {
    demographicsView = view;
    updateDemographicsChart();
    showToast(`Vista demográfica cambiada a: ${view}`, "info");
  }

  /**
   * Cambia la vista geográfica.
   * @param view - La vista geográfica a establecer (región, países).
   */
  function changeGeoView(view: string) {
    geoView = view;
    updateGeoDistributionChart();
    showToast(`Vista geográfica cambiada a: ${view}`, "info");
  }

  /**
   * Actualiza el gráfico de tráfico
   */
  function updateTrafficChart() {
    if (!charts.traffic) return;

    // Destruir el gráfico existente
    charts.traffic.destroy();

    // Obtener el canvas
    const trafficCtx = document.getElementById(
      "trafficChart",
    ) as HTMLCanvasElement;
    if (!trafficCtx) return;

    // Obtener datos para el año seleccionado
    const yearData = trafficData[activeYear as "2023" | "2024" | "2025"];

    // Aplicar filtro de dispositivo
    let filteredDatasets = [...yearData.datasets];
    if (deviceFilter !== "all") {
      filteredDatasets = yearData.datasets.filter(
        (ds) => ds.label.toLowerCase() === deviceFilter.toLowerCase(),
      );
    }

    // Clonar los datos para manipularlos
    let displayLabels = [...yearData.labels];
    let displayDatasets = JSON.parse(JSON.stringify(filteredDatasets));

    // Aplicar filtro de rango de tiempo
    if (activeTimeRange === "quarter") {
      // Mostrar último trimestre
      displayLabels = yearData.labels.slice(9, 12);
      displayDatasets.forEach((ds: Dataset) => {
        ds.data = ds.data.slice(9, 12);
      });
    } else if (activeTimeRange === "month") {
      // Mostrar último mes
      displayLabels = [yearData.labels[11]];
      displayDatasets.forEach((ds: Dataset) => {
        ds.data = [ds.data[11]];
      });
    }

    // Crear un nuevo gráfico con los datos filtrados
    charts.traffic = new Chart(trafficCtx, {
      type: "bar",
      data: {
        labels: displayLabels,
        datasets: displayDatasets,
      },
      options: {
        ...chartDefaults,
        scales: {
          x: {
            grid: {
              display: false,
            },
            stacked: false,
          },
          y: {
            stacked: false,
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return formatNumber(value as number);
              },
            },
          },
        },
      },
    });
  }

  /**
   * Actualiza el gráfico de demografía.
   */
  function updateDemographicsChart() {
    if (!charts.demographics) return;

    // Destruir el gráfico existente
    charts.demographics.destroy();

    // Obtener el canvas
    const demographicsCtx = document.getElementById(
      "demographicsChart",
    ) as HTMLCanvasElement;
    if (!demographicsCtx) return;

    // Crear un nuevo gráfico con los datos actualizados
    charts.demographics = new Chart(demographicsCtx, {
      type: "pie",
      data: demographicsData[demographicsView as keyof typeof demographicsData][activeYear as "2023" | "2024" | "2025"],
      options: {
        ...chartDefaults,
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
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce(
                  (acc: number, data: number) => acc + data,
                  0,
                );
                const percentage = Math.round((value * 100) / total) + "%";
                return `${label}: ${percentage}`;
              },
            },
          },
        },
      },
    });
  }

  /**
   * Actualiza el gráfico de distribución geográfica.
   */
  function updateGeoDistributionChart() {
    if (!charts.geo) return;

    // Destruir el gráfico existente
    charts.geo.destroy();

    // Obtener el canvas
    const geoCtx = document.getElementById(
      "geoDistributionChart",
    ) as HTMLCanvasElement;
    if (!geoCtx) return;

    // Crear un nuevo gráfico con los datos actualizados
    charts.geo = new Chart(geoCtx, {
      type: "doughnut",
      data: geoData[geoView as keyof typeof geoData][activeYear as "2023" | "2024" | "2025"],
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
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce(
                  (acc: number, data: number) => acc + data,
                  0,
                );
                const percentage = Math.round((value * 100) / total) + "%";
                return `${label}: ${percentage}`;
              },
            },
          },
        },
      },
    });
  }

  /**
   * Refresca todos los datos y gráficos en el componente.
   */
  function refreshData() {
    isLoading = true;
    showToast("Actualizando datos...", "info");

    // Limpiar gráficos existentes
    Object.values(charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    charts = {};

    setTimeout(() => {
      isLoading = false;
      initializeCharts();
      showToast("Datos actualizados correctamente", "success");
    }, 1500);
  }

  /**
   * Exporta los datos a un archivo.
   */
  function exportData() {
    showToast("Preparando exportación de datos...", "info");

    try {
      // Simulamos la generación de un archivo Excel
      setTimeout(() => {
        const dataType = "data:application/vnd.ms-excel;charset=utf-8";

        // Creamos una tabla HTML con los datos
        let tableHTML =
          "<table><tr><th>Mes</th><th>Desktop</th><th>Mobile</th><th>Tablet</th></tr>";

        // Añadimos datos de tráfico
        const data = trafficData[activeYear as "2023" | "2024" | "2025"];
        data.labels.forEach((month: string, index: number) => {
          tableHTML += `<tr>
                        <td>${month}</td>
                        <td>${data.datasets[0].data[index]}</td>
                        <td>${data.datasets[1].data[index]}</td>
                        <td>${data.datasets[2].data[index]}</td>
                    </tr>`;
        });

        tableHTML += "</table>";

        // Creamos un elemento de enlace temporal para la descarga
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = `${dataType},${encodeURIComponent(tableHTML)}`;
        link.download = `analytics_data_${activeYear}_${new Date().toISOString().slice(0, 10)}.xls`;
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
   * Inicializa todos los gráficos en el componente.
   */
  function initializeCharts() {
    // Verificar si el componente sigue montado
    if (!isMounted) {
      console.log("No se inicializan los gráficos porque el componente ya no está montado");
      return;
    }

    console.log("Inicializando gráficos...");

    try {
      // Inicializar gráfico de tráfico
      const trafficCtx = document.getElementById(
        "trafficChart",
      ) as HTMLCanvasElement | null;
      if (trafficCtx && isMounted) {
        console.log("Canvas de tráfico encontrado");
        charts.traffic = new Chart(trafficCtx, {
          type: "bar",
          data: trafficData[activeYear as "2023" | "2024" | "2025"],
          options: {
            ...chartDefaults,
            scales: {
              x: {
                grid: {
                  display: false,
                },
                stacked: false,
              },
              y: {
                stacked: false,
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  callback: function (value) {
                    return formatNumber(value as number);
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas de tráfico no encontrado");
      }

      // Verificar de nuevo si el componente sigue montado
      if (!isMounted) return;

      // Inicializar gráfico de demografía
      const demographicsCtx = document.getElementById(
        "demographicsChart",
      ) as HTMLCanvasElement | null;
      if (demographicsCtx && isMounted) {
        console.log("Canvas de demografía encontrado");
        charts.demographics = new Chart(demographicsCtx, {
          type: "pie",
          data: demographicsData[demographicsView as keyof typeof demographicsData][activeYear as "2023" | "2024" | "2025"],
          options: {
            ...chartDefaults,
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
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce(
                      (acc: number, data: number) => acc + data,
                      0,
                    );
                    const percentage = Math.round((value * 100) / total) + "%";
                    return `${label}: ${percentage}`;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas de demografía no encontrado");
      }

      // Verificar de nuevo si el componente sigue montado
      if (!isMounted) return;

      // Inicializar gráfico de distribución geográfica
      const geoCtx = document.getElementById(
        "geoDistributionChart",
      ) as HTMLCanvasElement | null;
      if (geoCtx && isMounted) {
        console.log("Canvas de geografía encontrado");
        charts.geo = new Chart(geoCtx, {
          type: "doughnut",
          data: geoData[geoView as keyof typeof geoData][activeYear as "2023" | "2024" | "2025"],
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
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce(
                      (acc: number, data: number) => acc + data,
                      0,
                    );
                    const percentage = Math.round((value * 100) / total) + "%";
                    return `${label}: ${percentage}`;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas de geografía no encontrado");
      }

      if (isMounted) {
        console.log("Todos los gráficos inicializados correctamente");
      }
    } catch (error) {
      console.error("Error al inicializar los gráficos:", error);
    }
  }

  // Variable para controlar si el componente está montado
  let isMounted = false;

  onMount(() => {
    // Marcar el componente como montado
    isMounted = true;
    
    // Simular una breve carga inicial
    console.log("Componente montado, simulando carga...");

    setTimeout(() => {
      // Verificar que el componente sigue montado
      if (!isMounted) return;
      
      console.log("Carga completada, inicializando gráficos");
      isLoading = false;

      // Asegurarnos de que el DOM está realmente listo antes de inicializar los gráficos
      setTimeout(() => {
        // Verificar nuevamente que el componente sigue montado
        if (!isMounted) return;
        
        console.log("Inicializando gráficos tras actualizar el DOM");
        initializeCharts();

        // Actualizar los datos de performance metrics según el año activo
        performanceMetrics.forEach((metric, index) => {
          if (metric.data && metric.data[activeYear as "2023" | "2024" | "2025"]) {
            performanceMetrics[index].value = metric.data[activeYear as "2023" | "2024" | "2025"].value;
            performanceMetrics[index].change = metric.data[activeYear as "2023" | "2024" | "2025"].change;
            performanceMetrics[index].isPositive =
              metric.data[activeYear as "2023" | "2024" | "2025"].isPositive;
          }
        });
      }, 100);
    }, 500);

    // Función de limpieza
    return () => {
      isMounted = false;
      
      console.log("Limpiando gráficos...");
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
</script>

<div>
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
  >
    <div>
      <div
        class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2"
      >
        <a href="/" class="hover:text-primary-500 transition-colors cursor-pointer">Panel</a>
        <ChevronRight class="w-4 h-4 mx-2" />
        <span class="text-gray-900 dark:text-gray-200 font-medium"
          >Análisis</span
        >
      </div>
      <div class="flex items-center gap-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Análisis de rendimiento
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
        Análisis detallado del rendimiento de tu sitio web
      </p>
    </div>
    <div class="flex gap-2">
      <button
        on:click={refreshData}
        class="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors duration-200 cursor-pointer"
      >
        <RefreshCw class="w-4 h-4" />
        Actualizar
      </button>
      <button
        on:click={exportData}
        class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center gap-2 transition-colors duration-200 cursor-pointer"
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
        <Filter class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
            Opciones de análisis
          </h3>
          <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              • Selecciona diferentes años para comparar tendencias (2023-2025).
            </li>
            <li>
              • Filtra por rango de tiempo (anual, trimestral, mensual) para
              análisis detallado.
            </li>
            <li>
              • Cambia entre diferentes visualizaciones (edad/género,
              regiones/países).
            </li>
            <li>
              • Descarga imágenes de cada gráfico o exporta los datos completos.
            </li>
            <li>
              • Todos los gráficos se actualizan automáticamente al cambiar los
              filtros.
            </li>
          </ul>
        </div>
      </div>
    </div>
  {/if}

  <!-- Selector de año -->
  <div class="mb-6 flex flex-wrap gap-4 items-center">
    <div
      class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 inline-flex"
    >
      <button
        class={`px-4 py-2 text-sm rounded-md transition-colors ${activeYear === "2023" ? "bg-primary-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}`}
        on:click={() => changeYear("2023")}
      >
        2023
      </button>
      <button
        class={`px-4 py-2 text-sm rounded-md transition-colors ${activeYear === "2024" ? "bg-primary-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}`}
        on:click={() => changeYear("2024")}
      >
        2024
      </button>
      <button
        class={`px-4 py-2 text-sm rounded-md transition-colors ${activeYear === "2025" ? "bg-primary-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}`}
        on:click={() => changeYear("2025")}
      >
        2025
      </button>
    </div>
    <div
      class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
    >
      <Calendar class="w-4 h-4" />
      <span>Datos para el año {activeYear}</span>
    </div>
  </div>

  <!-- Performance Metrics -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
    {#if isLoading}
      {#each Array(4) as _}
        <SkeletonLoader type="card" height="h-32" />
      {/each}
    {:else}
      {#each performanceMetrics as metric}
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div class="flex justify-between">
            <div
              class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-400"
            >
              {#if metric.isPositive}
                <ArrowUpRight class="w-6 h-6" />
              {:else}
                <ArrowDownRight class="w-6 h-6" />
              {/if}
            </div>
            <div
              class={`px-2 py-1 text-xs rounded-full flex items-center ${metric.isPositive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
            >
              {metric.change}
            </div>
          </div>
          <p class="mt-4 text-2xl font-semibold">{metric.value}</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{metric.title}</p>
        </div>
      {/each}
    {/if}
  </div>

  <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
        <h2 class="text-lg font-semibold">Tráfico por Dispositivo</h2>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 text-xs">
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTimeRange === "year" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeTimeRange("year")}
            >
              Año
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTimeRange === "quarter" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeTimeRange("quarter")}
            >
              Trimestre
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTimeRange === "month" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeTimeRange("month")}
            >
              Mes
            </button>
          </div>
          <select
            id="device-filter"
            aria-label="Filtrar dispositivos"
            class="bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-xs p-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            bind:value={deviceFilter}
            on:change={() => filterByDevice(deviceFilter)}
          >
            <option value="all">Todos dispositivos</option>
            <option value="desktop">Solo Escritorio</option>
            <option value="mobile">Solo Móvil</option>
            <option value="tablet">Solo Tablet</option>
          </select>
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() =>
              downloadChartImage("traffic", `trafico_${activeYear}.png`)}
            title="Descargar imagen"
          >
            <Download class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="h-64 relative cursor-pointer">
          <canvas id="trafficChart" width="400" height="200"></canvas>
        </div>
      {/if}
    </div>

    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
        <h2 class="text-lg font-semibold">Demografía de Usuarios</h2>
        <div class="flex items-center gap-2">
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 text-xs">
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${demographicsView === "age" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeDemographicsView("age")}
            >
              Edad
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${demographicsView === "gender" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeDemographicsView("gender")}
            >
              Género
            </button>
          </div>
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() =>
              downloadChartImage(
                "demographics",
                `demografia_${demographicsView}.png`,
              )}
            title="Descargar imagen"
          >
            <Download class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="h-64 relative cursor-pointer">
          <canvas id="demographicsChart" width="400" height="200"></canvas>
        </div>
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-1"
    >
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
        <h2 class="text-lg font-semibold">Distribución Geográfica</h2>
        <div class="flex items-center gap-2">
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 text-xs">
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${geoView === "region" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeGeoView("region")}
            >
              Región
            </button>
            <button
              class={`px-2 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${geoView === "countries" ? "bg-primary-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              on:click={() => changeGeoView("countries")}
            >
              País
            </button>
          </div>
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
            on:click={() => downloadChartImage("geo", `geo_${geoView}.png`)}
            title="Descargar imagen"
          >
            <Download class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader height="h-64" className="rounded-lg" />
      {:else}
        <div class="h-64 relative cursor-pointer">
          <canvas id="geoDistributionChart" width="400" height="200"></canvas>
        </div>
      {/if}
    </div>

    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2"
    >
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
        <h2 class="text-lg font-semibold">Top Fuentes de Tráfico</h2>
        <div class="flex flex-wrap items-center gap-2">
          <div
            class="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md font-medium"
          >
            <span class="text-primary-500">Total: </span>
            <span>1,521,691 visitas</span>
          </div>
          <button
            class="px-3 py-1 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Filter class="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>
      {#if isLoading}
        <SkeletonLoader type="table" repeat={5} />
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full text-xs sm:text-sm">
            <thead>
              <tr
                class="text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
              >
                <th class="px-3 sm:px-4 py-3">Fuente</th>
                <th class="px-3 sm:px-4 py-3">Visitas</th>
                <th class="px-3 sm:px-4 py-3">Conversión</th>
                <th class="px-3 sm:px-4 py-3">Tendencia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              {#each topReferrers as referrer}
                <tr
                  class="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <td class="px-3 sm:px-4 py-3 whitespace-nowrap font-medium"
                    >{referrer.source}</td
                  >
                  <td class="px-3 sm:px-4 py-3 whitespace-nowrap">{referrer.visits}</td>
                  <td class="px-3 sm:px-4 py-3 whitespace-nowrap"
                    >{referrer.conversion}</td
                  >
                  <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                    {#if referrer.trend === "up"}
                      <TrendingUp class="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                    {:else}
                      <TrendingDown class="w-4 sm:w-5 h-4 sm:h-5 text-red-500" />
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
