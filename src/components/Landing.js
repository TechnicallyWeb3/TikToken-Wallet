import React, { createContext, useState } from 'react';
import { AppContext } from '../AppContext'; // Replace '../' with the correct path to the AppContext file


function Landing() {
  const [tiktokHandle, setTiktokHandle] = useState('');

  const handleConnectClick = () => {
    if (tiktokHandle.trim() !== '') {
        console.log("Logging In")
        appContext.login(tiktokHandle);
    }
  };

  const handleConnectWallet = () => {
    console.log("Connecting Wallet...")
  }

  // Access the appContext from the useContext hook
  const appContext = React.useContext(AppContext);

  return (
    <div className="landing" style={{ margin: '50px', padding: '50px' }}>
      <div>
        <label htmlFor="walletInput" style={{ marginBottom: '5px' }}>
          Connect Web3 Wallet:
        </label>
        <p style={{ fontSize: '8px' }}>Required to send TIK to a TikTok account.</p>
        <button type="button" onClick={handleConnectWallet} style={{ width: '100%' }}>
          Connect Wallet
        </button>
      </div>
      <form>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '50px' }}>
          <label htmlFor="tiktokInput" style={{ marginBottom: '5px' }}>
            Connect TikTok Account:
          </label>
          <input
            type="text"
            id="tiktokInput"
            placeholder="tiktok_handle"
            value={tiktokHandle}
            onChange={(e) => setTiktokHandle(e.target.value)}
          />
          <button type="button" onClick={handleConnectClick} style={{ width: '100%' }}>
            Connect
          </button>
        </div>
      </form>
    </div>
  );
}

export { AppContext }; // Export the AppContext
export default Landing;
