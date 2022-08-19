import { useWeb3React } from "@web3-react/core";
import { ethers, } from "ethers";
import { useEffect, useState } from "react";

import { TryAbi, TryContractAddress } from "../TryAbi";

export default function inventory(){
    const {
        activate,
        account,
        connector,
        active,
        library: clientProvider,
      } = useWeb3React();
    const [isLoading, setLoading] = useState(null)
    const [userTokenIds, setUserTokenIds] = useState([])
    const [networkCheck, setNetworkCheck] = useState("")

    const getTokenIds = async () => {
        setLoading(true)
        const signer = await clientProvider.getSigner()
        const contract = new ethers.Contract(TryContractAddress, TryAbi, signer);
        const signerAdress = await signer.getAddress()
        const tokenIds = await contract.ownerTokenIds(signerAdress)
        const convertedTokenIds = tokenIds.map( tokenId => tokenId.toNumber())
        setUserTokenIds(convertedTokenIds)
        setLoading(false)
    }

    useEffect(() => {
        if(active && account) {
            console.log(connector)
            clientProvider.getNetwork().then(network => {
                if(network.chainId !== 80001){
                    setNetworkCheck("Please connect to polygon test network")
                }else{
                    
                    setNetworkCheck("")
                    getTokenIds()
                }
            })
            //getTokenIds()
            
            
        }
    }, [active, account, clientProvider])
    return (
        <div>
            <h1>inventory Page</h1>
            {networkCheck ? networkCheck : active ? <h1>{account}</h1> : <h1>You are not connected</h1>}
            {!networkCheck && (isLoading ? "Loading..." : userTokenIds && userTokenIds.map( tokenid => <h1 key={tokenid}>{tokenid}</h1>))}

            {/* {active ? <h1>{account}</h1> : <h1>you are not connected</h1>}
            {isLoading ? "Loading..." : userTokenIds && userTokenIds.map( tokenid => <h1 key={tokenid}>{tokenid}</h1> ) } */}
            
        </div> 
        
    )
}



