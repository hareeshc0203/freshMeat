// Example: in src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

const Header = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f8f8',
      }}
    >
      <Link to="/">FreshMeet</Link>
      <ProfileMenu />
    </header>
  );
};

export default Header;
