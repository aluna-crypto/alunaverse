import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import WalletButton from './Header/WalletButton';

import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useContract } from '../contexts/contractProvider';
import { useSnackbar } from 'notistack';

import { getErrorMessage, getTransactionErrorMessage } from "../lib/errors";

const SaleStates = {
  None: 0,
  PreSale: 1,
  PublicSale: 2
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  height: "0.5rem",
  borderRadius: "0.5rem",
  marginTop: '1rem',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#303030',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function MintControl({tokenId, ...props}) {
  const router = useRouter();
  const { active, account, chainId } = useWeb3React();
  const { AlunaverseContract, AlunaverseMinterContract, signer } = useContract();
  const { enqueueSnackbar } = useSnackbar();
  
  const displayMessage = (msg, variant) => {
    enqueueSnackbar(msg, { 
      variant: variant,
    });
  };

  const [tokenActive, setTokenActive] = React.useState(false);
  const [publicSaleEnabled, setPublicSaleEnabled] = React.useState(false);
  const [supplyLimit, setSupplyLimit] = React.useState(0);
  const [mintPrice, setMintPrice] = React.useState("0");
  const [tokensMinted, setTokensMinted] = React.useState(0);

  const [mintEligible, setMintEligible] = React.useState(false);
  const [whitelistApprovedMints, setWhitelistApprovedMints] = React.useState(0);

  const [mintNumber, setMintNumber] = React.useState(0);
  const [processing, setProcessing] = React.useState(false);

  const updateContractData = () => {
    if (!!AlunaverseContract && !!AlunaverseMinterContract) {
      let p0 = AlunaverseMinterContract.tokenMintPrice(tokenId);
      let p1 = AlunaverseContract.tokenSupplyLimit(tokenId);
      let p2 = AlunaverseContract.tokenActive(tokenId);
      let p3 = AlunaverseContract.tokenTotalSupply(tokenId);
      let p4 = AlunaverseMinterContract.tokenPublicSaleEnabled(tokenId);
      
      Promise.all([p0, p1, p2, p3, p4])
        .then((values) => {
          setMintPrice(ethers.utils.formatUnits(values[0], 'ether'));
          setSupplyLimit(values[1].toNumber())
          setTokenActive(values[2])
          setTokensMinted(values[3].toNumber())
          setPublicSaleEnabled(values[4])
        })
        .catch((error) => displayMessage(error, 'error'));
    }
  }

  useEffect(updateContractData, [AlunaverseContract, account, tokenId]);

  useEffect(() => {
    if (!active) return;

    if (!tokenActive) {
      setPublicSaleEnabled(false);
      setWhitelistApprovedMints(false);
      setMintEligible(false);
      return;
    }

    if (publicSaleEnabled) {
      setMintEligible(true);
      return;
    };

    fetch(`/api/whitelist/${account}?tokenId=${tokenId}&chainId=${chainId}`, {method: 'GET'})
    .then(res => {
      if (res.status != 200) {
        throw new Error(res.statusText)
      }
      return res.json();
    })
    .then(responseData => {
      if (responseData.success != true) {
        throw new Error(responseData.error);
      } else {
        setWhitelistApprovedMints(responseData.limit);
        setMintEligible(responseData.limit > 0);
      }
    })
    .catch((error) => {
      displayMessage(error.message, 'error');
    })
  }, [account, tokenId, tokenActive, publicSaleEnabled, AlunaverseMinterContract])


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

  const mintWhitelist = (number, sendPrice) => {
    fetch(`/api/whitelist/${account}?tokenId=${tokenId}&chainId=${chainId}`, {method: 'GET'})
    .then(res => {
      if (res.status != 200) {
        throw new Error(res.statusText)
      }
      return res.json();
    })
    .then(responseData => {
      if (responseData.success != true) {
        throw new Error(responseData.error);
      } else if (responseData.whitelisted != true ) {
        throw new Error(responseData.message);
      } else {
        return [ responseData.signature, responseData.limit ];
      }
    })
    .then(([signature, limit]) => {
      AlunaverseMinterContract
        .connect(signer)
        .whitelistMint(signature, tokenId, number, limit, {value: sendPrice})
        .then((transaction) => {
          displayMessage(`Minting in progress..`, 'info');
          setProcessing(false);
          return transaction.wait();
        })
        .then((receipt) => {
          displayMessage(`Successfully minted ${number} NFTs!`, 'success');
        })
        .catch((error) => {
          displayMessage(getTransactionErrorMessage(error), 'error');
          setProcessing(false);
        });
    })
    .catch((error) => {
      displayMessage(error.message, 'error');
      setProcessing(false);
    })
  }

  const mintPublicSale = (number, sendPrice) => {
    AlunaverseMinterContract
      .connect(signer)
      .publicMint(tokenId, number, {value: sendPrice})
      .then((transaction) => {
        displayMessage(`Minting in progress..`, 'info');
        setProcessing(false);
        return transaction.wait();
      })
      .then((receipt) => {
        displayMessage(`Successfully minted ${number} NFTs!`, 'success');
      })
      .catch((error) => {
        displayMessage(getTransactionErrorMessage(error), 'error');
        setProcessing(false);
      });
  }

  const handleMintButtonClick = () => {
    if (!processing && active) {
      let number = mintNumber;
      let sendPrice = ethers.utils.parseEther(mintPrice).mul(number);
      setProcessing(true);

      if (publicSaleEnabled) {
        mintPublicSale(number, sendPrice);
      } else {
        mintWhitelist(number, sendPrice, false);
      }
    }
  };

  return (
    <Box {...props} sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      backgroundColor: '#1A1A1A',
      py: '1rem',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: '2rem',
      }}>
        {!tokenActive && <>
          <Typography variant='h6' component='p'>This NFT is launching soon!</Typography>
          <Typography variant='body1' component='p' margin='1rem 0'>Subscribe to get notified when it is mintable.</Typography>
          <Button variant='contained' color='primary' onClick={() => router.push('/#subscribe')} sx={{borderRadius: '3px', fontSize: '1.2rem', textTransform: 'none', padding: '0.5rem 2rem'}}>Get notified</Button>
        </>}
        {!active && tokenActive && <>
          <Typography variant='h6' component='p'>Get whitelisted to mint this NFT</Typography>
          <WalletButton buttonProps={{color: 'primary', sx:{ borderRadius: '3px', fontSize: '1.2rem', textTransform: 'none', padding: '0.5rem 2rem'}}} buttonText="Connect your wallet" style={{margin: '1rem 0'}}/>
        </>}
        {active && tokenActive && !publicSaleEnabled && whitelistApprovedMints > 0 && <>
          <Typography variant='h6' component='p' color='#1FC16D'>Your wallet is whitelisted</Typography>
          <Typography variant='body1' component='p' margin='1rem 0'>{`Mint ${whitelistApprovedMints} for free (gas-only).`}</Typography>
        </>}
        {active && tokenActive && !publicSaleEnabled && whitelistApprovedMints == 0 && <>
          <Typography variant='h6' component='p' color='#F5BE23'>Get whitelisted to mint this NFT.</Typography>
          <Typography variant='body1' component='p' margin='1rem 0'>Find out how to join the whitelist from the FAQ.</Typography>
          <Button variant='contained' color='primary' onClick={() => router.push('/faq')} sx={{borderRadius: '3px', fontSize: '1.2rem', textTransform: 'none', padding: '0.5rem 2rem'}}>How to get whitelisted</Button>
        </>}
      </Box>
      <Divider sx={{width: '100%'}}/>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        py: '2rem',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}>
          <TextField
            type="number"
            sx={{
              margin: '0 10px',
              width: '100px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '0'
              },
              '& input': {
                fontSize: '2rem',
                padding: '5px',
                textAlign: 'center'
              },
              '&[type=number]': {
                MozAppearance: 'textfield',
              },
              '&::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '&::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
            disabled={!active || processing || !tokenActive || ((!publicSaleEnabled) && (whitelistApprovedMints == 0))}
            variant="outlined"
            color="primary"
            value={mintNumber}
            onChange={e => setMintNumber(Math.max(0,Math.min(e.target.value, whitelistApprovedMints)))}
            inputProps={{min:"0", max: whitelistApprovedMints.toString(), step:"1"}}
          />
          <Button
            variant="contained"
            color='primary'
            sx={{
              margin: '0 10px',
              minWidth: '120px',
              borderRadius: '0',
              borderWidth: 1,
              borderStyle: 'solid',
              fontSize: '1.5rem',
            }}
            disabled={processing || !active || !tokenActive || ((!publicSaleEnabled) && (whitelistApprovedMints == 0))}
            onClick={handleMintButtonClick}
          >
            Mint
          </Button>
        </Box>
        {processing && <CircularProgress size={60} sx={{position: 'absolute'}} />}
        <Typography variant='h6' component='p' color='#9C9C9C' sx={{flexGrow: '1'}}>{`Cost: ${(Number(mintPrice)*mintNumber).toFixed(2)} ETH`}</Typography>
        <BorderLinearProgress variant="determinate" value={tokensMinted*100/supplyLimit} />
        <Typography variant='caption' component='p' color='#9C9C9C' sx={{marginTop: '5px'}}>{`${tokensMinted}/${supplyLimit} Minted`}</Typography>
      </Box>
    </Box>
  )
}
