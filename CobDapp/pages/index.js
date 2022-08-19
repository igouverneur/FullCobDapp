import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useContext } from 'react'
import Interface from '../components/home/Interface'
import Nav from "../components/layout/header/Nav"
import AboutGame from '../components/home/AboutGame'
import AuthenticationSection from '../components/home/AuthenticationSection'
import HeroesSection from '../components/home/HeroesSection'
import PoweredBySection from '../components/home/PoweredBySection'
import styles from '../styles/Home.module.css'



export default function Home() {
  

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
  return (
    
    <div className={styles.container}>
      
      {/* <Nav/> */}
      <Interface/>
      {/* <h1>New Athentication System</h1> */}
      <AuthenticationSection/>
      <HeroesSection/>
      <AboutGame/>
      <PoweredBySection/>
      {/* <style jsx >
        {`
        body {
          background: white;
         }
        `}
      </style> */}
    </div>
  )
}
