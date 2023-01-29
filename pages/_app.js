import Layout from "../components/Layout";
import "../styles/globals.css";
// import 'quill/dist/quill.snow.css'
// import '@etchteam/next-pagination/dist/index.css'
import { SessionProvider } from "next-auth/react";
import { MenuContextProvider } from "../context/menuContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <MenuContextProvider>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </MenuContextProvider>
  );
}

export default MyApp;
