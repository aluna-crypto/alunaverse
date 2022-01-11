import React from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import { styled, useTheme  } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import WalletButton from './WalletButton';
import MobileMenu from './MobileMenu';
import { TwitterIcon, DiscordIcon, InstagramIcon} from '../Icons';

import { useRouter } from 'next/router'

const GrowDiv = styled('div')(({theme}) => ({
  flexGrow: 1
}));

const MarginLink = styled(Link)(({theme}) => ({
    margin: theme.spacing(1, 3)
}));

export default function Header(props) {
  const router = useRouter();
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const preventDefault = (event) => event.preventDefault();

  return (
    <>
      <AppBar 
        position="fixed" 
        color={"default"} 
        elevation={0} 
        sx={{
          backgroundColor: 'background.default',
          padding: '0'
        }}
      >
        <Toolbar sx={{
          flexWrap: 'no-wrap',
          justifyContent: 'center',
        }}>
          { !largeScreen && <>
            <Link color='textPrimary' onClick={() => router.push('/')} variant='h6' sx={{textDecoration: 'none', cursor: 'pointer'}}>Alunaverse</Link>
            <GrowDiv/>
            <MobileMenu links={props.links}/>
          </>}
          { largeScreen && <>
            <Link color='textPrimary' onClick={() => router.push('/')} variant='h6' sx={{textDecoration: 'none', cursor: 'pointer'}}>Alunaverse</Link>
            <GrowDiv/>
            {!!props.links && props.links.map((link, index) => <MarginLink key={index} color='textPrimary' href={link.href} >
              {link.name}
            </MarginLink>)}
            <WalletButton/>
          </>}
        </Toolbar>
      </AppBar>
    </>
  );
}