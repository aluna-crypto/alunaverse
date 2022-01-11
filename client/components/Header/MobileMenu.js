import React from 'react'
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import WalletButton from './WalletButton';
import { TwitterIcon, DiscordIcon, InstagramIcon} from '../Icons';

import { useRouter } from 'next/router'

export default function MobileMenu(props) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        {...props}
      >
        <MenuIcon sx={{fontSize: '2rem', filter: 'drop-shadow(2px 2px 1px #000000)'}}/>
      </IconButton>
      <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
            role="presentation"
            // onClick={toggleDrawer(false)}
            // onKeyDown={toggleDrawer(false)}
            style={{backgroundColor:"#222", padding:'10px', height:'100%'}}
        >
          <List component='nav'>
            <WalletButton/>
            <Divider sx={{my:2}}/>
            <div onClick={toggleDrawer(false)}>
              {!!props.links && props.links.map((link, index) => <ListItem key={index} button component="a" href={link.href}>
                <ListItemText primary={link.name} primaryTypographyProps={{variant:'h6'}}/>
              </ListItem>)}
            </div>
          </List>
        </div>
      </Drawer>
    </>
  );
}