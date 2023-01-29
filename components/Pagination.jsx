import React from "react";
import styles from "../styles/Pagination.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

const Pagination = ({count}) => {

  const defaultLimit = 20
  const [numberOfPages, setNumberOfPages] = useState(Math.ceil(count / defaultLimit))
  const [size, setSize] = useState(20)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (router.query.size) {
      if (router.query.page) {
        setPage(Math.min(Math.ceil(count / Math.max(1, +router.query.size)), +router.query.page))
      } else {
        setPage(1)
      }
      setSize(+router.query.size)
    } else {
      if (router.query.page) {
        setPage(Math.min(Math.ceil(count / defaultLimit), +router.query.page))
      } else {
        setPage(1)
      }
      setSize(defaultLimit)
    }
  }, [router])

  useEffect(() => {
    setNumberOfPages(Math.ceil(count / size))
    // setPage(1)
  }, [size])

  useEffect(() => {
    const total = Math.ceil(count / size)
    const perSide = 3
    const before = Math.min(perSide, Math.max(0, page - 1 - 1))
    const after = Math.min(perSide, Math.max(0, total - 1 - page))
    let beforeExtra = 0
    let afterExtra = 0
    if (before < perSide && after === perSide) {
      let difference = perSide - before
      afterExtra = Math.min(difference, total - 1 - (page + after))
    }
    if (after < perSide && before === perSide) {
      let difference = perSide - after
      beforeExtra = Math.min(difference, (page - before) - 1 - 1)
    }
    const beforeTotal = before + beforeExtra
    const afterTotal = after + afterExtra
    const newPages = []
    for (let index = beforeTotal - 1; index >= 0; index--) {
      newPages.push(page - index - 1)
    }
    if (page !== 1 && page !== total) {
      newPages.push(page)
    }
    for (let index = 0; index < afterTotal; index++) {
      newPages.push(page + index + 1)
    }
    // console.log("count",count)
    // console.log("size",size)
    // console.log("total",total)
    // console.log("before",before)
    // console.log("after",after)
    // console.log("beforeExtra",beforeExtra)
    // console.log("afterExtra",afterExtra)
    // console.log("beforeTotal",beforeTotal)
    // console.log("afterTotal",afterTotal)
    setPages(newPages)
  }, [page, size])

  const changePage = (p) => {
    let url = "/?page="+p
    if (router.query.size) {
      url += "&size="+router.query.size
    }
    router.push(url)
  }

  return (
    <div className={styles.wrapper}>
      <div className={page === 1 ? styles.pageCurrent : styles.pageButton} onClick={() => changePage(1)}>1</div>
      {(pages[0] - 1 > 1) && <div className={styles.pageButton}>...</div>}
      {(numberOfPages > 2) && pages.map((p, i) => (
        <div key={i} className={page === p ? styles.pageCurrent : styles.pageButton} onClick={() => changePage(p)}>{p}</div>
      ))}
      {(numberOfPages - pages[pages.length - 1] > 1) && <div className={styles.pageButton}>...</div>}
      {(numberOfPages > 1) && <div className={page === numberOfPages ? styles.pageCurrent : styles.pageButton} onClick={() => changePage(numberOfPages)}>{numberOfPages}</div>}
    </div>
  );
};

export default Pagination;
