import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../Logo/Logo";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <nav className={styles.navBar}>
      <Link to="/" className={styles.logoLink}>
        <Logo />
      </Link>
      
      <div className={styles.navActions}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>
              Dashboard
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/patient" className={styles.navLink}>
              Pacientes
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/patient/create" className={styles.navLink}>
              Novo Paciente
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/schedule" className={styles.navLink}>
              Agenda de Sessões
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/user" className={styles.navLink}>
              Atualizar Perfil
            </Link>
          </li>
        </ul>
        <button onClick={onLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
