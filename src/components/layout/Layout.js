import React from 'react';
import styles from './Layout.module.css';

const Header = ({ children, title }) => (
  <>
    <nav className={styles.header}>
      <div className={styles.logoContainer}>
        <img src="library-logo.png" alt="" />
      </div>
    </nav>
    <main className={styles.mainContent}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      {children}
    </main>
  </>
);

export default Header;
