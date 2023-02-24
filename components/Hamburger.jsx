import Link from "next/link";
import React from "react";
import styles from "../styles/Hamburger.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { useContext } from "react";
import { MenuContext } from "../context/menuContext";

function Hamburger() {
  const { data: session } = useSession();
  const { toggleMenu } = useContext(MenuContext);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link onClick={toggleMenu} href="/">
          <div className={styles.link}>Home</div>
        </Link>
        {session ? (
          <>
            <Link onClick={toggleMenu} href="/author">
              <div className={styles.link}>Author</div>
            </Link>
            {session.user.role === "ADMIN" && (
              <Link onClick={toggleMenu} href="/admin">
                <div className={styles.link}>Admin</div>
              </Link>
            )}
            <div
              className={styles.link}
              onClick={() => {
                signOut();
                toggleMenu;
              }}
            >
              Logout
            </div>
          </>
        ) : (
          <div
            className={styles.link}
            onClick={() => {
              signIn();
              toggleMenu;
            }}
          >
            Login
          </div>
        )}
      </div>
    </div>
  );
}

export default Hamburger;
