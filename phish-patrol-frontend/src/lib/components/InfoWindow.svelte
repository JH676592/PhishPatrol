<script lang="ts">
  import mascot from '$lib/assets/mascot.webp';
  export let onClose: () => void;
</script>

<div class="window">
  <div class="window-header">
    <span>PHISHING DATABASE</span>
    <button class="close-btn" on:click={onClose}>×</button>
  </div>

  <div class="window-body">
    <div class="content-container">
      <div class="mascot-container">
        <img src={mascot} alt="Phish Patrol Mascot" class="mascot" />
        <div class="mascot-caption">
          "Stay vigilant, Agent! Here is your field guide."
        </div>
      </div>

      <div class="info-text">
        <h3>Common Threat Types</h3>
        
        <div class="threat-entry">
          <h4>Phishing (General)</h4>
          <p>
            The practice of sending fraudulent communications that appear to come from a reputable source. 
            <strong>Goal:</strong> To steal sensitive data like credit card numbers and login information.
          </p>
        </div>

        <div class="threat-entry">
          <h4>Smishing (SMS Phishing)</h4>
          <p>
            Phishing attacks delivered via text message (SMS). These often contain short, urgent messages with malicious links, 
            asking you to "verify" an account or claim a prize.
          </p>
        </div>

        <div class="threat-entry">
          <h4>Spear Phishing</h4>
          <p>
            A highly targeted attack personalized for a specific individual or organization. Attackers often research 
            the victim beforehand to make the message seem trustworthy.
          </p>
        </div>

	<div class="threat-entry">
          <h4>Whaling (CEO Fraud)</h4>
          <p>
            A specific type of spear phishing that targets high-profile executives or impersonates them. 
            <strong>Goal:</strong> To trick employees into authorizing large wire transfers or revealing tax information under the guise of an "urgent request" from the boss.
          </p>
        </div>

        <div class="threat-entry">
          <h4>Pretexting</h4>
          <p>
            The attacker creates a fabricated scenario (the pretext) to steal information. Common examples include impersonating 
            IT support needing your password to "fix a glitch" or HR verifying details for a "payroll update."
          </p>
        </div>

        <div class="threat-entry">
          <h4>Clone Phishing</h4>
          <p>
            Hackers take a legitimate email you previously received, clone its content completely, but replace the original link 
            or attachment with a malicious one. It often comes with a message like "Resending updated version."
          </p>
        </div>

        <div class="threat-entry">
          <h4>Quid Pro Quo</h4>
          <p>
            "Something for something." The attacker promises a benefit in exchange for information. For example, a scammer might 
            call claiming to be technical support offering to "speed up" your computer if you disable your antivirus.
          </p>
        </div>

        <div class="threat-entry">
          <h4>Angler Phishing</h4>
          <p>
            Attacks targeted at social media users. Scammers create fake customer support accounts and intercept complaints 
            users post on public feeds, offering to "resolve" the issue via a malicious DM link.
          </p>
        </div>

        <div class="threat-entry">
          <h4>🚩 Key Red Flags</h4>
          <ul>
            <li><strong>Urgency:</strong> "Act now or your account will be deleted!"</li>
            <li><strong>Generic Greetings:</strong> "Dear Customer" instead of your name.</li>
            <li><strong>Suspicious Links:</strong> URLs that utilize misspellings (e.g., g0ogle.com).</li>
            <li><strong> unexpected Attachments:</strong> Invoices or receipts you didn't ask for.</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <button class="btn btn-close" on:click={onClose}>Close Database</button>
    </div>
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

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
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

  .mascot-container {
    flex: 0 0 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #e8eff5;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #d1d9e0;
    height: fit-content;
  }

  .mascot {
    width: 150px;
    height: auto;
    margin-bottom: 10px;
    filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));
  }

  .mascot-caption {
    font-size: 0.9rem;
    font-style: italic;
    color: #555;
  }

  .info-text {
    flex: 1;
    color: #333;
    overflow-y: auto;
  }

  h3 {
    margin-top: 0;
    border-bottom: 2px solid #306997;
    padding-bottom: 10px;
    color: #183f5a;
  }

  .threat-entry {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #eee;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  h4 {
    margin: 0 0 5px 0;
    color: #c0392b;
  }

  ul {
    padding-left: 20px;
    margin: 5px 0;
  }

  li {
    margin-bottom: 5px;
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

  .btn-close {
    background-color: #3c1f7a;
    color: white;
  }

  .btn-close:hover {
    background-color: #190535;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
</style>
