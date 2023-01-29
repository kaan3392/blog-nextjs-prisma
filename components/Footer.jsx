import React, {  useState } from "react";
import styles from "../styles/Footer.module.css";
import Ticker from "./Ticker"

const Footer = () => {

  const [disableOption, setDisableOption] = useState(true);

  const goToTop = () => {
    global.document.documentElement.scrollTop = 0;
  };
  

  global.onscroll = () => {
    setDisableOption(global.scrollY === 0 );
    return () => (global.onscroll = null);
  };

  return (
    <div className={styles.footer}>
      <Ticker messages={["Welcome to our demonstration of a blog.", "You can search our current pages in the searchbar.", "Some of the available pages are: Title One, Title Two..."]} />
      {/* <div className={styles.wrapper}>
        <button
          onClick={goToTop}
          disabled={disableOption}
          className={styles.top}
        >
          go to top
        </button>
      </div> */}
    </div>
  );
};

export default Footer;
