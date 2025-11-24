<script lang="ts">
  import LoginModal from "$lib/components/LoginModal.svelte";
  import DesktopIcons from "$lib/components/DesktopIcons.svelte";
  import { tokenStore } from "$lib/stores/auth";
  import MessageWindow from "$lib/components/MessageWindow.svelte";
  import LeaderboardModal from "$lib/components/LeaderboardModal.svelte";
  import {
    scenarioQueue,
    removeScenarioFromQueue,
    clearScenarioQueue,
  } from "$lib/stores/scenarioQueue";
  import type { Scenario } from "$lib/types";
  import { ScenarioType } from "$lib/types";
  import { get } from "svelte/store";

  function logout() {
    localStorage.removeItem("token");
    tokenStore.set("");
    clearScenarioQueue();
  }

  let showMessages = false;
  let showLeaderboard = false;
  let currentScenario: Scenario | null = null;

  // Opens next scenario for SMS from the queue from the store and displays it in MessageWindow
  function openMessages() {
    const queue = get(scenarioQueue); //queue
    const nextSMS = queue.find((s) => s.type === ScenarioType.SMS); //first sms in queue
    if (nextSMS) {
      currentScenario = nextSMS; //set as current
      showMessages = true; //show MessageWindow
      removeScenarioFromQueue(nextSMS.id); //remove from queue
    }
  }

  function openLeaderboard() {
      showLeaderboard = true;
  }

  function handleLeaderboardClose() {
      showLeaderboard = false;
  }

  // Same as for SMS but Email
  function openEmail() {
    const queue = get(scenarioQueue);
    const nextEmail = queue.find((s) => s.type === ScenarioType.EMAIL);
    if (nextEmail) {
      currentScenario = nextEmail;
      showMessages = true;
      removeScenarioFromQueue(nextEmail.id);
    }
  }

  // handles closing window when user selects continue button
  function handleComplete() {
    showMessages = false; //hide MessageWindow
    currentScenario = null; //clear current scenario
  }

  interface ScorePayload {
    username: string;
    score: number;
  }

  async function testSaveScore() {
    const payload: ScorePayload = {
      username: "test_user_1",
      score: 500,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const text = await response.text();
        alert("Success: " + text);
      } else {
        alert("Error saving score: " + response.status);
      }
    } catch (error) {
      console.error(error);
      alert("Connection failed!");
    }
  }
</script>

<!-----------------------------DESKTOP/HOME PAGE----------------------------------------->

<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap"
    rel="stylesheet"
  />
</head>

