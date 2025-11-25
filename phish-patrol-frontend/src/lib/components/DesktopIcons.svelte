<script lang="ts">
  import { scenarioQueue } from '$lib/stores/scenarioQueue';
  import { ScenarioType } from '$lib/types';

  export let on: { openMessages: () => void; openEmail: () => void};
  
  export let scenarioOpen: boolean;
  export let disabled: boolean = false;

  // Variables to keep track of email and sms count for queue
  let emailCount = 0;
  let smsCount = 0;

  // when scenarioQueue store changes it updates emailCount, same for smsCount
  $: emailCount = $scenarioQueue.filter(s => s.type === ScenarioType.EMAIL).length;
  $: smsCount = $scenarioQueue.filter(s => s.type === ScenarioType.SMS).length;

  // Called when email icon clicked and opens msg window
  function handleClickMessages() {
    console.log("Messages icon clicked"); //for debugging
    if (disabled || scenarioOpen || smsCount === 0) return;
    on?.openMessages?.();
  }

  // Called when sms icon clicked and opens msg window
  function handleClickEmail() {
    console.log("SMS icon clicked"); // debugging
    if (disabled || scenarioOpen || emailCount === 0) return;
    on?.openEmail?.();
  }


</script>

<div class="icons">
  <button class="icon" type="button" on:click={handleClickEmail} disabled={scenarioOpen || emailCount === 0}>
    {#if emailCount > 0}
      <div class="badge">{emailCount}</div>
    {/if}
    <img src="/icons/gmail.png" alt="Email" class="icon-img"/>
    <div class="icon-label">Email</div>
  </button>
  
  <button class="icon" type="button" on:click={handleClickMessages} disabled={scenarioOpen || smsCount === 0}>
    {#if smsCount > 0}
      <div class="badge">{smsCount}</div>
    {/if}
    <img src="/icons/chat.png" alt="SMS" class="icon-img"/>
    <div class="icon-label">Messages</div>

  </button>
</div>

<style>

  .icon:disabled {
    pointer-events: none;
    opacity: 0.5;
    filter: grayscale(70%);
    cursor: none;
  }
  
  .icons {
      position: absolute;
      top: 80px;
      left: 20px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
  }
  .icon {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      text-align: center;
      text-decoration: none;
      color: black;
      background-color: transparent;
      border: none;
      cursor: pointer
  }
  .icon-label {
    font-size: .9rem;
    font-weight: 400;
    letter-spacing: .04rem;
  }

  .icon-img {
      width: 64px;
      height: 64px;
      margin-bottom: 4px;
  }

  .badge {
      position: absolute;
      top: -5px;
      right: 0px;
    
      background-color: #ff3b30;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 14px;
      font-weight: bold;
    
      border-radius: 50%;
      width: 24px;
      height: 24px;
    
      display: flex;
      justify-content: center;
      align-items: center;
    
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
</style>
