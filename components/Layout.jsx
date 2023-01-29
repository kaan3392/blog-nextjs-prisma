import React from "react";
import { useContext } from "react";
import { MenuContext } from "../context/menuContext";
import Footer from "./Footer";
import Hamburger from "./Hamburger";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const { menu } = useContext(MenuContext);
  return (
    <>
      <div
        style={{
          position: "fixed",
          height: "100vh",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
        }}
      ></div>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            minHeight: "100%",
            maxWidth: "1024px",
            width: "1024px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            color: "#3A4148",
            position: "relative",
          }}
        >
          <Navbar />
          {menu && <Hamburger />}
          {children}
          <div style={{ minHeight: "100px", width: "100%" }}></div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
