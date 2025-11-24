<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    
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
            <span>GLOBAL LEADERBOARD</span>
        </div>

        <div class="window-body">
            {#if isLoading}
                <p class="status-message">Loading leaderboard...</p>
            {:else if fetchError}
                <div class="error-box">
                    <p class="error-message">🚨 Server Connection Error 🚨</p>
                    <p>{fetchError}</p>
                </div>
            {:else if leaderboard.length === 0}
                <div class="status-box">
                    <p>The leaderboard is currently empty.</p>
                    <p>Be the first to score by playing the game!</p>
                </div>
            {:else}
                <main class="leaderboard-list">
                    <div class="entry header-row">
                        <span class="rank-icon">Rank</span>
                        <span class="name-column">Player Name / Username</span>
                        <span class="score-column header-score-column">Score</span>
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
            
            <div class="continue-container">
                <button class="btn btn-next" on:click={onClose}>Close</button>
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
        position: relative;
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
        max-height: 70vh;
        overflow-y: auto;
    }

    .leaderboard-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 20px;
    }

    .entry {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        background-color: #ffffff;
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .header-row {
        background-color: #e0e0e0; 
        font-weight: bold;
        color: #1a1a1a;
        padding: 8px 16px;
        margin-bottom: 5px;
        border: none;
        box-shadow: none;
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
        padding-left: 0;
    }

    .score-column {
        width: 30%;
        text-align: right;
        font-weight: bolder;
        color: #28a745; 
        font-size: 1.1rem;
    }
    
    .header-row .score-column {
        color: #1a1a1a;
    }

    .display-name {
        font-weight: bold;
        color: #306997;
        line-height: 1.2;
    }
    
    .username-small {
        font-size: 0.8rem;
        color: #555;
        font-weight: normal;
    }

    .is-top-3 {
        border: 2px solid #ffcc00;
        background: linear-gradient(90deg, #fffbeb, #ffffff);
    }

    .error-box, .status-box {
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        width: 100%;
        text-align: center;
        font-weight: bold;
    }
    .status-box { background-color: #e9ecef; color: #306997; }
    .error-box { background-color: #f8d7da; border: 1px solid rgba(220, 53, 69, 0.2); color: #dc3545; }

    .continue-container {
      display: flex;
      justify-content: center;
      width: 100%;
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
        letter-spacing: .8px;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(255,255,255,0.2);
    }

    .btn:active {
        transform: translateY(0);
        box-shadow: 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(255,255,255,0.2);
    }

    .btn-next {
      background-color: #dc3545;
      color: white;
      padding: 10px 28px;
      font-size: 1rem;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
</style>