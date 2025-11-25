<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function startGame() {
    dispatch('startGame');
  }
</script>

<div class="window">
    <div class="window-header">Welcome</div>
    <div class="window-body">
        <div class="intro-title">
            <span class="title-text">How to Play</span>
            <img src="/background/logoname.png" alt="Phish Patrol Logo" class="logo-inline"/>
        </div>

            <p>Discover how to spot scams and defend yourself from phishing attacks</p>
            
            <h2>Getting Started</h2>
            <ul>
                <li>Register and select your experience level</li>
                <li>Read the storyline briefing before playing</li>
                <li>Check the <strong>Resources</strong> database to study phishing methods.</li>
            </ul>

            <h3>Game Play</h3>
            <ul>
                <li>Notifications for emails and messages will appear during the game.</li>
                <li>Click the icon to read the message and decide if it's <em>legit</em> or <em>phishing</em>.</li>
                <li>AI generated feedback will appear with an explanation of what makes that email or message legit or phishing.</li>
            </ul>

            <h4>Difficulty & Scenarios</h4>
            <ul>
                <li>Scenarios vary in phishing methods, so each email and message will be vary.</li>
                <li>Difficulty level of scenarios depends on your skill level.</li>
            </ul>

            <h5>Saving, Scoring, & Leaderboard</h5>
            <ul>
                <li>Logging out of the game will save your progress so you can pick up where you left off.</li>
                <li>Stakes get higher as the game continues, so speed and accurancy is important.</li>
                <li>Stay motivated and compare your score to the stats in the <strong>Leaderboard</strong>.</li>
            </ul>

            <button class="btn btn-next" on:click={startGame}>Start Game</button>
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

/*----------------BODY------------------*/
.window-body {
  padding: 20px 30px;
  color: #1a1a1a;
  box-sizing: border-box;
  overflow-y: auto;  
  overflow-x: hidden; 
  box-sizing: border-box;
  height: calc(80vh-60px);
  font-family: "Montserrat", sans-serif;
}

/*--------------INTRO TEXT-----------*/
.intro-title{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.title-text {
  font-size: 2rem;
  color:  #3c1f7a;
  font-family: "Bagel Fat One", system-ui;
  font-weight: 400;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.07rem;
}

.intro-title + p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    text-align: center;
    color: #000000;
    font-weight: 500;
    letter-spacing: 0.0rem;
    word-spacing: 0.03rem;
}
.logo-inline {
    width: auto;
    height: 45px;
    transform: translateY(7px);
    display: inline-block;
}


/*------HEADINGS---------*/

h2, h3, h4, h5 {
  color: #3c1f7a;
  margin-top: 20px;
  margin-bottom: 10px;
  font-family: "Bagel Fat One", system-ui;
  font-weight: bold;
  font-size: 1.5rem;
  letter-spacing: 0.13rem;

}

/*-----------LISTS-------*/

ul {
  margin: 0 0 16px 20px;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

ul li::marker {
  color: #3c1f7a;
  font-weight: bold;
}

:global(body) {
  overflow-x: hidden;
}

/* ------------------------ BUTTONS ---------------------*/

.btn-next {
  display: block;
  margin: 25px auto 0;
  background-color: #2ba120;
  color: white;
  font-size: 1.3rem;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
  transition: all 0.2s ease;
}

.btn-next:hover {
  background-color: #1f5e31;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(255,255,255,0.2);
}

.btn-next:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
}

/*--------------- ANIMATION ------------*/

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%) scale(1); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/*------------------- RESPONSIVE ADJUSTMENTS--------------- */
@media (max-width: 768px) {
  .window { width: 90vw; max-width: 95vw; }
  h2, h3, h4, h5 { font-size: 1.2rem; }
  .intro p, .intro li { font-size: 1rem; }
  .btn-next { font-size: 1.1rem; padding: 10px 20px; }
}

@media (max-width: 480px) {
  .window { width: 95vw; max-width: 95vw; }
  h2, h3, h4, h5 { font-size: 1rem;}
  .intro p, .intro li { font-size: 0.9rem; }
  .btn-next { font-size: 0.95rem; padding: 8px 16px; }
}
</style>