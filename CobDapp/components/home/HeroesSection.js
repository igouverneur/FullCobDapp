import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ethers } from 'ethers';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCards } from 'swiper';

import 'swiper/css';
import "swiper/css/bundle";
import {HeroesAbi, HeroesContracts} from '../../HeroesAbi'
import styles from "./HeroesSection.module.css";




export default function HeroesSection() {
    const [hasWindow, setHasWindow] = useState(false)

    const getHeroesJson = async () => {
        const heroesJson = []
        for(let heroContract of HeroesContracts){
      
          const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
          const contract = new ethers.Contract(
          heroContract,
          HeroesAbi,
          provider
          )
      
          const tokenURI = await contract.tokenURI(1)
      
          const token = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
          const response = await fetch(token);
          const json = await response.json();
          console.log(json)
          heroesJson.push(json)
        }
        return heroesJson
      }
    
      const [heroes, setHeroes] = useState([])
      const [fetchingHeroes, setFetchingHeroes] = useState(false)
    

useEffect(() => {
    setFetchingHeroes(true)
    const heroesJson = getHeroesJson()
    heroesJson.then(items => {
      setHeroes(items)
      setFetchingHeroes(false)
    })
    
  },[])

useEffect(() => {
  if(typeof window !== "undefined"){
    setHasWindow(true)
  }
},[])

return(
    <div className={styles.container}>
        <div className={styles.description}>
            <div className={styles.title}>
                <legend>The Heroes of Blockchain</legend>
            </div>
            <ul className={styles.list}>
                <li>- The Heroes of Blockchain are the main characters in the game. At least 1 hero is required to play the game.</li>
                <li>- Each hero belongs to a specific Blockchain region, which grants their hero a special power.</li>
                <li>- All the heroes have the power to evolve but only a few of them can 'fuse'.</li>
                <li>- There is no public sale or private sale at the current time for the Hero NFTs. Stay tuned for more <Link href="/the-heroes"><a>info</a></Link></li>
                
            </ul>
            {/* <button> <Link href="/the-portal-nft">Learn More</Link></button> */}
        </div><div className={styles.heroesSwiper}>
                <Swiper
                    className={styles.swiper}
                    modules={[Navigation, EffectCards]}
                    spaceBetween={50}
                    // slidesPerView={4}
                    watchSlidesProgress
                    effect={"cards"}
                    grabCursor={true}
                    onSwiper={(swiper) => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}
                >
                    
                    {!fetchingHeroes ? heroes.map(hero => <SwiperSlide key={hero.name} className={styles.slide}>
                    {({ isActive }) => (
                            <div className={styles.vid}> {isActive ? (<video autoPlay loop poster={hero.image} style={{ width: '350px', height: '550px', objectFit: "cover" }}>
                            <source src={hero.animation_url}/>
                        </video>): (<Image src={hero.image} layout='fill' priority placeholder="blur" blurDataURL="/images/logopic.png"></Image>)}</div>
                    )}

                    </SwiperSlide>) : "Loading Data"}
                    {/* <SwiperSlide className={styles.slide}>
                    {({ isActive }) => (
                            <div className={styles.vid}> {isActive ? (<video autoPlay loop style={{ width: '350px', height: '550px', objectFit: "cover" }}>
                            <source src="images/video1.mp4" />
                        </video>): (<Image src="/images/ROB5.png" layout='fill'></Image>)}</div>
                    )}

                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                    {({ isActive }) => (
                            <div className={styles.vid}> {isActive ? (<video autoPlay loop style={{ width: '350px', height: '550px', objectFit: "cover" }}>
                            <source src="images/video2.mp4" />
                        </video>): (<Image src="/images/ROB3.png" layout='fill'></Image>)}</div>
                    )}</SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                    {({ isActive }) => (
                            <div className={styles.vid}> {isActive ? (<video autoPlay loop style={{ width: '350px', height: '550px', objectFit: "cover" }}>
                            <source src="images/video3.mp4" />
                        </video>): (<Image src="/images/ROB1.png" layout='fill'></Image>)}</div>
                    )}</SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                         {({ isActive }) => (
                            <div className={styles.vid}> {isActive ? (<video autoPlay loop style={{ width: '350px', height: '550px' , objectFit: "cover"}}>
                            <source src="images/video4.mp4" />
                        </video>): (<Image src="/images/ROB4.png" layout='fill'></Image>)}</div>
                        
                    )}</SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                         {({ isActive }) => (
                            <div className={styles.vid}> <video autoPlay muted loop style={{ width: '350px', height: '550px', objectFit: "cover" }}>
                            <source src="https://ipfs.io/ipfs/Qmax9QMcLdaH6yZJsDFvsMEedshNVWxtxS9zyJFxhMaVjG" />
                        </video></div>
                        
                    )}</SwiperSlide> */}
                </Swiper>
            </div>
        
        
    </div>
  );
}