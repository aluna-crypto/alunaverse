import React from 'react'
import { styled, useTheme  } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography
} from '@mui/material';

import { TwitterIcon, DiscordIcon, InstagramIcon, TelegramIcon, YoutubeIcon } from '../Icons';
import Copyright from './Copyright'

const MarginLink = styled(Link)(({theme}) => ({
  margin: theme.spacing(0, 3)
}));

export default function Footer() {

  return (
    <Container maxWidth="lg" component="footer" sx={{
      mt: 0,
      pt: {
        xs: 3,
        sm: 6
      },
      pb: {
        xs: 3,
        sm: 6
      }
    }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} style={{display:'flex', justifyContent:'start', alignItems:'center', flexDirection: 'column'}}>
          <Typography variant='body1' fontWeight='300'>JOIN & FOLLOW</Typography>
          <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection: 'row', my: '1rem'}}>
            <MarginLink variant="button" color="textPrimary" href="https://twitter.com/alunasocial" target="_blank" rel="noopener">
              <TwitterIcon style={{ fontSize: 32, marginBottom:'12px'}}/>
            </MarginLink>
            <MarginLink variant="button" color="textPrimary" href="https://t.me/alunasocial" target="_blank" rel="noopener">
              <TelegramIcon style={{ fontSize: 32, marginBottom:'12px' }}/>
            </MarginLink>
            <MarginLink variant="button" color="textPrimary" href="https://discord.gg/cDDjCAtcxK" target="_blank" rel="noopener">
              <DiscordIcon style={{ fontSize: 32, marginBottom:'12px' }}/>
            </MarginLink>
            <MarginLink variant="button" color="textPrimary" href="https://youtube.com/c/alunasocial" target="_blank" rel="noopener">
              <YoutubeIcon style={{ fontSize: 32, marginBottom:'12px' }}/>
            </MarginLink>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} style={{display:'flex', justifyContent:'start', alignItems:'center', flexDirection: 'column'}}>
          <Typography variant='body1' fontWeight='300'>ALUNAVERSE IS CREATED BY</Typography>
          <img src="/images/aluna-logo.png" style={{height: '32px', margin: '1rem 0'}}/>
        </Grid>
      </Grid>
    </Container>
  );
}