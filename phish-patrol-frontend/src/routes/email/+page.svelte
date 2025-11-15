<script lang="ts">
  import { goto } from '$app/navigation';
  import { scenarioQueue, removeScenarioFromQueue } from '$lib/stores/scenarioQueue';
  import { ScenarioType } from '$lib/types';
  import type { Scenario } from '$lib/types';
  import { healthbar } from '$lib/stores/stores';

  let isAnswered: boolean = false;
  let userChoice: boolean | null = null;
  let feedbackMessage: string = "";

  $: currentScenario = $scenarioQueue.find(s => s.type === ScenarioType.EMAIL);

  $: {
    if (!isAnswered) {
      if ($scenarioQueue.length === 0 || !currentScenario) {
        goto('/');
      }
    }
  }

  /**
   * Handles the user's answer submission.
   */
  function handleAnswer(choice: boolean): void {
    if (!currentScenario) return;

    userChoice = choice;
    isAnswered = true;
    lifeHealthChange(userChoice, currentScenario);
    feedbackMessage = getFeedbackMessage(userChoice, currentScenario); 

	//Implement difficulty progression here

  }

  function lifeHealthChange(userChoice: boolean, scenario: Scenario): void{
     const isCorrect = userChoice === scenario.isScam;
     if (!isCorrect){
      healthbar.update(n=>n-10);

     }

  }

  // Take userChoice and scenario data and sends back a message for correct/incorrect
  function getFeedbackMessage(userChoice: boolean, scenario: Scenario): string
  {
    let msgType = "email";
    if (scenario.type !== ScenarioType.EMAIL) {
      msgType = "message";
    }

    const isCorrect = userChoice === scenario.isScam;

    if (isCorrect) {
      return `<strong>Correct!</strong> <br><br> ${scenario.explanation}`;
    } else {
      let feedbackMsg = "<strong>Incorrect!</strong><br><br> This " + msgType + " is actually ";
        if (scenario.isScam) {
          feedbackMsg += "a phishing attempt.";
        } else {
          feedbackMsg += "legitimate, ";
        }
        feedbackMsg += " " + scenario.explanation;
        return feedbackMsg;
    }
  }

  /**
   * Removes the answered scenario from the queue and resets the state.
   * The page will reactively show the next email or redirect.
   */
  function proceedToNext(): void {
    if (!currentScenario) return;
    
    removeScenarioFromQueue(currentScenario.id);

    isAnswered = false;
    userChoice = null;
    feedbackMessage = "";

    goto("/");
  }
</script>

 <header>
   <h1>PHISH PATROL</h1>
 </header>
<div class="container">
  {#if currentScenario}
    <h2>NEW {currentScenario.type}</h2>
    <main>
      <div class="scenario-box">
        <p>{currentScenario.content}</p>
      </div>

      {#if !isAnswered}
        <div class="action-area">
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
      
      {#if isAnswered}
      <div class="feedback-box">
        <p>{@html feedbackMessage}</p>
        <button class="btn btn-next" on:click={proceedToNext}>Continue</button>
      </div>
      {/if}
    </main>
  {:else}
    <p>Loading scenarios...</p>
  {/if}
</div>

<!-----------------------------------STYLES------------------------------------->
<style>
  .container {
    max-width: 650px;
    margin: 2rem auto;
    padding: 2rem;
    font-family: 'Franklin Gothic Medium', Arial, sans-serif;
    box-shadow: 1px 1px 15px rgba(22, 22, 22, 0.1);
    text-align: center;
    background-color: #adadad3a;
    border-radius: 8px;
    max-height: 80vh;
    overflow-y: auto;
  }

  header h1 {
    font-size: 2.5rem;
    font-family:'Orbitron';
    color: #040404;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  /* Scenario & Action Styles */
  .scenario-box {
    padding: 1.0rem;
    border: 1px solid #354758;
    border-radius: 8px;
    background-color: #ffffff;
    margin-bottom: 2rem;
    text-align: left;
    white-space: pre-wrap;
    font-family: 'Franklin Gothic Medium', Arial, sans-serif;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  /* Displays the feedback after choice*/
  .feedback-box {
    background-color: #e9ecef;
    font-size: 1.2rem;
    white-space: pre-wrap;
    color: #212529;
    max-width: auto;
    text-wrap: balance;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.0rem;
    font-size: 1.2rem;
    font-weight: bold;
    font-family: 'Franklin Gothic Medium', Arial, sans-serif;
    color: white;
    border: none;
    border-radius: 8px;
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

  .btn-next {
    background-color: #0a0a0a;
    font-size: 1.1rem;
  }

  /*.error-message {
    color: #dc3545;
    font-size: 1.2rem;
    padding: 2rem;
  }*/
</style>
