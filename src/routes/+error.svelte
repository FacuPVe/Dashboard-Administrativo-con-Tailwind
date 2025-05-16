<script>
    import { page } from '$app/stores';
</script>

<div class="flex items-center justify-center h-[calc(100vh-200px)]">
    <div class="text-center px-4">
        <h1 class="text-9xl font-bold text-gray-800 dark:text-white/90">{$page.status}</h1>
        <h2 class="text-4xl font-medium py-6 text-gray-700 dark:text-white/90">{$page.error?.message || 'Not Found'}</h2>
        <p class="text-lg text-gray-600 mb-8 dark:text-white/80">
            Esta página no existe o no está disponible.
        </p>
        <a href="/" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
            Volver a la página principal
        </a>
    </div>
</div> 