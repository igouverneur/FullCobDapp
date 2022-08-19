import { useContext, useEffect, useState, useRef } from "react";
import CountDownTimerContext from "../context/CountDownTimerContext";
import Image from "next/image";

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import toast from "react-hot-toast"

import {AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';

import { TryAbi, TryContractAddress } from "../TryAbi";
//TRY
import styles from "../styles/ThePortalNFT.module.css"
import CountDownTimer from "../components/countDownTimer/CountDownTimer";
//TRY
export default function PortalNFT() {
  const {
    activate,
    account,
    connector,
    active,
    library: clientProvider,
  } = useWeb3React();
  
  
  const provider = new ethers.providers.JsonRpcProvider(
    "https://matic-mumbai.chainstacklabs.com"
    
    );
    
  const { publicSaleRemainingTime } =
    useContext(CountDownTimerContext);
  
    
  const contract = new ethers.Contract(TryContractAddress, TryAbi, provider);
  // const isMintEnable = async() => {
  //   const isit = await contract.isPublicMintEnable()
  //   console.log(isit)
  //   return isit


  // }
  const isMintEnable = async () => {
    const isit = await contract.isPublicMintEnable()
    setIsPublicSaleEnbaled(isit)
}
  const [isPublicSaleEnbaled, setIsPublicSaleEnbaled] = useState();
  const [soldAmount, setSoldAmount] = useState()
  const [mintPrice, setMintPrice] = useState()
  // const [isPublicSaleLoading, setPublicSaleLoading] = useState(false);

  // const [isMintLoading, setMintLoading] = useState(false);
  // const [feedBack, setFeedBack] = useState(null);
  // const [error, setError] = useState(null)

  // const [isLoading, setIsloading] = useState(true);
  const currentSoldAmount = async () => {
    const sold = await contract.totalSupply()
    const totalSold = sold.toString()
    setSoldAmount(totalSold)
  }
  const currentMintPrice = async () =>{
    const priceBig = await contract.mintPrice()
    const price = ethers.utils.formatEther(priceBig)
    setMintPrice(price)

  }
  const [mintAmount, setMintAmount] = useState(1);
  
  const mintInput = useRef(null);

  let d = Math.floor(publicSaleRemainingTime / (3600 * 24));
  let h = Math.floor((publicSaleRemainingTime % (3600 * 24)) / 3600);
  let m = Math.floor((publicSaleRemainingTime % 3600) / 60);
  let s = Math.floor(publicSaleRemainingTime % 60);


  // useEffect /////////////////////////////
  // useEffect(() => {
  //   setIsPublicSaleEnbaled(isMintEnable())
    
  // }, [])

  useEffect(() => {
    currentSoldAmount()
    currentMintPrice()
    isMintEnable()
    
  },[])

  useEffect(() => {
    contract.on("publicMintingEnabled", () => {
      setIsPublicSaleEnbaled(true);
      
    });
    return () => {
      contract.removeAllListeners("publicMintingEnabled");
    };
  }, []);

  useEffect(() => {
    contract.on("publicMintingDisabled", () => {
      setIsPublicSaleEnbaled(false);
      
    });
    return () => {
      contract.removeAllListeners("publicMintingDisabled");
    };
  }, []);

  useEffect(() => {
    contract.on("mintedInPublicSale", () => {
      currentSoldAmount()
      
    });
    return () => {
      contract.removeAllListeners("mintedInPublicSale");
    };
  }, []);
  const handleMintToast = () => {
    toast.promise(
      handleMint(),
       {
         loading: 'Minting...',
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
  const handleMint = async () => {
    // e.preventDefault();
    if (active && account) {
      const network = await clientProvider.getNetwork()
      //137 Polygon
      if(network.chainId !== 80001){
        throw "Please connect to BSC test network"
      }else{
        try {
        
          if (isPublicSaleEnbaled) {
            
            
              const signer = await clientProvider.getSigner();
              const clientContract = new ethers.Contract(
                TryContractAddress,
                TryAbi,
                signer
              );
              const wei = ethers.utils.parseEther((mintAmount * mintPrice).toString());
              const value = wei.toString()
              const tx = await clientContract
                .mintInPublic(ethers.BigNumber.from(mintAmount), {value})
    
              console.log(tx);
            
              const receipt = await tx.wait()
              console.log(receipt)
              if (receipt && receipt.blockNumber){
                return `You are successfully minted ${mintAmount} Portal to the blockchain NFT`
              }else{
               throw "Something went wrong!"
              }
            
          } else {
            throw "Public Sale Not Started Yet"
          }    
          
        } catch (error) {
          if(error.data){
            console.log(error.data)
            throw new Error(error.data.message)
          }else{
            throw new Error(error.message)
          }
        }
      }
      
      
      
    } else {
      throw "Please connect to be able to mint"
    }
  };
  const handleMintAmount = (e) => {
    if(e.target.value >= 1 && e.target.value <= 100){
      setMintAmount(e.target.value)
    }else{
      if(e.target.value > 100){
        toast.error("100 is the max mint amount", {
          style: {
            border: '1px solid #1F4690',
            padding: '16px',
            color: '#1F4690',
          },
          iconTheme: {
            primary: '#1F4690',
            secondary: '#E8AA42',
          },
          duration: 6000,
        })

        setMintAmount(100)
      }else{
        toast.error("Mint amount must be greater than 1", {
          style: {
            border: '1px solid #1F4690',
            padding: '16px',
            color: '#1F4690',
          },
          iconTheme: {
            primary: '#1F4690',
            secondary: '#E8AA42',
          },
          duration: 6000,
        })

        setMintAmount(1)
      }
      
      
    }
  }
  const handleIncrease = (e) => {
    
    mintAmount < 100 ? setMintAmount(parseInt(mintAmount) + 1) : setMintAmount(100)
  }
  const handleDecrease = () => {
    mintAmount > 1 ? setMintAmount(parseInt(mintAmount) - 1) : setMintAmount(1)
  }

  return (
    <>
    <div className={styles.container}>
      <legend className={styles.title}>Mint Your Portal</legend>
      <h2 className={styles.description}>The Portal NFT is your only way into the world of blockchain, The authentication system of Call of Blockchain is different you do not need email or password to log in you just need to hold a portal and this will be your Account and any progress will be saved in your Portal NFT.<br/>The first 25000 Portal are unique and you can mint max 100 NFT per wallet.</h2>
      
      <CountDownTimer d={d.toString()} h= {h.toString()} m={m.toString()} s={s.toString()}/>

    
      <div className={styles.publicSale}>
        <div className={styles.inputContainer}>
          
          <div className={styles.btnIcon} onClick={handleDecrease}><AiFillMinusCircle size={50} /></div>
            <input
            type="text"
            ref={mintInput}
            
            onChange={handleMintAmount}
            value={mintAmount}
            disabled={!isPublicSaleEnbaled}
            placeholder="1"
          />
          <div className={styles.btnIcon} onClick={handleIncrease}><AiFillPlusCircle size={50} /></div>
          
        </div>
      
      <button
        className={styles.mintButton}
        
        type="submit"
        disabled={!isPublicSaleEnbaled}
        onClick={handleMintToast}
      >
        
        <Image src="/svgs/splashMint.svg" width="250px" height="200px"></Image>
        <h3 className={styles.mint}>Mint</h3>
      </button>

      
      </div>
      
      
    </div>
    <div className={styles.info}>
      
        <h3>Sold: {soldAmount} / 25000</h3>
        <h3>Price: {mintPrice} MATIC</h3>
        <a href="https://testnets.opensea.io/collection/maintry-v3" target="_blank"><Image src="/svgs/OpenSea-Full-Logo.png" width="150px" height="40px"/></a>
      </div>
    </>
    
  );
}

