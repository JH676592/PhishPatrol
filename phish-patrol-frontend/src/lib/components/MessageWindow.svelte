<script lang="ts">
  import type { Scenario } from '$lib/types';

  export let currentScenario: Scenario; // current sms or email scenario
  export let onComplete: () => void; 

  let isAnswered = false; // tracks user answer
  let userChoice: boolean | null = null; // stores user answer
  let feedbackMessage = ''; // stores feedback msg 


  // Formatting for the emails and sms messages, work in progress
  function formatMessage(content: string): string {
    let formatted = content
        .replace(/(Subject:)/i, '<strong>Subject:</strong> ')
        .replace(/(From:)/i, '<br><strong>From:</strong> ')
        .replace(/(To:)/i, '<br><strong>To:</strong> ')
        .replace(/(Date:)/i, '<br><strong>Date:</strong> ')
        .replace(/(Dear\s+\w+,?)/i, '<br><br>$1<br><br>')
        .replace(/((?:https?|hxxps?):\/\/[^\s]+)/gi, '<span class="fake-link">$1</span>')
        .replace(/(Thank you,|Best,|Sincerely,)/gi, '<br><br>$1')
        .replace(/([.!?])([A-Z])/g, '$1<br><br>$2');

    return formatted;
  }

  // Take answer from player and returns feedback msg
  function handleAnswer(choice: boolean) {
    userChoice = choice;
    isAnswered = true;

    const isCorrect = choice === currentScenario.isScam;

    // Feedback message returned depending on user answer
    feedbackMessage = isCorrect
    ? `<strong>Correct!</strong><br>${currentScenario.explanation}`
    : `<strong>Incorrect!</strong><br>This ${currentScenario.type === 'SMS' ? 'message' : 'email'} is ${currentScenario.isScam ? 'a phishing attempt' : 'legitimate'}.<br>${currentScenario.explanation}`;
  }

  // Handles user clicking continue
  function handleContinue() {
    isAnswered = false;
    userChoice = null;
    feedbackMessage = '';
    onComplete(); // notify parent window is done so window will close
  }

</script>

<div class="window">
    <div class="window-header">
        <span>NEW {currentScenario.type}</span>
    </div>

    <div class="window-body">
        <p class="message-content">
            {@html formatMessage(currentScenario.content)}</p>

        {#if !isAnswered}
            <div class="button-group">
                <button class="btn btn-scam" on:click={() => handleAnswer(true)}>Scam</button>
                <button class="btn btn-legit" on:click={() => handleAnswer(false)}>Legit</button>
            </div>
        {:else}
            <div class="feedback">{@html feedbackMessage}</div>
            <div class="continue-container">
                <button class="btn btn-next" on:click={handleContinue}>Continue</button>
            </div>
        {/if}
    </div>
</div>

<style>

.window {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  max-width: 90vw;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow:
    0 4px 8px rgba(0,0,0,0.15),
    inset 0 2px 4px rgba(0,0,0,0.05);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.window-header {
  background: -webkit-linear-gradient(135deg, #306997, #183f5a);
  color: white;
  padding: 10px 20px;
  letter-spacing: 1.7px;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 8px 8px 8px rgba(0,0,0,0.3);
  box-shadow: inset 0 -40px 14px rgba(0,0,0,0.1);
}

.window-body {
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1a1a1a;
}

.message-content {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  width: 100%;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.6;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  color: #000000;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
  margin-bottom: 24px;
  text-align: left;
  font-weight: 500;
}

/* link styling */
:global(.message-content .fake-link) {
    color: #0066cc;
    text-decoration: underline;
    cursor: default;
    pointer-events: none;
    display: inline-block;
    margin: 4px 0;
}

/* feedback */
.feedback {
  font-size: 1.1rem;
  text-align: left;
  text-indent: 320px;
  margin-bottom: 20px;
  letter-spacing: .6px;
  font-weight: 500;
  line-height: 28px;
  color: #1b1010;
}

/* buttons container */
.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(255,255,255,0.2);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
}

/* scam button */
.btn-scam {
  background-color: #dc3545;
  color: white;
  letter-spacing: .8px;
}

/* legit button */
.btn-legit {
  background-color: #28a745;
  color: white;
  letter-spacing: .8px;
}

/* continue button */
.btn-next {
  background-color: #0a0a0a;
  color: white;
  padding: 10px 28px;
  font-size: 1rem;
  background-color: purple;
}

.continue-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

</style>