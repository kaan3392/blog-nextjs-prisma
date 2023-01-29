import React from "react";
import styles from "../styles/Cards.module.css";
import Masonry from "react-masonry-css";
import Link from "next/link";
import { useEffect } from "react";

const Cards = ({cards}) => {
  useEffect(()=>{console.log("cards",cards)},[])
  const maxLength = 20
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.myMasonryGrid}
      columnClassName={styles.myMasonryGrid_column}
    >
      {cards?.map((card, i) => (
        <div key={i}>
          <Link  href={`/post/${card.id}`}>
            <div className={styles.container}>
              <div className={styles.imageContainer}>
                <img className={styles.image} src={card.image} alt={card.title} title={card.title} />
              </div>
              <div className={styles.info} title={card.title}>
                <div className={styles.title}>{card.title.length > maxLength ? card.title.substring(0, maxLength) + "..." : card.title}</div>
                <div className={styles.short}>{card.short.length > maxLength ? card.short.substring(0, maxLength) + "..." : card.short}</div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </Masonry>
  );
};

export default Cards;
