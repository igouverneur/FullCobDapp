import styles from "./HeroCard.module.css";
import Image from "next/image";


export default function HeroCard({name, description, image}) {
    return (
        
        <div className={styles.card} style={{backgroundImage: `url("${image}")`} }>
            <div className={styles.top}>
            <h2 className={styles.name}>{name}</h2>
            <h3 className={styles.description}>{description}</h3>
            </div>
            
            <div className={styles.bottom}>
            <button>Mint</button>
            <a target="_blank" href={`https://testnets.opensea.io/collection/${name.toLowerCase()}try`}><Image src="/svgs/Logomark-Transparent White.png" height="50px" width="50px"/></a>
            </div>
            
        </div>
        
        
        
          
      
    );
  }