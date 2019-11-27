import React from 'react';
import styles from './Layout.module.css';
import { Link } from 'react-router-dom';

const Header = ({ children, title }) => (
  <>
    <nav className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src="/library-logo.png" alt="" />
        </Link>
      </div>
    </nav>
    <main className={styles.mainContent}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      {children}
    </main>
  </>
);

export default Header;
