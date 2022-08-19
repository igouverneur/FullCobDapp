import { useState } from "react";
import styles from "./CountDownTimer.module.css"

export default function CountDownTimer({d, h, m, s}) {
    
    return (
        
        <div className={styles.container}>
            <div className={styles.box}>
                <h1 className={styles.title}>Days</h1>
                <span className={styles.number}>{d}</span>
            </div>
            <div className={styles.box}>
                <h1 className={styles.title}>Hours</h1>
                <span className={styles.number}>{h}</span>
            </div>
            <div className={styles.box}>
                <h1 className={styles.title}>Minutes</h1>
                <span className={styles.number}>{m}</span>
            </div>
            <div className={styles.box}>
            <   h1 className={styles.title}>Seconds</h1>
                <span className={styles.number}>{s}</span>
            </div>
          
          
          
          
        </div>
      );
}