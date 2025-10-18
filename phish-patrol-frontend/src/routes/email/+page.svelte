<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { ScenarioType} from '$lib/types';
  import type { Scenario } from '$lib/types';

  
  export let data: {
    scenario: Scenario;
  };

  let isAnswered: boolean = false;
  let userChoice: boolean | null = null;
  let feedbackMessage: string = "";

  /**
   * Handles the user's answer submission.
   * @param choice - The user's guess (true if they think it's a scam).
   */
  function handleAnswer(choice: boolean): void {
    userChoice = choice;
    isAnswered = true;
    //Calls getFeedbackMessage function
    feedbackMessage = getFeedbackMessage(userChoice, data.scenario); 

	//Implement difficulty progression here

  }


  //Take userChoice and scenario data and sends back a message for correct/incorrect
  function getFeedbackMessage(userChoice: boolean, scenario: Scenario): string
  {
    //To hold type for scenario
    let msgType = "";

    //Checks if scenario type is an email or sms and assigns it to msgType
    if (scenario.type === ScenarioType.EMAIL) {
      msgType = "email";
    } else {
      msgType = "SMS message";
    }
    //Checks if user choice is correct 
    const isCorrect = userChoice === scenario.isScam;

    //Returns a message with correct or incorrect depending on user choice
    if (isCorrect) {
      return `<strong>Correct!</strong> \n\n ${scenario.explanation}`;
    } else {
      //Prints out incorrect with an explanation if it was a scam or not and why, including msgType
      let feedbackMsg = "<strong>Incorrect!</strong>\n\n This " + msgType + " is actually ";

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
   * Resets the state and triggers the `load` function again to get a new scenario.
   */
  function handleNext(): void {
    isAnswered = false;
    userChoice = null;
    // invalidateAll() tells SvelteKit to re-run all active `load` functions.
    invalidateAll();
  }
</script>

 <header>
    <h1>PHISH PATROL</h1>
  </header>
<!-----------------------------SCENARIO PAGE----------------------------------------->
<div class="container">
  <!---Prints out New with the type of scenario it is-->
  <h2>NEW {data.scenario.type} </h2>
  {#if data.scenario}
    <main>
      <div class="scenario-box">
        <p>{data.scenario.content}</p>
      </div>

      {#if !isAnswered}
        <div class="action-area">
          <!-----<p class="prompt">Is this a scam or legitimate?</p>--->
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
      <!---Feedback box------>
      {#if isAnswered}
      <div class="feedback-box">
        <p>{@html feedbackMessage}</p>
        <button class="btn btn-next" on:click={handleNext}>Next Scenario</button>
      </div>
      {/if}
    </main>
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
