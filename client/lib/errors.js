import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import { UserRejectedRequestError } from '@web3-react/walletconnect-connector'


export function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Request cancelled, user rejected.';
  } else if (error instanceof UserRejectedRequestError) {
    return 'Request cancelled, user rejected.';
  } else {
    console.error(error);
    return `Unknown error: ${JSON.stringify(error)}`;
  }
}

export function getTransactionErrorMessage(error) {
  let match = JSON.stringify(error).match(/"message":"(.*?)"/);
  if (!!match && match.length > 0) {
    if (match[0].includes("err: insufficient funds for transfer")) {
      return "Not enough funds in your wallet";
    }
    if (match[0].includes("User denied transaction signature.")) {
      return "Transaction cancelled by user";
    }

    return (match[0])
  }
  
  return `Unknown error: ${JSON.stringify(error)}`;
}
