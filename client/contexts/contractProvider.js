import React, { createContext, useContext, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers'
import Alunaverse_ABI from '../contracts/Alunaverse.json'
import AlunaverseMinter_ABI from '../contracts/AlunaverseMinter.json'
import contractAddresses from '../contracts/contract-address.json'

const networkNames = {
  1: "mainnet",
  4: "rinkeby",
  1337: "ganache"
}

const RPC_PROVIDER = process.env.NEXT_PUBLIC_MAINNET_RPC_URL == null 
? null 
: new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_MAINNET_RPC_URL
);

const ContractContext = createContext({
  signer: null,
  rpcProvider: null,
  AlunaverseContract: null,
  AlunaverseMinterContract: null
})

export const ContractProvider = ({ children }) => {

  ContractContext.displayName = `ContractContext`

  const { library, chainId } = useWeb3React();

  const AlunaverseContract = useMemo(() => {
    let chain = 1;
    let provider = RPC_PROVIDER;

    if (chainId !== undefined && Number.isInteger(chainId)) chain = chainId;
    if (library !== undefined) provider = library;
    
    let networkName = networkNames[chain];
    let address = contractAddresses[networkName]?.Alunaverse;
        
    if (!address) return undefined;
      
    try {
      return new ethers.Contract(address, Alunaverse_ABI.abi, provider);
    } catch(error) {
      console.error('Failed to get contract', error)
      return undefined;
    }
  }, [library, chainId]);

  const AlunaverseMinterContract = useMemo(() => {
    let chain = 1;
    let provider = RPC_PROVIDER;

    if (chainId !== undefined && Number.isInteger(chainId)) chain = chainId;
    if (library !== undefined) provider = library;
    
    let networkName = networkNames[chain];
    let address = contractAddresses[networkName]?.AlunaverseMinter;
        
    if (!address) return undefined;
      
    try {
      return new ethers.Contract(address, AlunaverseMinter_ABI.abi, provider);
    } catch(error) {
      console.error('Failed to get contract', error)
      return undefined;
    }
  }, [library, chainId]);

  const signer = useMemo(
    () => 
      library !== undefined
        ? library.getSigner()
        : undefined,
    [library]
  )

  const rpcProvider = useMemo(
    () => RPC_PROVIDER
  )

  const contractContext = {
    AlunaverseContract,
    AlunaverseMinterContract,
    rpcProvider,
    signer
  }

  return <ContractContext.Provider value={contractContext}>{children}</ContractContext.Provider>
}

export function useContract() {
  return useContext(ContractContext)
}