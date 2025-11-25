import { writable, get } from 'svelte/store';
import type { Scenario } from '$lib/types';
import { tokenStore } from '$lib/stores/auth';

export const scenarioQueue = writable<Scenario[]>([]);

export function addScenarioToQueue(scenario: Scenario) {
  const token = get(tokenStore);
  if (token){
    scenarioQueue.update(currentQueue => [...currentQueue, scenario]);
  }
}

export function removeScenarioFromQueue(scenarioId: number) {
  scenarioQueue.update(currentQueue => 
    currentQueue.filter(s => s.id !== scenarioId)
  );
}

// clearing queue
export function clearScenarioQueue() {
  scenarioQueue.set([]);
}

