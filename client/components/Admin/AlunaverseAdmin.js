import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3-react'
import { useContract } from '../../contexts/contractProvider';
import { getTransactionErrorMessage } from '../../lib/errors';
import { useSnackbar } from 'notistack';
import { ethers } from 'ethers';

import React, { useEffect } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import { styled, useTheme  } from '@mui/material/styles';

const GridCell = styled(Grid)(({theme}) => ({
  margin: theme.spacing(1,0),
  display: 'flex',
  flexDirection: 'column',
}));

const AdminButton = styled(Button)(({theme}) => ({
  width: '100%',
  height: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
}));

const AdminText = styled(Typography)(({theme}) => ({
  overflowWrap: 'anywhere',
  fontSize: '0.9rem'
}));

export default function AlunaverseAdmin({tokenId}) {
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();
  const { AlunaverseContract, AlunaverseMinterContract, rpcProvider, signer } = useContract();

  //#region Logic

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const displayMessage = (msg, variant) => {
    enqueueSnackbar(msg, { 
      variant: variant,
    });
  };

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);

  const [isTokenContractOwner, setIsTokenContractOwner] = React.useState(false);
  const [isMinterContractOwner, setIsMinterContractOwner] = React.useState(false);
  const [tokenActive, setTokenActive] = React.useState(false);
  const [publicSaleEnabled, setPublicSaleEnabled] = React.useState(false);
  const [supplyLimit, setSupplyLimit] = React.useState(0);
  const [mintPrice, setMintPrice] = React.useState("0");
  const [tokenContractOwnerAddress, setTokenContractOwnerAddress] = React.useState(null);
  const [minterContractOwnerAddress, setMinterContractOwnerAddress] = React.useState(null);
  const [whitelistSigner, setWhitelistSigner] = React.useState(null);
  const [withdrawalAddress, setWithdrawalAddress] = React.useState(null);
  const [tokenUri, setTokenUri] = React.useState(null);
  const [contractBalance, setContractBalance] = React.useState("0");
  const [royaltyRecipient, setRoyaltyRecipient] = React.useState(null);
  const [royaltyRate, setRoyaltyRate] = React.useState(0);
  const [tokensMinted, setTokensMinted] = React.useState(0);

  const updateContractData = () => {
    if (!!AlunaverseContract && !!AlunaverseMinterContract) {
      let p0 = AlunaverseContract.owner();
      let p1 = AlunaverseMinterContract.owner();
      let p2 = AlunaverseMinterContract.tokenMintPrice(tokenId);
      let p3 = AlunaverseContract.tokenSupplyLimit(tokenId);
      let p4 = AlunaverseContract.uri(tokenId);
      let p5 = AlunaverseContract.tokenActive(tokenId);
      let p6 = AlunaverseContract.tokenTotalSupply(tokenId);
      let p7 = AlunaverseContract.royaltyInfo(1,10000);
      let p8 = AlunaverseMinterContract.withdrawalAddress();
      let p9 = AlunaverseMinterContract.whitelistSigner();
      let p10 = AlunaverseMinterContract.tokenPublicSaleEnabled(tokenId);
      let p11 = rpcProvider.getBalance(AlunaverseMinterContract.address);
      
      Promise.all([p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11])
        .then((values) => {
          setTokenContractOwnerAddress(values[0]);
          setIsTokenContractOwner(values[0] === account);
          setMinterContractOwnerAddress(values[1]);
          setIsMinterContractOwner(values[1] === account);
          setMintPrice(ethers.utils.formatUnits(values[2], 'ether'));
          setNewMintPrice(ethers.utils.formatUnits(values[2], 'ether'))
          setSupplyLimit(values[3].toNumber())
          setTokenUri(values[4]);
          setTokenActive(values[5])
          setTokensMinted(values[6].toNumber())
          setRoyaltyRecipient(values[7][0])
          setNewRoyaltyRecipient(values[7][0])
          setRoyaltyRate(values[7][1].toNumber()/100)
          setNewRoyaltyRate(values[7][1].toNumber()/100)
          setWithdrawalAddress(values[8])
          setWhitelistSigner(values[9])
          setPublicSaleEnabled(values[10])
          setContractBalance(ethers.utils.formatUnits(values[11], 'ether'))
        })
        .catch((error) => displayMessage(error, 'error'));
    }
  }

  useEffect(updateContractData, [AlunaverseContract, AlunaverseMinterContract, account, tokenId]);

  const transferEventListener = (from, to, id, amount) => {
    if (tokenId == id) {
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
  }, [AlunaverseContract]);

  const [processing, setProcessing] = React.useState(false);

  const [newTokenUri, setNewTokenUri] = React.useState('');

  const updateTokenUri = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .updateTokenUri(tokenId, newTokenUri)
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          });
        
      }
    }
  }

  const toggleTokenActive = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .toggleTokenActive(tokenId)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const togglePublicSale = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseMinterContract
          .connect(signer)
          .toggleTokenPublicSale(tokenId)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const [newMintPrice, setNewMintPrice] = React.useState('0');

  const updateMintPrice = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseMinterContract
          .connect(signer)
          .updateTokenMintPrice(tokenId, ethers.utils.parseEther(newMintPrice))
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const [minterAddress, setMinterAddress] = React.useState('');

  const checkApprovedMinter = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .approvedMinters(minterAddress)
          .then((isApproved) => {
            if (isApproved) {
              displayMessage(`${minterAddress} is an approved minter`, 'success')
            } else {
              displayMessage(`${minterAddress} is not an approved minter`, 'warning')
            }
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const approveMinter = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .approveMinter(minterAddress)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const revokeMinter = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .revokeMinter(minterAddress)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const [newWhitelistSigner, setNewWhitelistSigner] = React.useState('');

  const updateWhitelistSigner = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseMinterContract
          .connect(signer)
          .updateWhitelistSigner(newWhitelistSigner)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const [newWithdrawalAddress, setNewWithdrawalAddress] = React.useState('');

  const updateWithdrawalAddress = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseMinterContract
          .connect(signer)
          .updateWithdrawalAddress(newWithdrawalAddress)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
        
      }
    }
  }

  const withdrawFunds = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseMinterContract
          .connect(signer)
          .withdraw()
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          });
        
      }
    }
  }

  const [newOwnerAddress, setNewOwnerAddress] = React.useState('');

  const transferTokenContractOwnership = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .transferOwnership(newOwnerAddress)
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          });
        
      }
    }
  }

  const transferMinterContractOwnership = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseMinterContract
          .connect(signer)
          .transferOwnership(newOwnerAddress)
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          });
        
      }
    }
  }

  const [newRoyaltyRecipient, setNewRoyaltyRecipient] = React.useState('');
  const [newRoyaltyRate, setNewRoyaltyRate] = React.useState(0);

  const updateRoyaltyInfo = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .setRoyalties(newRoyaltyRecipient, newRoyaltyRate * 100)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
      }
    }
  }
  
  const [newSupplyLimit, setNewSupplyLimit] = React.useState(1);

  const updateTokenSupplyLimit = () => {
    if (!processing) {
      if (active) {
        setProcessing(true);

        AlunaverseContract
          .connect(signer)
          .updateTokenSupplyLimit(tokenId, newSupplyLimit)
          .then((transaction) => {
            transaction.wait()
              .then((receipt) => {
                updateContractData();
              });
            setProcessing(false)
          })
          .catch((error) => displayMessage(getTransactionErrorMessage(error), 'error'))
          .then(() => setProcessing(false));
      }
    }
  }
  
  //#endregion

  return (
    <>
      <Container maxWidth="lg" component="main">
        <Grid container spacing={2} justifyContent="space-evenly" sx={{textAlign: 'center'}}>
          <GridCell item xs={12} md={12}>
            <Typography variant='h3' component='p' align='center' gutterBottom>Alunaverse</Typography>
            <Typography variant='h3' component='p' align='center' gutterBottom>{`Configuration for Token Id: ${tokenId}`}</Typography>
            <Typography variant='h4' component='p' align='center'>{isTokenContractOwner ? "You are the owner" : "You are not the owner"} of the Alunaverse Contract</Typography>
            <Typography variant='h6' component='p' align='center' gutterBottom>{AlunaverseContract?.address}</Typography>
            <Typography variant='h4' component='p' align='center'>{isMinterContractOwner ? "You are the owner" : "You are not the owner"} of the Alunaverse Minter Contract</Typography>
            <Typography variant='h6' component='p' align='center' gutterBottom>{AlunaverseMinterContract?.address}</Typography>
            <Typography variant='h5' component='p' align='center'>{`Tokens Minted: ${tokensMinted}`}</Typography>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={toggleTokenActive}>Toggle Token Active</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p' color={tokenActive ? 'green' : 'red'}>{`Token ${tokenId} is `}<b>{tokenActive ? 'active' : 'inactive'}</b></AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField fullWidth label="Token URI" value={newTokenUri} onChange={e => setNewTokenUri(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={updateTokenUri}>Set Token URI</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>{tokenUri}</AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField style={{margin: '10px 0'}} fullWidth label="New Supply Limit" value={newSupplyLimit} onChange={e => setNewSupplyLimit(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={updateTokenSupplyLimit}>Update Token Supply Limit</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Current Supply Limit: <b>{supplyLimit}</b></AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField style={{margin: '10px 0'}} fullWidth label="New Mint Price" value={newMintPrice} onChange={e => setNewMintPrice(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isMinterContractOwner} onClick={updateMintPrice}>Update Mint Price</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Current Mint Price is <b>{mintPrice}</b></AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isMinterContractOwner} onClick={togglePublicSale}>Toggle Public Sale</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p' color={publicSaleEnabled ? 'green' : 'red'}>`Public Sale is `<b>{publicSaleEnabled ? 'active' : 'inactive'}</b></AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField fullWidth label="New Withdrawal Address" value={newWithdrawalAddress} onChange={e => setNewWithdrawalAddress(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isMinterContractOwner} onClick={updateWithdrawalAddress}>Set Withdrawal Address</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Current Withdrawal Address: {withdrawalAddress}</AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <AdminText variant='body1' component='p'>Current contract balance: {contractBalance}</AdminText>
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isMinterContractOwner} onClick={withdrawFunds}>Withdraw Funds</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Withdraw to {withdrawalAddress}</AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField fullWidth label="New Owner Wallet" value={newOwnerAddress} onChange={e => setNewOwnerAddress(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={transferTokenContractOwnership}>Transfer Alunaverse Contract Ownership</AdminButton>
            <AdminButton disabled={!active || !isMinterContractOwner} onClick={transferMinterContractOwnership}>Transfer Minter Contract Ownership</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Alunaverse Contract Owner: {tokenContractOwnerAddress}</AdminText>
            <AdminText variant='body1' component='p'>Minter Contract Owner: {minterContractOwnerAddress}</AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField fullWidth label="New Whitelist Signer" value={newWhitelistSigner} onChange={e => setNewWhitelistSigner(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isMinterContractOwner} onClick={updateWhitelistSigner}>Set Whitelist Signer</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Current Whitelist Signer: {whitelistSigner}</AdminText>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField fullWidth label="Address" value={minterAddress} onChange={e => setMinterAddress(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={checkApprovedMinter}>Check Is Approved Minter</AdminButton>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={approveMinter}>Approve</AdminButton>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={revokeMinter}>Revoke</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
          </GridCell>

          <Grid item xs={12} md={12}>
            <Divider/>
          </Grid>

          <GridCell item xs={12} md={5}>
            <TextField style={{margin: '10px 0'}} fullWidth label="New Royalty Recipient" value={newRoyaltyRecipient} onChange={e => setNewRoyaltyRecipient(e.target.value)} />
            <TextField style={{margin: '10px 0'}} fullWidth label="New Royalty Rate (%)" value={newRoyaltyRate} onChange={e => setNewRoyaltyRate(e.target.value)} />
          </GridCell>
          <GridCell item xs={12} md={3}>
            <AdminButton disabled={!active || !isTokenContractOwner} onClick={updateRoyaltyInfo}>Update Royalty Settings</AdminButton>
          </GridCell>
          <GridCell item xs={12} md={4}>
            <AdminText variant='body1' component='p'>Current Royalty Recipient: <b>{royaltyRecipient}</b></AdminText>
            <AdminText variant='body1' component='p'>Current Royalty Rate: <b>{royaltyRate}%</b></AdminText>
          </GridCell>

        </Grid>
      </Container>
    </>
  )
}
