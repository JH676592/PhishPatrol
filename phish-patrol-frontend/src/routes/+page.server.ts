import type { PageServerLoad } from './$types';
import type { Scenario } from '$lib/types';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    // IMPORTANT: Replace this URL with your actual Spring Boot API endpoint.
    const response = await fetch('http://localhost:8080/api/scenarios/random');

    if (!response.ok) {
      throw new Error('Failed to fetch scenario from the API.');
    }

    const scenario: Scenario = await response.json();
    return { scenario };

  } catch (error) {
    console.error("Load function error:", error);
    return {
      scenario: {
        error: "Could not load a scenario. Please try again later."
      } as Partial<Scenario>
    };
  }
};
