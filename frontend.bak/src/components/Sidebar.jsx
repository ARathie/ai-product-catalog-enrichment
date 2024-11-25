// frontend/src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>New Logo Here</h2>
      </div>
      <ul className="sidebar-nav">
        <li
          className={activePage === 'Catalog Enhancer' ? 'active' : ''}
          onClick={() => setActivePage('Catalog Enhancer')}
        >
          Catalog Enhancer
        </li>
        <li
          className={activePage === 'Category Hierarchy' ? 'active' : ''}
          onClick={() => setActivePage('Category Hierarchy')}
        >
          Category Hierarchy
        </li>
        <li
          className={activePage === 'Product Pairings' ? 'active' : ''}
          onClick={() => setActivePage('Product Pairings')}
        >
          Product Pairings
        </li>
        <li
          className={activePage === 'Version History' ? 'active' : ''}
          onClick={() => setActivePage('Version History')}
        >
          Version History
        </li>
        <li
          className={activePage === 'Settings' ? 'active' : ''}
          onClick={() => setActivePage('Settings')}
        >
          Settings
        </li>
        <li
          className={activePage === 'Account' ? 'active' : ''}
          onClick={() => setActivePage('Account')}
        >
          Account
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;