import Image from "next/image";

import styles from "./PoweredBySection.module.css";





export default function PoweredBySection() {


return(
    <div className={styles.container}>
        <legend className={styles.title}>Powered By</legend>
        <div className={styles.icons}>
            <div className={styles.box}><Image src="/images/poweredBy/Binance.png" width="190px" height="110px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/blender.png" width="150px" height="50px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/infura.png" width="120px" height="50px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/photon.svg" width="150px" height="40px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/PlayFab.png" width="150px" height="50px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/unity.png" width="140px" height="40px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/polygon.png" width="150px" height="40px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/Metamask.png" width="150px" height="30px" /></div>
            <div className={styles.box}><Image src="/images/poweredBy/OpenSea.png" width="150px" height="40px" /></div>
        </div>
        
        
        
    </div>
  );
}