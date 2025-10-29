import { writable } from 'svelte/store';
import type { Scenario } from '$lib/types';

export const scenarioQueue = writable<Scenario[]>([]);

export function addScenarioToQueue(scenario: Scenario) {
  scenarioQueue.update(currentQueue => [...currentQueue, scenario]);
}

export function removeScenarioFromQueue(scenarioId: number) {
  scenarioQueue.update(currentQueue => 
    currentQueue.filter(s => s.id !== scenarioId)
  );
}
