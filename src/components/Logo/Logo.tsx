import React from "react";
import styles from "./Logo.module.css";
import logoImg from "../../assets/logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
  return (
    <div className={`${styles.logoContainer} ${className || ""}`}>
      <img src={logoImg} alt="Practicare Logo" className={styles.image} />
      {showText && <span className={styles.text}>Practicare</span>}
    </div>
  );
};

export default Logo;
