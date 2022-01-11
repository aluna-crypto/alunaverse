import React from 'react'
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Hidden,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {
  injected,
  walletconnect,
  walletlink,
} from '../../lib/connectors'

const WalletOption = ({clickHandler, name, descr, imgUrl}) => {
  return (
    <ListItem button 
      onClick={clickHandler} 
      key={name} 
      sx={{
        padding: "1rem 2rem",
        minWidth: '300px',
        borderTop: 'solid 1px #777',
        '&:hover, &:focus': {
          background: 'rgba(200,200,250,0.275)',
          color: '#333366',
        },
        '&:last-child': {
          borderBottom: 'solid 1px #777',
        }
      }}
    >
      <img src={imgUrl} style={{
        width: '50px',
        height: '50px',
        marginRight: '20px',
        filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))',
      }}/>
      <ListItemText primary={name} secondary={descr} sx={{
        '& .MuiListItemText-primary': {
          fontSize: '1.2rem',
          color: 'inherit',
        },
        '& .MuiListItemText-secondary': {
          fontSize: '0.8rem',
          color: 'inherit',
        }
      }}/>
    </ListItem>
  )
}

function WalletDialog(props) {
  const { activate } = useWeb3React();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const displayMessage = (msg, variant) => {
    enqueueSnackbar(msg, { 
      variant: variant,
    });
  };

  const { onClose, open } = props;

  const handleConnectorClick = (connector) => {
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }
    
    activate(connector)
      .then(() => onClose())
      .catch((error) => displayMessage(error, 'error'));
  }

  const handleDialogClose = (reason) => {
    onClose();
  }

  const [hasInjected, setHasInjected] = React.useState(false);

  React.useEffect(() => {
    if (typeof web3 !== 'undefined') {
      setHasInjected(true);
    }
  })

  const installMetamask = () => {
    let action = key => (
      <Button onClick={() => { window.open("https://metamask.io/download.html") }}>
        Install Metamask
      </Button>
    );

    enqueueSnackbar("Can't detect any Web3 wallets. If you're on a mobile device you need to open this website from the browser inside you Wallet app, or try the WalletConnect option.  If you're using a computer please click to install Metamask.", {
      variant: 'warning',
      autoHideDuration: 15000,
      action,
    });
  };

  return (
    <Dialog maxWidth="xs" onClose={handleDialogClose} aria-labelledby="wallet-dialog-title" open={open} sx={{
      display: 'flex',
      flexFlow: 'column wrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      '& .MuiDialog-paper': {
        backgroundColor: '#eee',
        color: 'black',
      }
    }}>
      <DialogTitle>Connect to Wallet</DialogTitle>
      <List>
        <WalletOption clickHandler={() => hasInjected ? handleConnectorClick(injected) : installMetamask()} name='Metamask' descr='or any other Web3 wallet' imgUrl='/images/metamask.png'/>
        <WalletOption clickHandler={() => handleConnectorClick(walletconnect)} name='WalletConnect' descr='connect with a mobile wallet app' imgUrl='/images/walletConnectIcon.svg'/>
        <WalletOption clickHandler={() => handleConnectorClick(walletlink)} name='WalletLink' descr='connect with Coinbase Wallet' imgUrl='/images/coinbase.png'/>
      </List>
      <DialogActions>
        <Button onClick={handleDialogClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WalletDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default WalletDialog;