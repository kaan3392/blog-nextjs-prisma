import Link from "next/link";
import React, {useState, useEffect} from "react";
import styles from "../styles/Searchbar.module.css";
import { useRouter } from "next/router";

const Searchbar = () => {
  const [text, setText] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const router = useRouter()

  useEffect(() => {
    if (text === "") {
      setSuggestions([])
    }
    const filterProducts = async () => {
      // console.log("text",text)
      try {
        const body = {text: text}
        const res = await fetch("/api/search", {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        setSuggestions(data)
        console.log("data", data)
      } catch (err) {
        console.log(err);
      }
    };
    const timer = setTimeout(() => {
      filterProducts();
    }, 1500);
    return () => clearTimeout(timer);
  }, [text]);

  const search = (e) => {
    if (e.keyCode !== 13) {
      return
    }
    let url = "/?text="+e.target.value
    if (router.query.size) {
      url += "&size="+router.query.size
    }
    setText("")
    router.push(url)
  }
  const searchButton = (text) => {
    let url = "/?text="+text
    if (router.query.size) {
      url += "&size="+router.query.size
    }
    setText("")
    router.push(url)
  }

  useEffect(() => {
    //console.log(suggestions)
    setText("")
    setSuggestions([])
  }, [router])

  return (
    <div className={styles.right}>
      <div className={styles.inputContainer}>
        <input
          placeholder="Search"
          className={styles.searchInput}
          type="text"
          value={text}
          onKeyUp={(e) => search(e)}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.suggestions}>
          {suggestions.map((suggestion, i) => (
            <Link href={"/post/"+suggestion.id} key={i}>
              <div className={styles.suggestion}>
                {suggestion.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button onClick={() =>searchButton(text) } className={styles.button}>Search</button>
    </div>
  );
};

export default Searchbar;
