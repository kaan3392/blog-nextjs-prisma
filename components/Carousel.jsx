import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Carousel.module.css";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Link from "next/link";

const Carousel = ({ breakpoints, perPage, slides }) => {

  return (
    <>
      <Splide
        options={{
          rewind: true,
          gap: "1rem",
          width: "100%",
          heightRatio: 0.4,
          type: "loop",
          drag: "free",
          snap: true,
          perPage: perPage,
          breakpoints: breakpoints,
          arrows: false,
          interval: 4000,
          pauseOnHover: true,
          autoplay: true,
        }}
        aria-label="My Favorite Images"
        className={styles.slideSplide}
      >
        {slides?.map((slide, index) => {
          return (
            <SplideSlide key={index}>
              <Link href={"/post/"+slide.id}>
                <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100%", minWidth: "100%" }}>
                  <div style={{zIndex:4, position:"absolute", width:"100%", height:"100%", aspectRatio:1.77, backgroundColor:"black", backgroundPosition:'center', backgroundRepeat:"no-repeat", backgroundSize:'cover', backgroundImage:'url("'+slide.image+'")', cursor:"pointer"}} />
                  <div style={{zIndex:5, position:"absolute", width:"100%", height:"100%", aspectRatio:1.77, backgroundColor:"rgba(0,0,0,0.75)", backgroundPosition:'center', backgroundRepeat:"no-repeat", backgroundSize:'contain', backgroundImage:'url("'+slide.image+'")', cursor:"pointer"}} />
                  {/* <img style={{ width: "100%", objectFit: "cover", height: "100%", objectPosition: "50% 50%" }} src={slide.image} alt="Image 1" /> */}
                  <p style={{ position: "absolute", bottom: "10px", left: "10px" }} >{slide.title}</p>
                </div>
              </Link>
            </SplideSlide>
          );
        })}
      </Splide>
    </>
  );
};

export default Carousel;
