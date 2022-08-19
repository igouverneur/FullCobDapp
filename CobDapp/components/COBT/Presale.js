import { useContext, useState, useEffect } from "react";

import CountDownTimerContext from "../../context/CountDownTimerContext";
import CountDownTimer from "../countDownTimer/CountDownTimer"

import toast from "react-hot-toast"

import styles from "./Presale.module.css";

export default function Presale({buyInPresale, claimPresale, handleBuyAmount, isPresaleEnded, isJoinedPresale, isPresale, isWhiteListed, totalBuyAmount, isOpenForPublic, isClaimingPresale, isClaimedPresaleToken}) {
    const {preSaleRemainingTime} =
    useContext(CountDownTimerContext);
    const [barPercentage, setBarPercentage] = useState()
    

    const buyInPresaleToast = () => {
      toast.promise(
        buyInPresale(),
         {
           loading: 'Waiting for transaction...',
           success: (res) => (
            <h1 className={styles.toastTry}>Your Transction Hash <a target="_blank" href={`https://testnet.bscscan.com/tx/${res}`}>{res}</a></h1>
           ),
           error: (err) => `${err}`,
         },
         {
          style: {
            minWidth: '100%',
          },
          success: {
            duration: 10000,
          },
        }
       );
    }
    const claimPresaleToast = () => {
      toast.promise(
        claimPresale(),
         {
           loading: 'Claiming Tokens...',
           success: (res) => `${res}`,
           error: (err) => `${err}`,
         },
         {
          style: {
            minWidth: '100%',
          },
          success: {
            duration: 10000,
          },
        }
       );
    }
    useEffect(()=> {
      setBarPercentage(totalBuyAmount /1000 * 100)
    }, [totalBuyAmount])
    let d = Math.floor(preSaleRemainingTime / (3600 * 24));
    let h = Math.floor((preSaleRemainingTime % (3600 * 24)) / 3600);
    let m = Math.floor((preSaleRemainingTime % 3600) / 60);
    let s = Math.floor(preSaleRemainingTime % 60);
    return (
      <div className={styles.container}>
        {/* //Before presale open */}
        {!isPresale && !isPresaleEnded && !isOpenForPublic && !isClaimingPresale &&(<><h1 className={styles.title}>Presale Start In:</h1><CountDownTimer d={d} h={h} m={m} s={s} /><div className={styles.info}>
          <div className={styles.barContainer}>
            <div className={styles.barFiller} style={{ width: `${barPercentage}%` }}>
            </div>
          </div>
          <div className={styles.bnbContainer}>
            <h2 className={styles.bnbCurrent}>{totalBuyAmount}BNB</h2>
            <h2 className={styles.bnbMax}>1000 BNB</h2>
          </div>
        </div>
        <div className={styles.whitelist}>
            {isWhiteListed ? <h1>You Are Whitelisted</h1> : <h1>You Are Not Whitelisted Yet</h1>}
          </div>
        <div className={styles.inputContainer}>
            <button onClick={claimPresaleToast} disabled={!isClaimingPresale || !isPresaleEnded}>Claim</button>
            <input type="text" placeholder="0.0" onChange={handleBuyAmount} />
            <button onClick={buyInPresaleToast} disabled={!isPresale || !isWhiteListed}>Join</button>
          </div></>) }

        {/* //in the presale only whitelist */}

        {isPresale && !isPresaleEnded && !isOpenForPublic &&(<><h1 className={styles.title}>Presale Is Live For Whitelisted And Soon will Be Open for Public</h1><div className={styles.info}>
          <div className={styles.barContainer}>
            <div className={styles.barFiller} style={{ width: `${barPercentage}%` }}>
            </div>
          </div>
          <div className={styles.bnbContainer}>
            <h2 className={styles.bnbCurrent}>{totalBuyAmount}BNB</h2>
            <h2 className={styles.bnbMax}>1000 BNB</h2>
          </div>
        </div>
        <div className={styles.whitelist}>
            {isWhiteListed ? <h1>You Are Whitelisted</h1> : <h1>You Are Not Whitelisted Yet</h1>}
          </div>
        <div className={styles.inputContainer}>
            <button onClick={claimPresaleToast} disabled={!isClaimingPresale || !isPresaleEnded}>Claim</button>
            <input type="text" placeholder="0.0" onChange={handleBuyAmount} />
            <button onClick={buyInPresaleToast} disabled={!isPresale || !isWhiteListed}>Join</button>
          </div></>) }

        {/* //in Presale and open for public */}

        {isPresale && isOpenForPublic && !isPresaleEnded && (<><h1 className={styles.title}>Presale Is Open For Public</h1><div className={styles.info}>
        
          <div className={styles.barContainer}>
            <div className={styles.barFiller} style={{ width: `${barPercentage}%` }}>
            </div>
          </div>
          <div className={styles.bnbContainer}>
            <h2 className={styles.bnbCurrent}>{totalBuyAmount}BNB</h2>
            <h2 className={styles.bnbMax}>1000 BNB</h2>
          </div>
          <div className={styles.whitelist}>
            {isWhiteListed ? <h1>You Are Whitelisted</h1> : <h1>You Are Not Whitelisted Yet</h1>}
          </div>
        </div><div className={styles.inputContainer}>
            <button onClick={claimPresaleToast} disabled={!isClaimingPresale || !isPresaleEnded}>Claim</button>
            <input type="text" placeholder="0.0" onChange={handleBuyAmount} />
            <button onClick={buyInPresaleToast} disabled={!isPresale}>Join</button>
          </div>
          </>)}

        {/* //Presale Ended and not claiming yet   */}

        {isPresaleEnded && !isClaimingPresale && !isPresale && (<div><h1 className={styles.title}>Presale Ended Soon You Can Claim Your Tokens</h1></div>)}  

        {/* //Presale Ended and Ready to claim */}

        {isPresaleEnded && isClaimingPresale && !isClaimedPresaleToken && (<div className={styles.claimContainer}><h1 className={styles.title}>You Can Claim Your Tokens Now</h1> <button onClick={claimPresaleToast}>Claim</button></div>)}

        {isPresaleEnded && isClaimingPresale && isJoinedPresale && isClaimedPresaleToken &&(<div className={styles.claimContainer}><h1 className={styles.title}>You Claimed Your Tokens If You Have Any Issue Please Contact Us On Telegram</h1></div>)}
        {/* <h1 className={styles.title}>Presale Start In:</h1>
        <CountDownTimer d={d} h={h} m={m} s={s} />
        
        <div className={styles.info}>
          <div className={styles.barContainer}>
              <div className={styles.barFiller} style={{width: `${barPercentage}%`}}>
              </div>
          </div>
          <div className={styles.bnbContainer}>
                <h2 className={styles.bnbCurrent}>{totalBuyAmount}BNB</h2>
                <h2 className={styles.bnbMax}>1000 BNB</h2>
          </div>
        </div>
            
        <div className={styles.inputContainer}>
            <button onClick={claimPresaleToast}  >Claim</button>
            <input type="text" placeholder="0.0" onChange={handleBuyAmount}/>
            <button onClick={buyInPresaleToast} disabled={!isPresale || !isWhiteListed}>Join</button>
        </div>
         */}
        
      </div>
    );
  }