import styles from "./AuthenticationSection.module.css";
import { useEffect, useState } from "react";
import ReactPlayer from 'react-player/youtube'
import Link from "next/link";

import { BsFillPlayCircleFill } from 'react-icons/bs';




export default function AuthenticationSection() {
const [hasWindow, setHasWindow] = useState(false)

useEffect(() => {
  if(typeof window !== "undefined"){
    setHasWindow(true)
  }
},[])

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        {/* <legend className={styles.portalTitle}>Portal To The Blockchain</legend> */}
        {hasWindow && <ReactPlayer url='https://www.youtube.com/watch?v=cilenkZE4rc&ab_channel=AhmedM7AMY7O' light="/images/portal.jpg" width="700px" height="500px" playIcon={<span className={styles.iconColor}><BsFillPlayCircleFill size={80}/></span>}/>}
      </div>
      <div className={styles.rightSide}>
        <div className={styles.title}>
          <legend>Authentication System</legend>
        </div>
        <div className={styles.description}>
          {/* <h2>As the name says, the Portal NFT is your only way into the blockchain, each NFT has a unique ID and a registered account, No more Emails and Passwords!, there is 25000 unique Accounts in the public sale stay tuned to join us. Yes! that means selling your NFT is exacly selling your Account</h2> */}
          <ul className={styles.description}>
            <li>- Ownership of a Portal NFT is the only way into the world of Blockchain.</li>
            <li>- Each NFT has a unique ID and associated registered account; no more Emails and passwords!</li>
            <li>- If you sell/transfer your Portal NFT, the new owner will also gain possession of the associated account and all its items.</li>
            <li>- There will be 25000 unique Portal NFTs in the <Link href="/the-portal-nft"><a>public sale </a></Link>.</li>
          </ul>
          {/* <button> <Link href="/the-portal-nft">Learn More</Link></button> */}
        </div>
      </div>
    </div>
  );
}