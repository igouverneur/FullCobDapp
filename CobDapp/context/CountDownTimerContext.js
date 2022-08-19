import { createContext, useState, useEffect } from "react";

const CountDownTimerContext = createContext();


export function CountDownTimerProvider ({children}) {
    
    const [publicSaleDate, setPublicSaleDate] = useState("1660703040")
    const [publicSaleRemainingTime, setPublicSaleRemainingTime] = useState("")
    // const [publicSaleDate, setPublicSaleDate] = useState(new Date('August 17, 2022 03:24:00').getTime()/1000)
    // const [publicSaleRemainingTime, setPublicSaleRemainingTime] = useState(Math.floor(publicSaleDate - (Date.now() / 1000)))

    const [preSaleDate, setPreSaleDate] = useState("1660703040")
    const [preSaleRemainingTime, setPreSaleRemainingTime] = useState("")
    // const [preSaleDate, setPreSaleDate] = useState(new Date('August 16, 2022 03:24:00').getTime()/1000)
    // const [preSaleRemainingTime, setPreSaleRemainingTime] = useState(Math.floor(preSaleDate - (Date.now() / 1000)))

    const [isLoading, setIsloading] = useState(true);  

  useEffect(() => {
    setIsloading(true);
    setPublicSaleDate(new Date('August 18, 2022 10:00:00').getTime()/1000);
    if(Math.floor(publicSaleDate - Date.now() / 1000) > 0){
      setPublicSaleRemainingTime(Math.floor(publicSaleDate - Date.now() / 1000));
      setIsloading(false);
    }
    
  }, []);
  useEffect(() => {
    setIsloading(true);
    setPreSaleDate(new Date('August 18, 2022 10:04:00').getTime()/1000);
    if(Math.floor(preSaleDate - Date.now() / 1000) > 0 ){
      setPreSaleRemainingTime(Math.floor(preSaleDate - Date.now() / 1000));
    setIsloading(false);
    }
    
  }, []);

  useEffect(() => {
    if (publicSaleRemainingTime > 0) {
      var intervalId1 = setInterval(() => {
        setPublicSaleRemainingTime(publicSaleDate - Math.floor(Date.now() / 1000));
      }, 1000);
    }
    
    return () => {
      clearInterval(intervalId1);
    };
  }, [publicSaleRemainingTime])

  useEffect(() => {
    if (preSaleRemainingTime > 0) {
      var intervalId2 = setInterval(() => {
        setPreSaleRemainingTime(preSaleDate - Math.floor(Date.now() / 1000));
      }, 1000);
    }
    
    return () => {
      clearInterval(intervalId2);
    };
  }, [preSaleRemainingTime])

    // return (
    //     <CountDownTimerContext.Provider value={{publicSaleDate ,setPublicSaleDate, publicSaleRemainingTime, setPublicSaleRemainingTime, preSaleDate, setPreSaleDate, preSaleRemainingTime, setPreSaleRemainingTime}}>
    //         {children}
    //     </CountDownTimerContext.Provider>
    // )
    return (
        <CountDownTimerContext.Provider value={{publicSaleRemainingTime, preSaleRemainingTime}}>
            {children}
        </CountDownTimerContext.Provider>
    )
}

export default CountDownTimerContext

