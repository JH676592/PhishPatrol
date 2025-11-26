<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    
    export let onClose: () => void;

    let leaderboard: any[] = [];
    let fetchError: string | null = null;
    let isLoading: boolean = true;
    
    interface LeaderboardEntry {
        username: string;
        score: number;
        name?: string;
    }

    async function fetchLeaderboard() {
        const apiUrl = 'http://localhost:8080/auth/leaderboard'; 
        isLoading = true;
        fetchError = null;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                fetchError = `API returned status ${response.status}.`;
            } else {
                leaderboard = await response.json() as LeaderboardEntry[];
            }

        } catch (e) {
            console.error("Leaderboard fetch error:", e);
            fetchError = `Could not connect to game server API at ${apiUrl}.`;
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchLeaderboard();
    });

    function getRank(index: number): number { return index + 1; }
    function getDisplayName(player: any): string {
        return player.name && player.name.trim() !== '' ? player.name : player.username;
    }

</script>

<div class="modal-backdrop" transition:fade>
    <div class="window">
        <div class="window-header">
            <span class="header-title">GLOBAL LEADERBOARD</span>
            <button class="close-btn" on:click={onClose}>×</button>
        </div>

        <div class="window-body">
            <div class="content-container">
                <div class="leaderboard-container">
                    
                    {#if isLoading}
                        <h3 class="status-title">Loading Leaderboard...</h3>
                    {:else if fetchError}
                        <div class="threat-entry error-box">
                            <h4>Connection Error</h4>
                            <p>Could not fetch data from the server API.</p>
                            <p class="error-detail">{fetchError}</p>
                        </div>
                    {:else if leaderboard.length === 0}
                        <div class="threat-entry status-box">
                            <h4>Board is Empty</h4>
                            <p>Be the first player to achieve a score and register on the leaderboard!</p>
                        </div>
                    {:else}
                        <h3 class="status-title">Top 10 Agents</h3>

                        <main class="leaderboard-list">
                            <div class="entry header-row">
                                <span class="rank-icon">Rank</span>
                                <span class="name-column">Player / Username</span>
                                <span class="score-column">Score</span>
                            </div>

                            {#each leaderboard as player, i}
                                <div class="entry" class:is-top-3={i < 3}>
                                    <span class="rank-icon">
                                        {#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{:else}{getRank(i)}{/if}
                                    </span>
                                    <div class="name-column">
                                        <span class="display-name">{getDisplayName(player)}</span>
                                        <span class="username-small">@{player.username}</span>
                                    </div>
                                    <span class="score-column">{player.score.toLocaleString()}</span>
                                </div>
                            {/each}
                        </main>
                    {/if}

                </div>
            </div>
            
            <div class="footer">
                <button class="btn btn-close-modal" on:click={onClose}>Close Leaderboard</button>
            </div>
        </div>
    </div>
</div>

<style>

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .window {
    width: 800px;
    max-width: 90vw;
    max-height: 85vh;
    background-color: #f9f9f9;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.05);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeIn 0.3s ease-out;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .window-header {
      position: relative;
      font-family: "Montserrat", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
      background: #3c1f7a;
      color: white;
      padding: 8px 20px;
      font-weight: bold;
      font-size: 1.3rem;
      text-align: center;
      letter-spacing: 0.18rem;
      border: 2px solid black;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
  }
  
  .header-title {
      display: block;
      width: 100%;
      text-align: center;
  }
  
  .close-btn {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    z-index: 10;
  }

  .close-btn:hover {
    color: #ffcccc;
  }

  .window-body {
    padding: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
  }

  .content-container {
    display: flex;
    padding: 24px;
    gap: 24px;
  }

  .leaderboard-container {
      flex: 1;
      color: #333;
  }

  h3 {
    margin-top: 0;
    border-bottom: 2px solid #306997;
    padding-bottom: 10px;
    color: #183f5a;
    font-family: 'Montserrat', sans-serif;
  }
  
  .entry {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #eee;
    margin-bottom: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    font-size: 1rem;
  }

  .header-row {
    background: #e8eff5;
    border: 1px solid #d1d9e0;
    color: #1a1a1a;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .is-top-3 {
    border: 2px solid #ffcc00;
    background: linear-gradient(90deg, #fffbeb, #ffffff);
  }

  .rank-icon {
    width: 15%;
    text-align: left;
    font-size: 1.2rem;
  }
  
  .name-column {
    width: 55%; 
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .score-column {
    width: 30%; 
    text-align: right;
    font-weight: bolder;
    color: #c0392b;
    font-size: 1.1rem;
  }
  
  .header-row .score-column {
      color: #1a1a1a;
  }
  
  .display-name {
    font-weight: bold;
    color: #333;
  }
  
  .username-small {
    font-size: 0.8rem;
    color: #555;
    font-weight: normal;
  }

  .threat-entry h4 {
      color: #306997;
  }
  
  .error-box h4 {
      color: #c0392b;
  }

  .footer {
    padding: 15px;
    background: #eee;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ddd;
  }

  .btn {
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-close-modal {
    background-color: #3c1f7a;
    color: white;
  }

  .btn-close-modal:hover {
    background-color: #190535;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
</style>