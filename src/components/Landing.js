import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../AppContext'; // Replace '../' with the correct path to the AppContext file
import { ethers } from 'ethers';

function Landing() {
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [networkId, setNetworkId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log('Failed to connect MetaMask wallet:', error);
    }
  };
  const handleConnectTiktok = () => {
    if (tiktokHandle.trim() !== '') {
        console.log("Logging In")
        appContext.login(tiktokHandle);
        window.location.href = `/profile?handle=${tiktokHandle}`;
    }
};

  const switchToPolygonNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Network ID for Polygon (137 in decimal)
      });
      console.log('You have successfully switched to the Polygon network');
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        console.log('This network is not available in your MetaMask, please add it');
      }
      console.log('Failed to switch to the network');
    }
  };

  const initializeProvider = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this wallet.');
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Check if already connected to MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const senderAddress = accounts[0];
      setIsConnected(!!senderAddress); // Update isConnected based on the presence of an account
      setWalletAddress(senderAddress);
      console.log("Connected", senderAddress);

      // Check the network ID and handle network switch/addition
      const networkId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetworkId(networkId);
      if (networkId !== '0x89') { // Network ID for Polygon (change it if using a different network)
        await switchToPolygonNetwork(); // Await the network switching function
      }
    }
  };

  useEffect(() => {
    initializeProvider();

    // Add event listener for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      setIsConnected(accounts.length > 0); // Update isConnected based on the presence of an account
      setWalletAddress(accounts[0] || '');
      console.log("Connected", accounts[0]);
    });

    return () => {
      // Cleanup the event listener
      window.ethereum.removeAllListeners('accountsChanged');
    };
  }, []);

  // Access the appContext from the useContext hook
  const appContext = useContext(AppContext);

  return (

    <div className="landing" style={{ margin: '50px', padding: '50px' }}>
      {!isConnected ? (
        <div>
          <label htmlFor="walletInput" style={{ marginBottom: '5px' }}>
            Connect Web3 Wallet:
          </label>
          <br/>
          <br/>
          <p style={{ fontSize: '15px' }}>Required to send TIK to a TikTok account. To look up user accounts, please use Search or Look-up in the Menu</p>
<br/>
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <button
    type="button"
    onClick={handleConnectWallet}
  >
    Connect Wallet
  </button>
</div>
         <br/>
        </div>
      ) : (
        <>
          <div>
           <br/>
            <label htmlFor="walletInput" style={{ marginBottom: '5px' }}>
              Connected:
            </label>
            <p style={{ fontSize: '15px' }}>{walletAddress}</p>
          </div>
          <br/>
          <button type="button" onClick={() => window.location.href = '/send'} >
            Send TIK
          </button>
        </>
      )}

      <form>
        <br/>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '50px' }}>
          <br/>
<div>
          <label htmlFor="tiktokInput" style={{ marginBottom: '5px' }}>
            Connect TikTok Account:
          </label>
</div>
<br/>
          <input
            type="text"
            id="tiktokInput"
            placeholder="tiktok_handle"
            value={appContext.tiktokHandle}
            onChange={(e) => setTiktokHandle(e.target.value)}
          />

        </div>
      </form>
 <button type="button" onClick={handleConnectTiktok}>Connect</button>
    </div>
  );
}

export { Landing };
export default Landing;