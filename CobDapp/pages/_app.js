import "../styles/globals.css";
import { Fragment } from "react";
import Nav from "../components/layout/header/Nav";
import Footer from "../components/layout/footer/Footer";
import Image from "next/image";
import Head from "next/head";

import {CountDownTimerProvider }from "../context/CountDownTimerContext"

import {Toaster} from "react-hot-toast"
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider) => {
  return new Web3Provider(provider);

};

function MyApp({ Component, pageProps }) {
  
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <CountDownTimerProvider>
        <Fragment>
          {/* <Head>
            <link rel="icon" href="/images/logopic.png" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

            <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet"/> 
            <link
              href="https://fonts.googleapis.com/css2?family=Josefin+Sans&family=Ubuntu:ital,wght@1,300&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Tapestry&display=swap"
              rel="stylesheet"
            />
          </Head> */}
          <Toaster/>
          {Component.name !== "Home" && (<Nav></Nav>)}
          {/* <Nav></Nav> */}
          <Component {...pageProps} />
          <Footer></Footer>
        </Fragment>
      </CountDownTimerProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
