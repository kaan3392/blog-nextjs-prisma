import Link from "next/link";
import React from "react";
import styles from "../styles/Navbar.module.css";
import Searchbar from "./Searchbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { hamburger } from "../svg/socialIcons";
import { useContext } from "react";
import { MenuContext } from "../context/menuContext";

const Navbar = () => {
  const { data: session } = useSession();

  const { toggleMenu, menu } = useContext(MenuContext);

  return (
    <div className={styles.navbar}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Link href="/">
            <div className={styles.logo}>BLOG</div>
          </Link>
          <div className={styles.links}>
            {session && (
              <Link href="/author">
                <div className={styles.link}>author</div>
              </Link>
            )}
            {/* <div className={styles.link}>features</div> */}
            {/* <div className={styles.link}>about</div> */}
          </div>
        </div>
        <div className={styles.right}>
          <div
            onClick={toggleMenu}
            className={styles.icon}
            style={menu ? { color: "orangered" } : { color: "gray" }}
          >
            {hamburger}
          </div>
          <div className={styles.searchContainer}>
            <Searchbar />
          </div>
          <div className={styles.buttonContainer}>
            {session ? (
              <button className={styles.button} onClick={() => signOut()}>
                Logout
              </button>
            ) : (
              <button className={styles.button} onClick={() => signIn()}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
