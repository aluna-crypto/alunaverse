import React from 'react'
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import {injected } from '../../lib/connectors'

import {
  Button,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import WalletDialog from './WalletDialog';

export default function WalletButton({buttonProps, buttonText, ...props}) {
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();
  const router = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const displayMessage = (msg, variant) => {
    enqueueSnackbar(msg, { 
      variant: variant,
    });
  };

  const [loading, setLoading] = React.useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = React.useState(false);

  const handleButtonClick = () => {
    if (!loading) {
      if (active) {
        handleToggleDropdown();
      } else {
        setLoading(true);
        if (typeof web3 !== 'undefined') {
          activate(injected)
            .then(setLoading(false))
            .catch((error) => displayMessage(error, 'error'));
        } else {
          setWalletDialogOpen(true);
        }
      }
    }
  };

  const handleWalletDialogClose = () => {
    setWalletDialogOpen(false);
    setLoading(false);
  };

  const [addressDisplay, setAddressDisplay] = React.useState('');

  React.useEffect(() => {
    const getAddressDisplay = async () => {
      if (account !== null && account) {
        let addressString = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        let ensName = await library.lookupAddress(account);
        
        if (ensName !== null && ensName != "") {
          setAddressDisplay(ensName);
        } else {
          setAddressDisplay(addressString);
        }
      }
    }

    getAddressDisplay();
  }, [account]);

  const anchorRef = React.useRef(null);
  
  const [dropDownOpen, setDropDownOpen] = React.useState(false);
  const handleToggleDropdown = () => {
    setDropDownOpen((prevOpen) => !prevOpen);
  };
  
  const handleCloseDropdown = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
  
    setDropDownOpen(false);
  };
  
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setDropDownOpen(false);
    }
  }
  
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(dropDownOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
  
    prevOpen.current = dropDownOpen;
  }, [dropDownOpen]);

  const handleDisconnectClick = () => {
    setDropDownOpen(false);
    if (!!connector.close) {
      connector.close().then(() => {
        deactivate();
      })
    } else {
      deactivate();
    }
  }

  return (
    <div {...props} sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div sx={{
        margin: 1,
        position: 'relative',
      }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            fontSize: '1.2rem',
            borderRadius: '5px',
          }}
          {...buttonProps}
          disabled={loading}
          onClick={handleButtonClick}
          ref={anchorRef}
        >
          {`${active ? `${addressDisplay}` : (buttonText == undefined ? "Connect to Alunaverse" : buttonText)}`}
          {active && <ExpandMoreIcon/>}
        </Button>
        {loading && <CircularProgress size={24} sx={{
          color: 'secondary.main',
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -12,
          marginLeft: -12,
        }} />}
      </div>
      <WalletDialog open={walletDialogOpen} onClose={handleWalletDialogClose} />
      <Popper open={dropDownOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex:'1' }}>
        {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'left top' : 'left bottom', zIndex:'1' }}
        >
          <Paper sx={{
            marginTop: '2px',
            padding: '15px 15px 0 15px',
            backgroundColor: 'white',
          }}>
          <ClickAwayListener onClickAway={handleCloseDropdown}>
            <MenuList autoFocusItem={dropDownOpen} id="menu-list-grow" onKeyDown={handleListKeyDown} sx={{ color: 'black' }}>
              <div sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#67D042',
                fontWeight: '600',
              }}>
                <Typography variant='body1' style={{marginRight: '20px', font: 'inherit'}}>{addressDisplay}</Typography>
                <Typography variant='caption' >connected ✔</Typography>
              </div>
              <Divider style={{backgroundColor: '#CCC'}}/>
              <MenuItem onClick={handleDisconnectClick} sx={{
                padding: '1rem 5px',
                fontSize: '0.8rem',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: '#EEED'
                }
              }}>disconnect</MenuItem>
            </MenuList>
          </ClickAwayListener>
          </Paper>
        </Grow>
        )}
      </Popper>
    </div>
  )
}