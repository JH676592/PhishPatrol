<script lang="ts">
  import { invalidateAll } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;

  let isAnswered: boolean = false;
  let userChoice: boolean | null = null;

  /**
   * Handles the user's answer submission.
   * @param choice - The user's guess (true if they think it's a scam).
   */
  function handleAnswer(choice: boolean): void {
    userChoice = choice;
    isAnswered = true;
    if (userChoice === data.scenario.isScam) {
	// implement score or lives here
    }
  }

  /**
   * Resets the state and triggers the `load` function again to get a new scenario.
   */
  function handleNext(): void {
    isAnswered = false;
    userChoice = null;
    // invalidateAll() tells SvelteKit to re-run all active `load` functions.
    invalidateAll();
  }
</script>

<div class="container">
  
  <header>
    <h1>Phish Patrol 🕵️</h1>
  </header>

  {#if data.scenario && !data.scenario.error}
    <main>
      <div class="scenario-box">
        <p>{data.scenario.content}</p>
      </div>

      {#if !isAnswered}
        <div class="action-area">
          <p class="prompt">Is this a scam or legitimate?</p>
          <div class="button-group">
            <button class="btn btn-scam" on:click={() => handleAnswer(true)}>
              Scam
            </button>
            <button class="btn btn-legit" on:click={() => handleAnswer(false)}>
              Legit
            </button>
          </div>
        </div>
      {/if}
    </main>
  {:else}
     <p class="error-message">{data.scenario?.error || "An unknown error occurred."}</p>
  {/if}
</div>

<style>
  .container {
    max-width: 650px;
    margin: 2rem auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    text-align: center;
  }

  header h1 {
    font-size: 2.5rem;
    color: #0056b3;
    margin-bottom: 0.5rem;
  }

  /* Scenario & Action Styles */
  .scenario-box {
    padding: 1.5rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    background-color: #ffffff;
    margin-bottom: 2rem;
    text-align: left;
    white-space: pre-wrap;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .prompt {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .btn:hover {
    opacity: 0.9;
  }
  
  .btn:active {
    transform: scale(0.98);
  }

  .btn-scam {
    background-color: #dc3545;
  }

  .btn-legit {
    background-color: #28a745;
  }

  .error-message {
    color: #dc3545;
    font-size: 1.2rem;
    padding: 2rem;
  }
</style>
