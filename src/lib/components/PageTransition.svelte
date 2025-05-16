<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
</script>

<div
  in:fly={{ y: 20, duration: 400, delay: 250, easing: cubicOut }}
  out:fly={{ y: -20, duration: 300, easing: cubicOut }}
  class="w-full"
>
  <slot />
</div> 