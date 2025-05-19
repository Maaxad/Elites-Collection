import React from 'react';
import icon from './assets/icon.png';
import './landingpage.css';

function Landingpage() {
  return (
    <div className='home'>
      {/* Navbar */}
      <nav className='navbar'>
        <div className='logo'>
          <img src={icon} alt='logo' className='logo-img' />
          <h2>ELITE'S COLLECTIONS</h2>
        </div>
        <div className='homenav'>
          <a href='/signin' className='nav-link'>Signin</a>
          <a href='/signup' className='nav-link'>Get Started</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className='content'>
        <h1>Welcome to Elite's Collection</h1>
        <p>Elite's Collection is a platform where you can buy and sell your favorite items.</p>
        <button><a href='/signup'>Get Started</a></button>
      </div>
    </div>
  );
}

export default Landingpage;
