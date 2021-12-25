import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { useWeb3React } from '@web3-react/core';
import { useContract } from '../contexts/contractProvider';
import { useSnackbar } from 'notistack';

import { getErrorMessage, getTransactionErrorMessage } from "../lib/errors";

export default function MintCounter({tokenId, ...props}) {
  const { active, account, chainId } = useWeb3React();
  const { AlunaverseContract } = useContract();
  const { enqueueSnackbar } = useSnackbar();
  
  const displayMessage = (msg, variant) => {
    enqueueSnackbar(msg, { 
      variant: variant,
    });
  };

  const [supplyLimit, setSupplyLimit] = React.useState(0);
  const [tokensMinted, setTokensMinted] = React.useState(0);
  const [tokenActive, setTokenActive] = React.useState(false);

  const updateContractData = () => {
    if (!!AlunaverseContract) {
      let p0 = AlunaverseContract.tokenSupplyLimit(tokenId);
      let p1 = AlunaverseContract.tokenTotalSupply(tokenId);
      let p2 = AlunaverseContract.tokenActive(tokenId);
      
      Promise.all([p0, p1, p2])
        .then((values) => {
          setSupplyLimit(values[0].toNumber())
          setTokensMinted(values[1].toNumber())
          setTokenActive(values[2])
        })
        .catch((error) => displayMessage(error, 'error'));
    }
  }

  useEffect(updateContractData, [AlunaverseContract, account, tokenId]);

  const transferEventListener = (from, to, id) => {
    if (id == tokenId) {
      AlunaverseContract.tokenTotalSupply(tokenId)
      .then((value) => setTokensMinted(value.toNumber()))
      .catch((error) => displayMessage(`Error retrieving total supply: ${getErrorMessage(error)}`, 'error'));
    }
  };

  useEffect(() => {
    if (!!AlunaverseContract) {
      AlunaverseContract.on("TransferSingle", transferEventListener);

      return () => AlunaverseContract.off("TransferSingle", transferEventListener);

    }
  }, [AlunaverseContract, tokenId]);

  if (tokenActive) {
    return (
      <Typography {...props}>{`${tokensMinted}/${supplyLimit} Minted`} • <Link color="textPrimary" href="https://opensea.io/collection/alunaverse" sx={{cursor: 'pointer'}} target="_blank" rel="noopener">View on Opensea</Link></Typography>
    )
  } else {
    return (
      <Typography {...props}>Coming Soon</Typography>
    )
  }
}