<div class="desktop">
  <header class="header">
    <div class="header-content">
      <h1>PHISH PATROL</h1>
      <img src="/icons/fishing.png" alt="Fish" class="logo" />
      <!----<a href="https://www.flaticon.com/free-icons/fishing" title="fishing icons">Fishing icons created by Hilmy Abiyyu A. - Flaticon</a>-->
    </div>
  </header>

  <!---------Desktop Icons------------>
  <DesktopIcons on={{ openMessages: openMessages, openEmail: openEmail }} />

  <!---------Message Window------------>
  {#if showMessages && currentScenario}
    <MessageWindow {currentScenario} onComplete={handleComplete} />
  {/if}

  {#if showLeaderboard}
    <LeaderboardModal onClose={handleLeaderboardClose} />
  {/if}
  <!-----------------------------Taskbar---------------------------------->
  <div class="taskbar">
    <!-----------Left Items------------>
    <div class="taskbar-left">
      <div class="left-item">
        <img src="/icons/play.png" alt="Play" class="left-icons" />
        <!-----<a href="https://www.flaticon.com/free-icons/play-button" title="play button icons">Play button icons created by Freepik - Flaticon</a>-->
        <div class="left-label">Play</div>
      </div>
      <div class="left-item">
        <img src="/icons/book.png" alt="Resources" class="left-icons" />
        <div class="left-label">Resources</div>
      </div>
      <div class="left-item"> 
        <button class="taskbar-button" on:click={openLeaderboard} type="button">
          <img src="/icons/leaderboard.png" alt="Leaderboard" class="left-icons" />
          <div class="left-label">Leaderboard</div> 
        </button>
      </div>
    </div>

    <!-----------Center Items-------------->
    <div class="taskbar-center">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search database..."
        />
      </div>
    </div>

    <!-----------Right Items------------->
    <div class="taskbar-right">
      <div>
        {#if $tokenStore}
          <button class="logout-btn" on:click={logout}>Logout</button>
        {/if}
      </div>
      <div class="wifi">
        <img src="/icons/wifi.png" alt="Wifi" class="right-icons" />
        <!---<a href="https://www.flaticon.com/free-icons/wifi" title="wifi icons">Wifi icons created by Aldo Cervantes - Flaticon</a>-->
      </div>
      <div class="battery">
        <img src="/icons/battery.png" alt="Battery" class="right-icons" />
        <!--<a href="https://www.flaticon.com/free-icons/battery" title="battery icons">Battery icons created by Stockio - Flaticon</a>-->
      </div>
      <div class="datetime">
        <div class="clock">11:52 AM</div>
        <div class="date">10/31/2025</div>
      </div>
    </div>
  </div>
  <LoginModal />
</div>

<!--Login Modal on site launch-->

<!-----------------------------------STYLES------------------------------------->
<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  .desktop {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: url("/background/desktop.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: "Segoe UI", sans-serif;
    color: white;
    flex-wrap: wrap;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  header h1 {
    font-family: "Roboto Mono";
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
    line-height: 140%;
    text-align: center;
    letter-spacing: 0.15em;
    color: #000000;
    mix-blend-mode: hard-light;
    opacity: 0.8;
  }

  .logo {
    height: 65px;
    width: 65px;
    line-height: 140%;
    text-align: center;
  }

  /* Taskbar */

  .taskbar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    min-width: 0;
    height: 78px;
    padding: 0 16px;
    background: #b9b2b29e;
    flex-wrap: wrap;
  }

  .taskbar-center,
  .taskbar-left,
  .taskbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1 1 auto;
    min-width: 0;
  }
  .taskbar-button {
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      color: inherit; 
    
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%; 
      line-height: normal; 
  }

  .taskbar-center {
    justify-content: center;
    flex: 0 1 300px;
  }

  .taskbar-right {
    justify-content: flex-end;
  }

  /* Taskbar Left */

  .taskbar-left {
    display: flex;
    gap: 40px;
    padding: 10px;
    flex-wrap: wrap;
  }

  .left-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    cursor: pointer;
    user-select: none;
    font-size: 12px;
  }

  .left-icons {
    width: 50px;
    height: 50px;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.6));
  }

  .left-label {
    margin-top: 2px;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
    letter-spacing: 1px;
    text-shadow:
      -1px -1px 0 #2a2699d1,
      1px -1px 0 #2a2699d1,
      -1px 1px 0 #2a2699d1,
      1px 1px 0 #2a2699d1;
  }

  /* Search Bar */

  .search-container {
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 0 12px;
    flex-wrap: wrap;
  }

  .search-input {
    padding: 6px 10px;
    font-size: 15px;
    border-radius: 6px;
    background-color: #e0e0e0;
    width: 100%;
    max-width: 250%;
    box-shadow: inset 1px 1px 2px 2px rgba(3, 219, 89, 0.426);
  }

  /* Logout Button */
  .logout-btn {
    background-color: #ef4444;
    color: white;
    font-family: "Roboto Mono", monospace;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    margin-left: 12px;
  }

  .logout-btn:hover {
    background-color: #dc2626;
  }

  /* Taskbar Right */

  .taskbar-right {
    display: flex;
    align-items: center;
    padding: 5px;
  }

  .right-icons {
    width: 30px;
    height: 30px;
    object-fit: contain;
    padding: 12px;
  }

  .datetime {
    display: flex;
    padding: 10px;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    color: rgb(0, 0, 0);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.1px;
    text-shadow:
      0.5px 0px 0 rgba(255, 255, 255, 0.653),
      0px 0px 0 rgba(255, 255, 255, 0.653),
      0px 0px 0 rgba(255, 255, 255, 0.653),
      0px 0px 0 rgba(255, 255, 255, 0.653);
  }
</style>
