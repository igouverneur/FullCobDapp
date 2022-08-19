import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import Image from "next/image"
import { useEffect, useState } from "react";

import HeroCard from "../components/heroes/HeroCard";
import {HeroesAbi, HeroesContracts} from '../HeroesAbi'

import styles from "../styles/TheHeroes.module.css"


// const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com"");
// const contract = new ethers.Contract(
//       TryContractAddress,
//       TryAbi,
//       provider
//       )

export default function Presale() {
  const {
    activate,
    account,
    connector,
    active,
    library: clientProvider,
  } = useWeb3React();

  // const [isPublicSaleEnbaled , setIsPublicSaleEnbaled] = useState(contract.isPublicMintEnable())
  // const [isPublicSaleLoading, setPublicSaleLoading] = useState(false)

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



  // const startPublicSale = async () => {
  //   const signer = new ethers.Wallet("4f3a4284efd8aa7520145b70cf90491afc6a5ff1e7884e246c87605bda91015f", clientProvider)
  //   const clientContract = new ethers.Contract(
  //     TryContractAddress,
  //     TryAbi,
  //     signer
  //     )
  //   await clientContract.setIsPublicMintEnable(true)
  // }

    

  // },[])
  // const signerAddress = async() => {
  //   const singer = await clientProvider.getSigner()
  //   const address = await singer.getAddress()
  // }
  // useEffect(() => {
  //   if(active && account){
  //     signerAddress()
  //   }
  
    // const contract = new ethers.Contract(TryContractAddress, TryAbi, singer);

  // },[active])

    return (
      <div className={styles.container}>
        <h1 className={styles.note}>NOTE: The Heroes NFTs Are Not For Sale And There Is No Set Date Until The Beta Launch Of The Game.</h1>
        <h1 className={styles.description}>The heroes of blockchain are the main characters in the game, you need at least 1 character to start playing(along with a Portal NFT.) and of course you can collect as many heroes as you can, Each hero belongs to a specific region, for example Linda belongs to Kusama while Clark is from Solana.</h1>
        <div className={styles.cards}>
        {!fetchingHeroes ? heroes.map(hero => <HeroCard key={hero.name} name={hero.name} description={hero.description} image={hero.image}/>) : "Loading Data"}
        </div>
        {/* {active ? <h1>{account}</h1> : <h1>you are not connected</h1>}
        <h1> {props.finalEth} </h1>
        {isPublicSaleLoading ? <h1>isLoading</h1> :
          isPublicSaleEnbaled ? <h1>Public sale started</h1> : <h1>Not Yet</h1>
        } */}
        {/* {heroes.length > 0 ? heroes.map(hero => <h1 key={hero.name}>{hero.name}</h1>) : "Loading Data"} */}
        {/* {!fetchingHeroes ? heroes.map(hero => <Image src={hero.image} key={hero.name} width={300}
      height={300}/>) : "Loading Data"} */}
        
      
      </div>
      
    )
  }

