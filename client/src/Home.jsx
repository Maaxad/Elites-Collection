import React, { useEffect, useState } from 'react';
import axios from 'axios';
import icon from './assets/icon.png';
import './home.css';
import { IoHomeOutline, IoBookOutline, IoLibraryOutline, IoLogoWhatsapp } from "react-icons/io5";
import { MdOutlineEmail } from 'react-icons/md';
import { FaInstagram } from 'react-icons/fa';
import { CiFacebook } from 'react-icons/ci';
import book1 from './assets/book1.png';
import book2 from './assets/book2.png';
import book3 from './assets/book3.png';
import book4 from './assets/book4.png';
import book5 from './assets/book5.png';
import book6 from './assets/book6.png';

function Home() {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please sign in again.');
      return;
    }
    // Remove the axios request to get the user profile data
  }, []);
  
  return (
    <div className="homepage">
      <div className="nav">
        <nav className="navbar-landing">
          <div className="logo-landing">
            <img src={icon} alt="logo" />
            <h2>ELITE'S COLLECTIONS</h2>
          </div>
          <div className="links-wrapper">
            <a href="/home" className="nav-item"><IoHomeOutline className="nav-icon" /><span>Home</span></a>
            <a href="/books" className="nav-item"><IoBookOutline className="nav-icon" /><span>Books</span></a>
            <a href="/mylibrary" className="nav-item"><IoLibraryOutline className="nav-icon" /><span>My Library</span></a>
            {/* Removed the profile dropdown section */}
          </div>
        </nav>
      </div>

      {/* Home Section */}
      <div className="home-section">
        <section className="intro">
          <h2>Discover Handpicked Books at Elite's Collections</h2>
          <p>Your one-stop destination for timeless literature and modern bestsellers.</p>
        </section>

        <section className="book-showcase">
          <div className="most-view">
            {/* Book Cards */}
            {[book1, book2, book3].map((book, index) => (
              <div className={`book-card ${index === 1 ? 'middle-card' : ''}`} key={index}>
                <img src={book} className="book-image" alt={`book${index + 1}`} />
                <div className="book-details">
                  <h3 className="book-title">{["DELUSIONAL", "Unraveling", "NOBILITY"][index]}</h3>
                  <p className="book-author">{["Author: Andrey Londra", "Author: J.D. Neill", "Author: Mason Dakota"][index]}</p>
                  <p className="book-description">{[
                    "Trapped between fractured memories and a reality she can’t trust...",
                    "Maggie Baker’s life seems flawless — until a mysterious accident leaves her in a coma...",
                    "One unlikely heir must rise above betrayal, bloodlines, and war to reclaim a legacy long buried..."
                  ][index]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="most-view second-row">
            {[book4, book5, book6].map((book, index) => (
              <div className={`book-card ${index === 1 ? 'lower-middle' : ''}`} key={index}>
                <img src={book} className="book-image" alt={`book${index + 4}`} />
                <div className="book-details">
                  <h3 className="book-title">{["The Ministry of Ungentlemanly Warfare", "The Sentinel", "They Hunt"][index]}</h3>
                  <p className="book-author">{["Author: Stefan M. Nardi", "Author: T.M. Haviland", "Author: Claire Fraise"][index]}</p>
                  <p className="book-description">{[
                    "A ragtag crew of misfits must defy convention to stop a war no one else sees coming...",
                    "A mining team uncovers an ancient artifact—its origins beyond human comprehension...",
                    "Shiloh Oleson must confront her past behind bars while her friends race to stop a spectral apocalypse..."
                  ][index]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="active-user">
            <div className="view"><h2>2M+</h2><p>Satisfied Customers</p></div>
            <div className="view"><h2>1.5M+</h2><p>Good Reviews</p></div>
            <div className="view"><h2>15+</h2><p>Years of Experience</p></div>
            <div className="view"><h2>7000+</h2><p>Staff</p></div>
          </div>
        </section>

        <section>
          <div className="about-us">
            <h2>About Elite's Collection</h2>
            <p>
              Welcome to <strong>Elite's Collection</strong> — your go-to destination for discovering, collecting, and celebrating the world of books. 
              Located in the heart of Nairobi at the iconic <strong>BBS Mall</strong>, we’re more than just a book collection — 
              we’re a community of readers, dreamers, and thinkers.
            </p>
            <p>
              Whether you’re into timeless classics, contemporary novels, biographies, or niche reads, 
              our ever-growing library has something for every kind of reader.
            </p>
            <p>
              Elite’s Collection blends technology with the love of books, giving you the convenience of a digital experience 
              and the warmth of a curated bookshelf.
            </p>
            <p>
              Come explore. Discover your next favorite read. Be a part of the Elite's Collection family.
            </p>
          </div>
        </section>

        <section>
          <div className='contactus'>
            <h2>Get in Touch</h2>
            <p>Want to know more about Elite's Collection? Have a question or suggestion? Reach us on:</p>

            <div className='contact'>
              <div className='contact-item'><IoLogoWhatsapp className='icon' /><p>Phone: +254 722 123 456</p></div>
              <div className='contact-item'><MdOutlineEmail className='icon' /><p>Email: info@elitescollection.com</p></div>
            </div>

            <p>Follow us on social media to stay up-to-date on the latest news, promotions and book recommendations!</p>

            <div className='social'>
              <div className='contact-item'><FaInstagram className='icon' /><p>@elitescollection</p></div>
              <div className='contact-item'><CiFacebook className='icon' /><p>@elitescollection</p></div>
            </div>

            <div className="copyright">
              <hr className="divider" />
              <footer className="footer">© {new Date().getFullYear()} Elite's Collection. All rights reserved.</footer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
