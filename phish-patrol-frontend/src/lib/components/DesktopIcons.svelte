<script lang="ts">
  import { scenarioQueue } from '$lib/stores/scenarioQueue';
  import { ScenarioType } from '$lib/types';
  import { get } from 'svelte/store';

  export let on: { openMessages: () => void; openEmail: () => void};
  
  let emailCount = 0;
  let smsCount = 0;
  
  $: emailCount = $scenarioQueue.filter(s => s.type === ScenarioType.EMAIL).length;
  $: smsCount = $scenarioQueue.filter(s => s.type === ScenarioType.SMS).length;
  

  /*$: {
    const queue = get(scenarioQueue);
    emailCount = queue.filter(s => s.type === ScenarioType.EMAIL).length;
    smsCount = queue.filter(s => s.type === ScenarioType.SMS).length;
  }*/

  function handleClickMessages() {
    console.log("Messages icon clicked");
    on?.openMessages?.();
  }

  function handleClickEmail() {
    console.log("SMS icon clicked");
    on?.openEmail?.();
  }
 
</script>

<div class="icons">
  <button class="icon" type="button" on:click={handleClickEmail}>
    {#if emailCount > 0}
      <div class="badge">{emailCount}</div>
    {/if}
    <img src="/icons/gmail.png" alt="Email" class="icon-img"/>
    <div class="icon-label">Email</div>
  </button>
  
  <button class="icon" type="button" on:click={handleClickMessages}>
    {#if smsCount > 0}
      <div class="badge">{smsCount}</div>
    {/if}
    <img src="/icons/chat.png" alt="SMS" class="icon-img"/>
    <div class="icon-label">Messages</div>
  </button>
</div>

<!---
  <a href="/messages" class="icon">
    {#if smsCount > 0}
      <div class="badge">{smsCount}</div>
    {/if}
    <img src="/icons/chat.png" alt="SMS" class="icon-img"/>
    <div class="icon-label">Messages</div>
  </a>
</div>--->

<style>
  
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
  }
  .icon-img {
      width: 64px;
      height: 64px;
      margin-bottom: 8px;
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
