import { useContext, useEffect, useState, useRef } from "react";
import CountDownTimerContext from "../context/CountDownTimerContext";
import Image from "next/image";

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import toast from "react-hot-toast"

import { AiFillPlusSquare,AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';

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
  // const { publicSaleDate, setPublicSaleDate, publicSaleRemainingTime, setPublicSaleRemainingTime } =
  //   useContext(CountDownTimerContext);

    // DUMMY
    const [waiting , setWaiting] = useState(null)
    
  const contract = new ethers.Contract(TryContractAddress, TryAbi, provider);
  const isMintEnable = async() => {
    const isit = await contract.isPublicMintEnable()
    console.log(isit)
    return isit


  }
  const [isPublicSaleEnbaled, setIsPublicSaleEnbaled] = useState(false);
  const [isPublicSaleLoading, setPublicSaleLoading] = useState(false);

  const [isMintLoading, setMintLoading] = useState(false);
  const [feedBack, setFeedBack] = useState(null);
  const [error, setError] = useState(null)

  const [isLoading, setIsloading] = useState(true);

  const [mintAmount, setMintAmount] = useState(1);
  const mintInput = useRef(null);

  let d = Math.floor(publicSaleRemainingTime / (3600 * 24));
  let h = Math.floor((publicSaleRemainingTime % (3600 * 24)) / 3600);
  let m = Math.floor((publicSaleRemainingTime % 3600) / 60);
  let s = Math.floor(publicSaleRemainingTime % 60);


  // useEffect /////////////////////////////
  useEffect(() => {
    setIsPublicSaleEnbaled(isMintEnable())
  }, [])

  // useEffect(() => {
  //   setIsloading(true);
  //   setPublicSaleDate(new Date('August 17, 2022 03:24:00').getTime()/1000);
  //   setPublicSaleRemainingTime(Math.floor(publicSaleDate - Date.now() / 1000));
  //   setIsloading(false);
  // }, []);

  // useEffect(() => {
  //   if (publicSaleRemainingTime > 0) {
  //     let intervalId = setInterval(() => {
  //       setPublicSaleRemainingTime(publicSaleDate - Math.floor(Date.now() / 1000));
  //     }, 1000);
  //   }
    
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [publicSaleRemainingTime]);


  useEffect(() => {
    contract.on("publicMintingEnabled", () => {
      setIsPublicSaleEnbaled(true);
      setFeedBack("Public sale enabled, Ready to mint");
    });
    return () => {
      contract.removeAllListeners("publicMintingEnabled");
    };
  }, []);

  useEffect(() => {
    contract.on("publicMintingDisabled", () => {
      setIsPublicSaleEnbaled(false);
      setFeedBack("Public sale disabled");
    });
    return () => {
      contract.removeAllListeners("publicMintingDisabled");
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
      if(network.chainId !== 97){
        throw "Please connect to BSC test network"
      }else{
        try {
        
          if (isPublicSaleEnbaled) {
            setMintLoading(true);
            
            
              const signer = await clientProvider.getSigner();
              const clientContract = new ethers.Contract(
                TryContractAddress,
                TryAbi,
                signer
              );
              const wei = ethers.utils.parseEther((mintAmount * 0.01).toString());
              const value = wei.toString()
              const tx = await clientContract
                .mintInPublic(ethers.BigNumber.from(mintAmount), {value})
    
              console.log(tx);
              (tx && setFeedBack(`Your Transaction: ${tx.hash}`))
              // setWaiting("Wating for receipt")
            
              const receipt = await tx.wait()
              console.log(receipt)
              if (receipt && receipt.blockNumber){
                setWaiting("Done")
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
        setError("100 is the max mint amount")
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
        setError("Mint amount must be greater than 1")
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
      {/* {active ? <h1>{account}</h1> : <h1>you are not connected</h1>} */}
      <CountDownTimer d={d.toString()} h= {h.toString()} m={m.toString()} s={s.toString()}/>

      {/* {publicSaleRemainingTime <= 0 && publicSaleRemainingTime ? (
        <h1>IT IS TIME</h1>
      ) : isLoading ? (
        "Loading"
      ) : (
        <h1>
          Days {d} Hours {h} Mintus {m} Seconds {s}
        </h1>
      )} */}

    


      {/* <h1>NFT name : {props.json.name}</h1>
      <video autoPlay loop style={{ width: '500px', height: '500px' }}>
        <source src={props.json.image} />
      </video> */}
      <div className={styles.publicSale}>
        <div className={styles.inputContainer}>
          {/* <button onClick={handleDecrease} ><AiFillPlusSquare size={22}/></button> */}
          <div className={styles.btnIcon} onClick={handleDecrease}><AiFillMinusCircle size={50} /></div>
            <input
            type="text"
            ref={mintInput}
            // onChange={(e) => setMintAmount(e.target.value)}
            onChange={handleMintAmount}
            value={mintAmount}
            disabled={!isPublicSaleEnbaled}
            placeholder="1"
          />
          <div className={styles.btnIcon} onClick={handleIncrease}><AiFillPlusCircle size={50} /></div>
          {/* <button onClick={handleIncrease} >Increase</button> */}
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

      {/* <div className={styles.mintButton}>
        <Image src="/svgs/splashMint.svg" width="250px" height="200px"></Image>
        <h3 className={styles.mint}>Mint</h3>
      </div> */}
      
      
      {/* {error && <h1>{error}</h1>}
      {feedBack && <h1>{feedBack}</h1>}
      {waiting && <h1>{waiting}</h1>} */}
      
      </div>
      
      
    </div>
    <div className={styles.info}>
      
        <h3>Sold: 150 / 25000</h3>
        <h3>Price: 50 MATIC</h3>
        <a href="https://testnets.opensea.io/collection/maintry-v3" target="_blank"><Image src="/svgs/OpenSea-Full-Logo.png" width="150px" height="40px"/></a>
      </div>
    </>
    
  );
}

// export async function getServerSideProps(context) {
//   const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/u5C0fN-PmJFNl7Hio3i1CsxwACqlzOhI");
//   const contract = new ethers.Contract(
//       TryContractAddress,
//       TryAbi,
//       provider
//       )

//   const tokenURI = await contract.tokenURI(1)
//   const token = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
//   const response = await fetch(token);
//   const json = await response.json();
//   console.log(json)

//   return {
//     props: {json},
//   }
// }
