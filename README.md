# Plantilla de un Panel de Administración

## Descripción
En este proyecto se ha desarrollado una plantilla de un panel de administración con SvelteKit y Tailwind CSS. 

## Tecnologías Utilizadas
- **SvelteKit**: Framework para construir aplicaciones web de alto rendimiento
- **TypeScript**: Lenguaje de programación tipado para desarrollo más seguro
- **Tailwind CSS**: Framework de CSS utilitario para diseño rápido y consistente
- **Chart.js**: Biblioteca para la creación de gráficos interactivos
- **Lucide Icons**: Conjunto de iconos SVG para mejorar la interfaz de usuario

## Características Implementadas
- **Panel Principal**: Visualización de KPIs, gráficos de ventas y estadísticas
- **Analytics**: Análisis detallado de datos con gráficos interactivos
- **Gestión de Clientes**: Interfaz para visualizar y gestionar información de clientes
- **Gestión de Pedidos**: Seguimiento y administración de pedidos
- **Calendario**: Planificación y visualización de eventos
- **Configuración**: Personalización de la plataforma
- **Tema Claro/Oscuro**: Soporte para diferentes modos de visualización
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla

## Requisitos Previos
- Node.js (versión recomendada: 18.x o superior)
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL del repositorio]
   cd dashboard-administrativo
   ```

2. Instalar dependencias:
```bash
   npm install
```

3. Instalar dependencias adicionales:
```bash
    npm install chart.js # https://www.chartjs.org/docs/latest/getting-started/installation.html
    npm install tailwindcss @tailwindcss/vite # https://tailwindcss.com/docs/installation/framework-guides/sveltekit
    npm install @lucide/svelte # https://lucide.dev/guide/packages/lucide-svelte
```

## Ejecución

### Modo Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

Para iniciar el servidor y abrir automáticamente en el navegador:
```bash
npm run dev -- --open
```

### Compilación para Producción
Para crear una versión optimizada para producción:
```bash
npm run build
```

Para previsualizar la versión de producción:
```bash
npm run preview
```

## Estructura del Proyecto
```
dashboard-administrativo/
├── src/
│   ├── routes/             # Páginas y rutas de la aplicación
│   │   ├── analytics/      # Sección de análisis
│   │   ├── customers/      # Gestión de clientes
│   │   ├── orders/         # Gestión de pedidos
│   │   ├── settings/       # Configuraciones
│   │   └── calendar/       # Calendario
│   ├── lib/                # Componentes y utilidades reutilizables
│   └── app.css            # Estilos globales con Tailwind
├── static/                # Archivos estáticos (imágenes, etc.)
└── [Archivos de configuración]
```

## Despliegue
Para desplegar la aplicación en producción, se puede utilizar cualquier plataforma compatible con aplicaciones Node.js como Vercel, Netlify, o configurar un servidor propio.

> Nota: Para entornos específicos, puede ser necesario instalar un adaptador específico de SvelteKit. Consulta la [documentación oficial de SvelteKit](https://svelte.dev/docs/kit/adapters) para más información.