import { useWeb3React } from "@web3-react/core";
import { ethers, } from "ethers";
import { useEffect, useState } from "react";

import { CobTryAbi, CobTryContractAddress } from "../CobTryAbi";

import toast from "react-hot-toast"

import PresaleInfo from '../components/COBT/PresaleInfo'
import Presale from '../components/COBT/Presale'
import styles from '../styles/COBT.module.css'

export default function COBT(){
    const {
        activate,
        account,
        connector,
        active,
        library: clientProvider,
      } = useWeb3React();

    const [isPresale, setIsPresale] = useState()
    const [isClaimingPresale, setIsClaimingPresale] = useState()
    const [isJoinedPresale, setIsJoinedPresale] = useState()
    const [isPresaleEnded, setIsPresaleEnded] = useState()
    const [isOpenForPublic, setIsOpenForPublic] = useState()
    const [isWhiteListed, setIsWhiteListed] = useState()
    const [isClaimedPresaleToken, setIsClaimedPresaleToken] = useState()
    const [buyAmount, setBuyAmount] = useState()
    const [totalBuyAmount, setTotalBuyAmount] = useState()
    const [networkCheck, setNetworkCheck] = useState()


    const provider = new ethers.providers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545"
      
    );
    const contract = new ethers.Contract(CobTryContractAddress, CobTryAbi, provider);

    const isPresaleEnable = async () => {
        const isit = await contract.isPresale()
        setIsPresale(isit)
    }
    const isClaimingPresaleEnable = async () => {
        const isit = await contract.isClaimingPresale()
        setIsClaimingPresale(isit)
    }
    const isOpenForPublicEnable = async () => {
        const isit = await contract.isOpenForPublic()
        setIsOpenForPublic(isit)
    }

    const isPresaleEndedEnable = async () => {
        const isit = await contract.presaleEnded()
        setIsPresaleEnded(isit)
    }
    const currentTotalBuy = async () => {
      const totalBuyBig = await contract.totalBuy()
      const totalBuy = ethers.utils.formatEther(totalBuyBig)
      setTotalBuyAmount(totalBuy)
    }

    const isUserWhitelisted = async () => {
        if(active && account){
            const isit = await contract.isWhitelisted(account)
            setIsWhiteListed(isit)

        }}
    const isUserClaimedTokens = async () => {
        if(active && account){
            const isit = await contract.claimedPresaleToken(account)
            setIsClaimedPresaleToken(isit)

        }
        
        
    }
    const isUserJoinedPresale = async () => {
        if(active && account){
            const isit = await contract.isJoinedPresale(account)
            setIsJoinedPresale(isit)

        }
        
        
    }

    useEffect(() => {
        if(active && account) {
            clientProvider.getNetwork().then(network => {
                if(network.chainId !== 97){
                    setNetworkCheck("Please connect to BSC test network")
                }else{ 
                    setNetworkCheck("")
                }
            })
            
        }
    }, [active, account, clientProvider])

    useEffect(() => {
        contract.on("PresaleStarted", () => {
          ///// start the cooldown
          setIsPresale(true)
          
        });
        return () => {
          contract.removeAllListeners("PresaleStarted");
        };
      }, []);
    useEffect(() => {
        contract.on("PresaleStopped", () => {
          ///// start the cooldown
          setIsPresale(false)
          
        });
        return () => {
          contract.removeAllListeners("PresaleStopped");
        };
      }, []);

    useEffect(() => {
        contract.on("PresaleEnded", () => {
          ///// do something
          setIsPresaleEnded(true)
          toast.success('Presale Ended.', {
            style: {
              border: '1px solid #231955',
              padding: '16px',
              color: '#231955',
            },
            iconTheme: {
              primary: '#231955',
              secondary: '#E8AA42',
            },
          });
        });
        return () => {
          contract.removeAllListeners("PresaleEnded");
        };
      }, []);

    useEffect(() => {
        contract.on("PublicOpend", () => {
          setIsOpenForPublic(true)
          ///// do something
          
        });
        return () => {
          contract.removeAllListeners("PublicOpend");
        };
      }, []);

    useEffect(() => {
        setIsClaimingPresale(true)
        contract.on("ClaimingOpend", () => {
          ///// do something
          toast.success('Claiming Opend.', {
            style: {
              border: '1px solid #231955',
              padding: '16px',
              color: '#231955',
            },
            iconTheme: {
              primary: '#231955',
              secondary: '#E8AA42',
            },
          });
        });
        return () => {
          contract.removeAllListeners("ClaimingOpend");
        };
      }, []);

    useEffect(() => {
        contract.on("BoughtInPresale", (buyer, amount) => {
          ///// do something
          // setFeedBack(`Bought In Presale Buyer: ${buyer}`);
          currentTotalBuy()
        });
        return () => {
          contract.removeAllListeners("BoughtInPresale");
        };
      }, []);
    
      
    
    useEffect(() => {
        isPresaleEnable()
        isPresaleEndedEnable()
        isOpenForPublicEnable()
        isClaimingPresaleEnable()
        currentTotalBuy()
      }, [])
    
    // useEffect(() => {
    //     isClaimingPresaleEnable()
    // }, [])

    // useEffect(() => {
    //     isOpenForPublicEnable()
    // }, [])

    // useEffect(() => {
    //     isPresaleEndedEnable()
    // }, [])

    useEffect(() => {

        isUserWhitelisted()
        isUserJoinedPresale()
        isUserClaimedTokens()
      }, [active, account])

    // useEffect(() => {

    //     isUserJoinedPresale()

    //   }, [active, account])
    

    const handleBuyAmount = (e)  =>{
        setBuyAmount(e.target.value)
    }

    const buyInPresale = async () => {
        if(active && account){
          const network = await clientProvider.getNetwork()
          //56 BSC
          if(network.chainId !== 97){
            throw "Please connect to BSC test network"
          }else{
            try {
              if(isPresale){
                if(buyAmount > 0){
                  const signer = await clientProvider.getSigner();
                  const clientContract = new ethers.Contract(
                      CobTryContractAddress,
                      CobTryAbi,
                  signer
                  );
  
                  const hardCapBig = await clientContract.hardCap()
                  const totalBuyBig = await clientContract.totalBuy()
                  const buyInPreSaleAmountBig = await clientContract.buyInPreSaleAmount(account)
                  const maxBuyBig = await clientContract.maxBuy()
  
  
                  const hardCap = ethers.utils.formatEther(hardCapBig)
                  const totalBuy = ethers.utils.formatEther(totalBuyBig)
                  const buyInPreSaleAmount = ethers.utils.formatEther(buyInPreSaleAmountBig)
                  const maxBuy = ethers.utils.formatEther(maxBuyBig)
  
                  
                  console.log(typeof totalBuy, typeof buyAmount, typeof hardCap)
                  if(parseInt(totalBuy) + parseInt(buyAmount) > parseInt(hardCap)){
                      throw new Error("Presale sold out");
                      }
                  if(buyInPreSaleAmount + parseInt(buyAmount) > maxBuy){
                      let amountLeft = maxBuy - buyInPreSaleAmount
                          throw new Error(`Presale Maximum Buy Is ${maxBuy} BNB You Can Buy More ${amountLeft} BNB`);
                      }
                  if(buyAmount > parseInt(maxBuy)){
                    throw new Error(`Presale Maximum Buy Is ${maxBuy} BNB`);
                    
                  }
                  if(isOpenForPublic){
                      const value = ethers.utils.parseEther(buyAmount).toString()
                      const tx = await clientContract.buyInPresale({value})
                      console.log(tx)
                      const receipt = await tx.wait()
                      console.log(receipt)
                      return receipt.transactionHash
  
                  }else{
                      const clientWhitelisted = await clientContract.isWhitelisted(account)
                      if(clientWhitelisted){
                      
                      const value = ethers.utils.parseEther(buyAmount).toString()
                      
                      const tx = await clientContract.buyInPresale({value})
                      console.log(tx)
                      console.log(tx.hash)
                      const receipt = await tx.wait()
                      console.log(receipt)
                      return receipt.transactionHash
                  }else{
                      throw new Error("You are not whitelisted");
                  }
                  }
                }else{
                  throw new Error("Buy Amount Must Be More then 0 BNB");
                }
                  
                  
              }else{
                  throw new Error("Presale not started yet");
              }
            }catch (error) {
              if(error.data){
                throw new Error(error.data.message)
              }else{
                
                throw new Error(error.message)
              }
          }
           
            
            
        }
    }}

    const claimPresale = async() => {
        if(active && account){
            if(isJoinedPresale && isClaimingPresale){
                const signer = await clientProvider.getSigner();
                const clientContract = new ethers.Contract(
                    CobTryContractAddress,
                    CobTryAbi,
                signer
                );
                const clientAlreadyClaimed = await clientContract.claimedPresaleToken(account)
                if(!clientAlreadyClaimed){
                    await clientContract.claimTokens()
                    return "You claimed your tokens"
                }else{
                    
                    throw "You already claimed your tokens"
                }

            }else{
                throw "You are not allowed to claim"
            }
        }else{
          throw "Connect to be able to claim your tokens"
        }
    }

    return (
        <div className={styles.container}>
          <legend>Call Of Blockchain uses Call Of Blockchain Token($COBT) as an is in-game currency for all activities such as purchase items, PVP matches and PVE raids & dungeons.</legend>
            <div className={styles.topSide}>
              
              <div className={styles.try}>
                <PresaleInfo/>
              </div>
              
              <div className={styles.presale}>
                <Presale buyInPresale={buyInPresale} claimPresale={claimPresale} handleBuyAmount={handleBuyAmount} isPresaleEnded={isPresaleEnded} isJoinedPresale={isJoinedPresale} isPresale={isPresale} isWhiteListed={isWhiteListed} totalBuyAmount={totalBuyAmount} isOpenForPublic={isOpenForPublic} isClaimingPresale={isClaimingPresale} isClaimedPresaleToken={isClaimedPresaleToken} />
              </div>
            </div>
          
            {/* <button onClick={claimPresale} disabled={!isPresaleEnded || !isJoinedPresale} >Claim</button>
            {networkCheck && networkCheck}
            <h1>{isPresale ? "Presale Enbaled" : "Not yet"}</h1>
            <h1>{isWhiteListed ? "you are whitelisted" : "You are not whitelisted"}</h1>
            {isJoinedPresale && "You joined presale"}
            <h1>{isWhiteListed}</h1>
            <input type="text" onChange={handleBuyAmount}/>
            <button onClick={buyInPresale} disabled={!isPresale || !isWhiteListed} >Buy</button>
            {buyAmount}
            {feedBack && feedBack} */}
        </div> 
        
    )
}