import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selfHandle, setSelfHandle] = useState('default_handle');

  function login(handle) {
    setSelfHandle(handle);
    console.log(selfHandle)
  } // this code logs "default_login" and not the correct handle.
  useEffect(() => {
    console.log(selfHandle);
    // window.location.href = `/profile?handle=${selfHandle}`;
  }, [selfHandle]);

  return (
    <AppContext.Provider value={{ selfHandle, login }}>
      {children}
    </AppContext.Provider>
  );
};
