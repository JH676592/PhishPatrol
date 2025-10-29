<script lang="ts">
  import { onMount } from 'svelte';
  import { addScenarioToQueue } from '$lib/stores/scenarioQueue';
  import type { Scenario } from '$lib/types';
  
  onMount(() => {
    console.log("Layout mounted, connecting to scenario stream...");
    
    const eventSource = new EventSource('/api/scenarios/stream');

    eventSource.onmessage = (event) => {
      const newScenario = JSON.parse(event.data) as Scenario;
      console.log('Received new scenario:', newScenario);
      addScenarioToQueue(newScenario);
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      console.log("Closing SSE connection.");
      eventSource.close();
    };
  });
</script>

<slot />
