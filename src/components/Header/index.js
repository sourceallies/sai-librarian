import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from './logo.png';

const Header = () => {
    return (
        <header className={styles.header}>
            <Link to='/'><img alt="Library Logo" className={styles.logo} src={logo} /></Link>
        </header>
    );
}

export default Header;