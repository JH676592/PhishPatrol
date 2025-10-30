<script>
  import { writable } from 'svelte/store';

  let username = '';
  let password = '';
  export const visibleStore = writable(true); // control modal visibility

  export const tokenStore = writable('');

  function closeModal() {
    visibleStore.set(false);
  }

  function openModal() {
    visibleStore.set(true);
  }

  async function login() {
    const res = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
      const data = await res.json();
      tokenStore.set(data.token);
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      closeModal();
    } else {
      const errorText = await res.text();
      alert('Login failed: ' + errorText);
    }
  }

  async function register() {
    if (!username.trim() || !password.trim()) {
      alert('Username and password are required.');
      return;
    } else if (password.length < 8){
      alert('The password needs to have at least 8 characters.');
      return;
    }

    const res = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      alert('Registration successful!');
    } else {
      const errorText = await res.text();
      alert('Registration failed: ' + errorText);
    }
  }
</script>

{#if $visibleStore}
<div class="modal">
  <div class="title-bar">
    <span class="window-title">Phish Patrol</span>
    <button class="close-btn" on:click={closeModal}>×</button>
  </div>

  <div class="content">
    <h2 class="login-title">Login</h2>
    <input bind:value={username} placeholder="Username" />
    <input bind:value={password} type="password" placeholder="Password" />

    <button class="login-btn" on:click={login}>Login</button>

    <p class="register-text">
      Don't have an account?
    </p>
    <button class="register-btn" on:click={register}>Register</button>
  </div>
</div>
{/if}

{#if !$visibleStore && !$tokenStore}
<div class="login-container">
  <button class="login" on:click={openModal}>Login?</button>
</div>
{/if}

<style>
  .modal {
    font-family: 'Roboto Mono', monospace;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(200, 225, 240);
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    width: 340px;
    overflow: hidden;
    z-index: 1000;
  }

  .title-bar {
    background: linear-gradient(to right, #4b5563, #6b7280);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }

  .window-title {
    user-select: none;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 0.4rem;
    transition: background-color 0.2s ease;
    border-radius: 4px;
  }

  .close-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 1.8rem;
    gap: 0.9rem;
    text-align: center;
  }

  .login-title {
    color: #374151;
    margin-top: 0.1rem;
  }

  input {
    padding: 0.8rem;
    border: none;
    border-radius: 10px;
    background-color: #f7f9fb;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.4);
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 10px;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .login-btn {
    background-color: #3b82f6;
    color: white;
  }

  .login-btn:hover {
    background-color: #2563eb;
  }

  .register-text {
    font-size: 0.6rem;
    color: #374151;
    margin-top: 1rem;
    margin-bottom: 0;
  }

  .register-btn {
    background-color: #10b981;
    color: white;
  }

  .register-btn:hover {
    background-color: #059669;
  }

  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    z-index: 2000;
}

.login {
  font-family: 'Roboto Mono', monospace;
  background-color: #5734f0;
  color: white;
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  font-size: 1rem;
  margin-left: 92%;
  margin-bottom: 42%;
}
</style>
