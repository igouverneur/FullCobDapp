
import styles from "../styles/Careers.module.css"



export default function Careers() {
  

    return (
      <div className={styles.container}>
        <div className={styles.how}>
          <h1>How to apply</h1>
          <h2>Please submit your resume and a cover letter highlighting your relevant experience and links to past or personal projects to <a href="mailto:jobs@calloflbockchain.com">jobs@calloflbockchain.com</a> </h2>
        </div>

        <div className={styles.intro}>
          <h3>Join our team</h3>
          <h1>Available positions</h1>
          <p>We believe that experience comes in many shapes and forms, so if you think you have the human qualities that would make you an excellent addition to our team, please go ahead and apply to start a conversation.</p>
        </div>

         <div className={styles.job}>
          <h3>Level designer</h3>
          <h4>Remote</h4>
         </div>

         <div className={styles.job}>
          <h3>3D Character Artist</h3>
          <h4>Remote</h4>
         </div>

         <div className={styles.job}>
          <h3>Animator</h3>
          <h4>Remote</h4>
         </div>

         <div className={styles.job}>
          <h3>VFX Artist</h3>
          <h4>Remote</h4>
         </div>

         <div className={styles.job}>
          <h3>Unity Developer</h3>
          <h4>Remote</h4>
         </div>

      </div>
        
      
    )
  }



