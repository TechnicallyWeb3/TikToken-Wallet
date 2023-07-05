import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/App.css';

import { ethers } from 'ethers';

library.add(faCopy, faGlobe);

const formatTransactionValue = (value) => {
  const tikValue = parseFloat(value) / 1e18; // Divide by the TIK decimal factor (1e18)
  const formattedValue = tikValue.toFixed(18); // Format with 18 decimal places
  return `${formattedValue} TIK`;
};

const Home = () => {
  const [tiktokHandle, setTiktokHandle] = useState('technicallyweb3');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [networkId, setNetworkId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const loadDefault = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setIsConnected(true);
      window.location.href = `/profile?handle=${tiktokHandle}`;
    } else {
      window.location.href = '/landing';
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
    loadDefault();

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

  const baseURL = 'https://identity-resolver-5ywm7t2p3a-pd.a.run.app';
  const defaultHandle = 'technicallyweb3'; // Default handle
  const [handle, setHandle] = useState(defaultHandle);
  const [userInfo, setUserInfo] = useState({});
  const [balance, setBalance] = useState('Loading balance...');
  const [transactions, setTransactions] = useState([]);

  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const getUserInfo = (handle) => {
    const apiUrl = `${baseURL}/user?handle=${handle}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const tiktokUser = data['tiktok-user'];
        const linkedWallet = data['linked-wallet'];

        setUserInfo({
          tiktokUser,
          linkedWallet
        });
      })
      .catch((error) => {
        console.log('Error fetching user information:', error);
      });
  };

  const handleSendClick = () => {
    const linkedWalletAddress = userInfo?.linkedWallet?.address;
    window.location.href = `/wallet?address=${linkedWalletAddress}`;
    // window.location.href = `/send?handle=${handle}`;
  };

  const handleTransactionsClick = () => {
    const handleUrl = `https://polygonscan.com/token/0x359c3ad611e377e050621fb3de1c2f4411684e92?a=${userInfo?.linkedWallet?.address}`;

    window.open(handleUrl, '_blank');
  };

  const displayBalance = async () => {
    const userApiUrl = `${baseURL}/user?handle=${handle}`;

    try {
      const userResponse = await fetch(userApiUrl);
      if (!userResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await userResponse.json();
      const linkedWallet = userData['linked-wallet'];
      const isRegistered = linkedWallet['isRegistered'];

      if (isRegistered) {
        const balanceDec = linkedWallet['balanceDec'];
        setBalance(formatBalance(balanceDec));

        const address = linkedWallet.address;
        const transactionsResponse = await fetchPolygonTransactions(address);
        const transactionsData = await transactionsResponse.json();
        const transactions = transactionsData.result;
        setTransactions(transactions);
      } else {
        setBalance('Wallet not registered');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPolygonTransactions = async (address) => {
    const apiKey = 'NVTYK9HY29VP2C54X24PXZQUS57TPWHCU7'; // Replace with your own API key from Polygon
    const apiUrl = `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=0x359c3ad611e377e050621fb3de1c2f4411684e92&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatBalance = (balanceDec) => {
    const formattedBalance = parseFloat(balanceDec).toFixed(6);
    return `${formattedBalance} TIK`;
  };



  useEffect(() => {
    getUserInfo(handle); // Fetch user info with the initial/default handle
    displayBalance();
  }, [handle]); // Update whenever the handle changes

  return (
    <div>
      <br />
      <br />
      <h2>TikToken Lookup & Send dApp</h2>
      <br />
      <br />
      <div className="look-container">
        <div className="use-avatar">
          <img className="avatar" src={userInfo?.tiktokUser?.avatarURL} alt="User Avatar" />
        </div>
        <div className="user-details">
          <h2>{userInfo?.tiktokUser?.username}</h2>
          <p>@{userInfo?.tiktokUser?.handle}</p>
          <div className="user-stats">
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.followers}</span>
              </div>
              <div>
                <span className="label">followers</span>
              </div>
            </div>
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.following}</span>
              </div>
              <div>
                <span className="label">following</span>
              </div>
            </div>
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.likes}</span>
              </div>
              <div>
                <span className="label">likes</span>
              </div>
            </div>
            <div className="stat">
              <div>
                <span className="number">{userInfo?.tiktokUser?.videos}</span>
              </div>
              <div>
                <span className="label">videos</span>
              </div>
            </div>
          </div>
          <p>
            <span className="label">Bio: </span>
            {userInfo?.tiktokUser?.bio}
          </p>
          <div className="social-icons">
            <a href={`https://www.tiktok.com/${handle}`} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href={`https://www.instagram.com/${userInfo?.tiktokUser?.handle}`} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>

            <i className="fas fa-copy icon" onClick={() => copyToClipboard(userInfo?.linkedWallet?.address)}></i>
            <a href={`https://polygonscan.com/address/${userInfo?.linkedWallet?.address}`} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe"></i>
            </a>
          </div>
          <h2>Wallet Balance</h2>
          <div className="balance">{balance}</div>
          <br />
          <button type="button" onClick={() => window.location.href = '/send'} >
            Send TIK
          </button>
        </div>
        <br />


        <div className="transaction-container">
          <h2>Transactions</h2>
          {transactions.length > 0 ? (
            <div className="transaction-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Value</th>
                    <th>Timestamp</th>
                    <th>From</th>
                    <th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr className="transaction-row" key={transaction.hash}>
                      <td>{formatTransactionValue(transaction.value)}</td>
                      <td>{new Date(parseInt(transaction.timeStamp) * 1000).toLocaleString()}</td>
                      <td>
                        {transaction.from === userInfo?.linkedWallet?.address
                          ? userInfo?.tiktokUser?.username
                          : transaction.from}
                      </td>
                      <td>
                        {transaction.to === userInfo?.linkedWallet?.address
                          ? userInfo?.tiktokUser?.handle
                          : userInfo?.tiktokUser?.username}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transactions found.</p>
          )}

          <br />
          <button onClick={handleTransactionsClick}>View All Transactions</button>
        </div>
      </div>

      <br />

      <br />

      <footer>
        <p>
          Made with <span className="heart">&hearts;</span> by{' '}
          <a href="https://michaelh.org" target="_blank" rel="noopener noreferrer">
            MichaelHDesigns
          </a>
        </p>
        <p>
          Data provided by{' '}
          <a href="https://www.tokcount.com/" target="_blank" rel="noopener noreferrer">
            TokCount
          </a>
        </p>
      </footer>
    </div>
  );
};

export { formatTransactionValue };
export default Home;