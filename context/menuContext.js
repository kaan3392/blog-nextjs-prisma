import { createContext, useState } from "react";

export const MenuContext = createContext({
  menu: false,
  toggleMenu: () => {},
});

export const MenuContextProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);

  function toggleMenu() {
    setMenu((prev) => !prev);
  }

  const value = {
    menu,
    toggleMenu,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
