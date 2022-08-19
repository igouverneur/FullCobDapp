import { useState, useEffect, useContext } from 'react'
import CountDownTimerContext from "../../context/CountDownTimerContext";
import CountDownTimer from "../countDownTimer/CountDownTimer";

import styles from "./Interface.module.css";
import Nav from "../layout/header/Nav"

export default function Interface() {
  //TRY
  // const { publicSaleDate, setPublicSaleDate, publicSaleRemainingTime, setPublicSaleRemainingTime } =
  //   useContext(CountDownTimerContext);
  const {publicSaleRemainingTime} =
    useContext(CountDownTimerContext);

  // const [isLoading, setIsloading] = useState(true);  

  // useEffect(() => {
  //   setIsloading(true);
  //   setPublicSaleDate(new Date('August 17, 2022 03:24:00').getTime()/1000);
  //   setPublicSaleRemainingTime(Math.floor(publicSaleDate - Date.now() / 1000));
  //   setIsloading(false);
  // }, []);

  // useEffect(() => {
  //   if (publicSaleRemainingTime > 0) {
  //     let intervalId = setInterval(() => {
  //       setPublicSaleRemainingTime(publicSaleDate - Math.floor(Date.now() / 1000));
  //     }, 1000);
  //   }
    
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [publicSaleRemainingTime]);

  let d = Math.floor(publicSaleRemainingTime / (3600 * 24));
  let h = Math.floor((publicSaleRemainingTime % (3600 * 24)) / 3600);
  let m = Math.floor((publicSaleRemainingTime % 3600) / 60);
  let s = Math.floor(publicSaleRemainingTime % 60);
  //TRY
  return (
    <div className={styles.container}>
      <Nav/>
        {/* <h4>Play To Earn <h5>&nbsp; MMORPG &nbsp;</h5> For PC & MAC</h4> */}
      <div className={styles.intro}>
        <legend className={styles.coming}>Coming Soon</legend>
        <CountDownTimer d={d} h={h} m={m} s={s} />
        {/* <h1 className={styles.title}>A brutal village. An honourable death.</h1>
        <h3 className={styles.description}>
          The Blood Queen calls the bravest champions to fight for glory and
          riches. Collect, learn, breed, fight, win.{" "}
        </h3> */}
        <button>Join Whitelist</button>
      </div>
    </div>
  );
}
