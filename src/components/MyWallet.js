import React, { useState, useEffect } from 'react';
import { formatTransactionValue } from './LookUp.js';
import NavBar from './NavBar';
import Wallet from './Wallet';

import '../css/App.css';

const MyWallet = () => {
  const [userInfo, setUserInfo] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const [isSendVisible, setIsSendVisible] = useState(false); // Track the visibility of the Send component

  useEffect(() => {
    // Fetch user info and balance using the API endpoints
    fetchUserInfo().then((data) => {
      setUserInfo(data);
      const linkedWalletAddress = data?.linkedWallet?.address;
      return fetchTransactions(linkedWalletAddress);
    }).then((transactionsData) => {
      if (transactionsData && Array.isArray(transactionsData.result)) {
        setTransactions(transactionsData.result);
      } else {
        console.error('Invalid transaction data:', transactionsData);
      }
    });
  }, []);

  const fetchUserInfo = async () => {
    // Fetch user info using the API endpoint
    const baseURL = 'https://identity-resolver-5ywm7t2p3a-pd.a.run.app';
    const handle = '';
    const apiUrl = `${baseURL}/user?handle=${handle}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const tiktokUser = data['tiktok-user'];
      const linkedWallet = data['linked-wallet'];

      return {
        tiktokUser,
        linkedWallet
      };
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const fetchTransactions = async (address) => {
    // Fetch transactions using the API endpoint
    const baseURL = 'https://api.polygonscan.com/api';
    const apiKey = 'NVTYK9HY29VP2C54X24PXZQUS57TPWHCU7';
    const transactionsApiUrl = `${baseURL}?module=account&action=tokentx&contractaddress=0x359c3ad611e377e050621fb3de1c2f4411684e92&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(transactionsApiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleWalletVisibility = () => {
    setIsWalletVisible(!isWalletVisible);
  };

  const handleSendVisibility = () => {
    setIsSendVisible(!isSendVisible); // Toggle the visibility of the Send component
  };

  const Send = () => {
    // Implement your Send component here
    return (
      <div className="send-component">
        {/* Your Send component code */}
        <button className="close-button" onClick={handleSendVisibility}>
          Close
        </button>
      </div>
    );
  };

  return (
    <div>
      

      {/* Display user info and transactions */}
      <div className="user-details">
        <h2>{userInfo?.tiktokUser?.username}</h2>
        <p>@{userInfo?.tiktokUser?.handle}</p>
        <div className="address">Address: {userInfo?.linkedWallet?.address}</div>
      </div>

      {/* Add Send TIK button */}
      <button className="send-button" onClick={handleSendVisibility}>
        Send TIK
      </button>

      {/* Render the Send component if visible */}
      {isSendVisible && (
        <div className="send-window">
          <div className="send-window-header">
            <h3>Send TIK</h3>
            <button className="close-button" onClick={handleSendVisibility}>
              X
            </button>
          </div>
          <div className="send-window-content">
            {/* Your Send component code */}
            <button className="send-button">Send</button>
          </div>
        </div>
      )}

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
      </div>

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

export default MyWallet;