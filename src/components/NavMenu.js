import React from 'react';

const NavMenu = ({ showSearchMenu }) => {
  if (showSearchMenu) {
    return null; // Hide the NavMenu when the search menu is open
  }

  function toggleMenu() {
    console.log("Menu Toggled");
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <button onClick={toggleMenu}>
        Menu
      </button>
    </div>
  );
};

export default NavMenu;
