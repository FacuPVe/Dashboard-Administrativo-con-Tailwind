<script lang="ts">
  export let type: 'card' | 'table' | 'text' | 'circle' | 'custom' = 'text';
  export let width: string = 'w-full';
  export let height: string = 'h-4';
  export let rounded: string = 'rounded';
  export let repeat: number = 1;
  export let className: string = '';
</script>

{#if type === 'text'}
  {#each Array(repeat) as _, i}
    <div 
      class={`${width} ${height} ${rounded} bg-gray-200 dark:bg-gray-700 animate-pulse ${className} ${i !== repeat - 1 ? 'mb-2' : ''}`}
    ></div>
  {/each}
{:else if type === 'card'}
  <div class={`${width} bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse ${className}`}>
    <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
  </div>
{:else if type === 'table'}
  <div class={`${width} overflow-hidden rounded-lg shadow animate-pulse ${className}`}>
    <div class="h-12 bg-gray-100 dark:bg-gray-800 flex items-center px-4">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
    </div>
    {#each Array(repeat) as _}
      <div class="h-16 bg-white dark:bg-gray-900 flex items-center px-4 border-t border-gray-200 dark:border-gray-700">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
    {/each}
  </div>
{:else if type === 'circle'}
  <div class={`${height} ${width} ${width === 'w-full' ? 'aspect-square' : ''} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ${className}`}></div>
{:else}
  <div class={`${width} ${height} ${rounded} bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}></div>
{/if} 