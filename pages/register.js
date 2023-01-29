import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Register.module.css";
import { useRef } from "react";
import { getToken } from "next-auth/jwt"

export default function Register() {
  const nameRef = useRef()
  const mailRef = useRef()
  const passRef = useRef()

  const tryRegister = async (e) => {
    e.preventDefault()
    const body = {name:nameRef.current.value, mail:mailRef.current.value, pass:passRef.current.value}
    const res = await fetch("api/auth/register", {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    console.log("data", data)
    if ("error" in data) {
      let error = data.error
      console.log(error)
      if (data.error === "user already defined") {
        
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <form onSubmit={(e) => tryRegister(e)}>
            <div className={styles.part}>
              <div>Name</div>
              <input ref={nameRef} type="text" placeholder="name" />
            </div>
            <div className={styles.part}>
              <div>Email</div>
              <input ref={mailRef} type="email" placeholder="email" />
            </div>
            <div className={styles.part}>
              <div>Password</div>
              <input ref={passRef} type="password" placeholder="password" />
            </div>
            <button type="submit" className={styles.btn} >Register</button>
            <Link href="/login">
              <div className={styles.login} >I already have an account</div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = await getToken({req:context.req})
  if (token) {
    // redirect
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  };
}