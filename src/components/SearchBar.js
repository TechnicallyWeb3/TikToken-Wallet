import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchHistory, setSearchHistory] = useState([]);
  const [address, setAddress] = useState('');

  const toggleSearchBar = () => {
    setShowInput(!showInput);
    setSearchText('');
    setAddress('')
  };

  const handleSearchClick = () => {
    if (showInput && searchText.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
      setSearchText('');
      setShowInput(false);
      updateSearchHistory(searchText);
    } else {
      setShowInput(!showInput);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    if (value.length >= 4) {
      setSearchText(value);
      logMatchingHistory(value);
      try {
        const response = await fetch(`https://identity-resolver-5ywm7t2p3a-pd.a.run.app/user?handle=${value}`);
        const data = await response.json();
        const isRegistered = data['linked-wallet'].isRegistered;
        if (isRegistered) {
          const linkedAddress = data['linked-wallet'].address;
          showAddress(linkedAddress);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setSearchText(value);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const updateSearchHistory = (searchQuery) => {
    setSearchHistory((prevHistory) => [searchQuery, ...prevHistory]);
  };

  const logMatchingHistory = (searchQuery) => {
    const matchingHistory = searchHistory.filter((entry) =>
      entry.startsWith(searchQuery)
    );
    console.log(matchingHistory);
  };

  const showAddress = (linkedAddress) => {
    setAddress(linkedAddress);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={toggleSearchBar}
        style={{ alignSelf: 'flex-start' }}
      >
        {showInput ? 'X' : 'Search'}
      </button>

      {showInput && (
        <div style={{ marginLeft: '10px' }}>
          <form onSubmit={handleSearchClick}>
            <input
              type="text"
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              list={searchText.length >= 4 ? 'searchHistoryList' : undefined}
            />
            {searchText.length >= 4 && (
              <datalist id="searchHistoryList">
                {searchHistory.map((query, index) => (
                  <option key={index} value={query} />
                ))}
              </datalist>
            )}
            <button type="submit">Search</button>
          </form>
          {address && (
            <div>
              <input
                type="text"
                value={address}
                readOnly
              />
              <button onClick={handleCopyClick}>
                Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
