<script lang="ts">
  import type { Scenario } from '$lib/types';
  import{healthbar} from '$lib/stores/stores'
  import DesktopIcons from './DesktopIcons.svelte';

  export let currentScenario: Scenario; // current sms or email scenario
  export let onComplete: () => void; 

  let isAnswered = false; // tracks user answer
  let userChoice: boolean | null = null; // stores user answer
  let feedbackMessage = ''; // stores feedback msg 

  let feedbackRef: HTMLDivElement | null = null; 
  let index = 0;
  let typedExplanation = "";
  let showCursor = true;

  // Formatting for the emails and sms messages, work in progress
  function formatMessage(content: string): string {

    content = content.replace(/\\n/g, '\n');

     // Remove excessive newlines
    let cleaned = content.replace(/\n{2,}/g, '\n');

    let formatted = content
        //Headers
        .replace(/(Subject:)/i, '<br><strong>Subject:</strong> ')
        .replace(/(From:)/i, '<strong>From:</strong> ')
        //Greetings
        //.replace(/(To:)/i, '<br><strong>To:</strong> ')
        //.replace(/(Date:)/i, '<br><strong>Date:</strong> ')
        .replace(/(Dear\s+\w+[,]?)/i, '$1')
        //URLs
        .replace(/((?:https?|hxxps?|hxxp):\/\/[^\s]+)/gi, '<span class="fake-link">$1</span>')
        //Signed
        .replace(/(Thank you,|Best,|Sincerely,)/gi, '$1')
        //replace new lines
        .replace(/\n/g, '<br>');

    return formatted;
  }

  function playSound(isCorrect: boolean) {
    const soundId = isCorrect ? "correct-sound" : "incorrect-sound";
    const audio = document.getElementById(soundId) as HTMLAudioElement;
    audio?.play();
  }

  // Take answer from player and returns feedback msg
  function handleAnswer(choice: boolean) {
    userChoice = choice;
    isAnswered = true;

    const isCorrect = choice === currentScenario.isScam;
    healthbar.update(n=> Math.max(0, Math.min(100, isCorrect ? n+50 : n-50)))

    playSound(isCorrect);

    setTimeout(() => {
      // Feedback message returned depending on user answer
      feedbackMessage = isCorrect ? 'CORRECT' : 'INCORRECT';
      
      
      requestAnimationFrame(() => {
        typedExplanation = '';
        //Call typewriter function for typing effect for feedback msg
        typeWriter(currentScenario.explanation);

        feedbackRef?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
      });
    }, 300);
  }

  function typeWriter(text: string, speed = 25) {
    typedExplanation = '';
    showCursor = true;
    let i = 0;

    const interval = setInterval(() => {
      typedExplanation += text[i];
      i++;

      const windowBody = document.querySelector('.window-body');
      if (windowBody) {
        windowBody.scrollTo({ top: windowBody.scrollHeight, behavior: 'smooth' });
      }

      if (i >= text.length) {
        clearInterval(interval);
        showCursor = false;
      }
    }, speed);
  }

  // Handles user clicking continue
  function handleContinue() {
    isAnswered = false;
    userChoice = null;
    feedbackMessage = '';
    typedExplanation = '';
    onComplete(); // notify parent window is done so window will close
  }

</script>

<!-------AUDIO------->
<audio id="correct-sound" src="/sounds/correct.mp3" preload="auto"></audio>
<audio id="incorrect-sound" src="/sounds/incorrect.wav" preload="auto"></audio>

