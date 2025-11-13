<script>
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { tokenStore, visibleStore } from '$lib/stores/auth';

  let username = '';
  let password = '';
  let email = '';
  let errorRegisterText = '';

  // chaniging modal to Register vars
  let loginTitle = "Login"
  export const loginVisibleStore = writable(true);

  export const errorIncorrectLogin = writable(false), 
  errorUserAndPass = writable(false), 
  errorPasswordLength = writable(false),
  errorRegister = writable(false);

  function closeModal() {
    visibleStore.set(false);
    loginVisibleStore.set(true);
  }

  function openModal() {
    loginTitle = "Login"
    visibleStore.set(true);
  }

  // modal bug fix maybe
  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      tokenStore.set(token);
      visibleStore.set(false); // hide modal if token exists
    }
  });


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
      errorIncorrectLogin.set(true);
    }
  }

  async function register() {
    /*have to set all errors to default*/
    errorIncorrectLogin.set(false);
    errorPasswordLength.set(false);
    errorUserAndPass.set(false);
    errorRegister.set(false);

    if (loginTitle == "Login"){
      loginTitle = "Register";
      loginVisibleStore.set(false);
      return;
    }

    if (!username.trim() || !password.trim()) {
      errorUserAndPass.set(true);
      return;
    } else if (password.length < 8){
      errorPasswordLength.set(true);
      return;
    }

    const res = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      alert('Registration successful!');
      loginTitle = "Login";
      loginVisibleStore.set(true);
    } else {
      const errorText = await res.text();
      errorRegisterText = errorText;
      errorRegister.set(true);
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
    <h2 class="login-title">{loginTitle}</h2>
    <input bind:value={username} placeholder="Username" />
    <input bind:value={password} type="password" placeholder="Password" />
    {#if !$loginVisibleStore}
    <input bind:value={email} type="email" placeholder="Email (Optional)" />
    {/if}

    {#if $loginVisibleStore}
    <button class="login-btn" on:click={login}>Login</button>
    {#if $errorIncorrectLogin}
    <p class="login-error">Invalid Credentials. Try Again.</p>
    {/if}

    <p class="register-text">
      Don't have an account?
    </p>
    {/if}

    <button class="register-btn" on:click={register}>Register</button>
    {#if $errorUserAndPass}
    <p class="register-error">Username and password are required</p>
    {/if}
    {#if $errorPasswordLength}
    <p class="register-error">The password needs to have at least 8 characters</p>
    {/if}
    {#if $errorRegister}
    <p class="register-error">{errorRegisterText}</p>
    {/if}  
  </div>
</div>
{/if}

{#if !$visibleStore && !$tokenStore}
<div class="login-container">
  <button class="login" on:click={openModal}>Login</button>
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

  .login-error{
    font-size: 0.7rem;
    color: #df0808;
    margin: 0%;
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

  .register-error{
    font-size: 0.7rem;
    color: #df0808;
    margin: 0%;
  }

  .login-container {
    position: fixed;
    top: 5%;
    left: 90%;
    display: flex;
    align-items: center;
}


  .login {
    background-color: #3d13f7;
    color: white;
    font-family: 'Roboto Mono', monospace;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    margin-left: 12px;
    left: 90%;
    bottom: 42%;
  }

  .login:hover{
    background-color: #310fc8;
  }
</style>