<div class="window">
    <div class="window-header">
        <span>NEW {currentScenario.type}</span>
    </div>

    <div class="window-body">
        <div class="message-content">
            {@html formatMessage(currentScenario.content)}
        </div>

        {#if !isAnswered}
            <div class="button-group">
                <button class="btn btn-scam" on:click={() => handleAnswer(true)}>Scam</button>
                <button class="btn btn-legit" on:click={() => handleAnswer(false)}>Legit</button>
            </div>
        {:else}
            <div class="feedback" bind:this={feedbackRef}>
              <div class="feedback-text"
                class:correct={userChoice === currentScenario.isScam}
                class:incorrect={userChoice !== currentScenario.isScam}
                >
                {feedbackMessage}
              </div>
              <div class="explanation">
                {typedExplanation}<span class="typing-cursor" class:hidden={!showCursor}>|</span>
              </div>

              <div class="continue-container">
                <button class="btn btn-next" on:click={handleContinue}>Continue</button>
            </div>
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
  width: 80vw;
  max-width: 1000px;
  min-width: 400px;
  max-height: 80vh;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16px;
  border: none;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.15),
    inset 0 1px 2px rgba(255,255,255,0.3);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif;
}

.window-header {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  background: #3c1f7a;
  color: white;
  padding: 8px;
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center;
  box-shadow: inset 0 -2px 6px rgba(0,0,0,0.1);
  border-color: #1a1a1a;
  border-width: 1px;
  letter-spacing: 0.18rem;
  border: 2px solid black;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.window-body {
  padding: 20px 30px;
  color: #1a1a1a;
  box-sizing: border-box;
  overflow-y: auto;  
  overflow-x: hidden; 
  box-sizing: border-box;
  height: calc(80vh-60px);
}

.message-content {
  background: #f4f7fc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e4eb;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  line-height: 1.6;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 16px;
}

.message-content strong {
  font-weight: 700;
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

:global(body) {
  overflow-x: hidden;
}

/* ---------------- FEEDBACK-----------------*/
.feedback {
  width: 100%;
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  align-items: center;
}

.feedback-text {
  font-size: 2.5rem;
  border-radius: 12px;
  font-family: "Bagel Fat One", system-ui;
  font-weight: 400;
  font-style: normal;
  padding: 0px;
}

.feedback-text.correct {
  color: #28a745;
  text-shadow: 0 0 5px #00ff22;
  letter-spacing: 0.2rem;
}


.feedback-text.incorrect {
  color: #c31212;
  text-shadow: 0 0 5px rgb(255, 0, 0);
  letter-spacing: 0.3rem;
}

.explanation {
  min-height: 4rem;
  line-height: 1.5;
  font-size: 1rem;
  margin: 1rem auto 0;
  text-align: left;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-family: "Montserrat", sans-serif;
}
.typing-cursor {
  display: inline-block;
  width: 1ch;
  animation: blink 0.7s steps(1) infinite;
  color: #1a1a1a;
}

.hidden {
  display: none;
}

/* ------------------------ BUTTONS ---------------------*/

.button-group, .continue-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn {
  font-family: "Montserrat", sans-serif;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: .1rem;
  transition: all 0.15s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(255,255,255,0.2);
}

.btn-scam:hover {
  background-color: #831717;
}

.btn-legit:hover {
  background-color: #12552e;
}

.btn-next:hover {
  background-color: rgb(48, 21, 67);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
}

.btn-scam { background-color: #dc3545; color: white; }
.btn-legit { background-color: #28a745; color: white; }
.btn-next { background-color: #723c94; color: white; }


/*--------------- ANIMATION ------------*/

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%) scale(1); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes popIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

/*------------------- RESPONSIVE ADJUSTMENTS--------------- */
@media (max-width: 768px) {
  .window {
    width: 90vw;
    max-width: 95vw;
  }

  .window-header {
    font-size: 1rem;
    padding: 8px 12px;  
  }

  .message-content, .feedback {
    font-size: 0.9rem; 
    padding: 12px;
  }

  .btn {
    padding: 6px 12px; 
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .window {
    width: 95vw;
    max-width: 95vw;
  }

  .window-header {
    font-size: 0.9rem;
  }

  .message-content, .feedback {
    font-size: 0.85rem;
    padding: 10px;
  }

  .btn {
    padding: 5px 10px;
    font-size: 0.85rem;
  }
}
</style>