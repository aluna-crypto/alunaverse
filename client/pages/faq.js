import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks/web3-react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import React from 'react'
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import Typewriter from 'typewriter-effect';

import WalletButton from '../components/Header/WalletButton';
import MintControl from '../components/MintControl';
import MintCounter from '../components/MintCounter';
import VideoBanner from '../components/VideoBanner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { GridCell, BodyText } from '../components'

export default function FAQ() {
  const { active } = useWeb3React();
  const router = useRouter();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);

  // const theme = useTheme();

  return (
    <>
      <Head>
        <title>Alunaverse - FAQ</title>
        <meta name="description" content="Alunaverse (ALNV) is a collection of limited edition utility & membership NFTs for the Aluna ecosystem and AlunaDAO." />
      </Head>
      <Container id='top-anchor' maxWidth={false} component="main" sx={{padding: { xs: 0 }}}>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Header/>
          <Container maxWidth='md' component='div' sx={{
            margin: '150px 0'
          }}>
            <Typography variant='h4' component='p' marginBottom='5rem' align='center'>FAQ</Typography>

            <BodyText variant='h6' component='p'>What is Alunaverse (ALNV)?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>A collection of limited edition utility & membership NFTs for the Aluna ecosystem and AlunaDAO.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>You can find ALNV via the secondary market on <Link href="https://opensea.io/collection/alunaverse" target="_blank" rel="noopener">OpenSea</Link> and <Link href="https://rarible.com/alunaverse">Rarible</Link>.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>What are the benefits of holding ALNV?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Holders of ALNV NFTs will enjoy special perks in the Aluna ecosystem, such as:</BodyText>
            <ul>
              <BodyText variant='body1' component='li' color='#9C9C9C'>Lifetime Aluna.Social subscription plan</BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'>Access to private chat rooms with other AlunaDAO members</BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'>Access to governance, voting and creating proposals</BodyText>
            </ul>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>What is "Cosmic Traveller"?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>"Cosmic Traveller" is the first token of a 4-part series in the Alunaverse NFT collection.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>What is the maximum supply of "Cosmic Traveller"?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>150 "Cosmic Traveller" NFTs.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>How do I get / mint "Cosmic Traveller"?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Your address must be whitelisted to mint for free (gas-only).</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Each whitelisted address can only mint 1 "Cosmic Traveller" NFT.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>After your address has been added to the whitelist, go to <Link href='/cosmic-traveller'>https://alunaverse.vercel.app/cosmic-traveller</Link> and connect your wallet to mint.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>When can I start minting?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Addresses whitelisted for Genesis Mint can start minting on 24th Dec 2021.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Addresses whitelisted for Public Mint can start minting on 7th Jan 2022.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>All whitelisted address can mint 1 Cosmic Traveller each, until all 150 have been minted.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>What is Genesis Mint and who is whitelisted?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>101 addresses of early adopters, active contributors and top traders were whitelisted for the Genesis Mint from a snapshot at 4PM UTC, 6th Dec 2021, and includes:</BodyText>
            <ul>
              <BodyText variant='body1' component='li' color='#9C9C9C'>OG Alunaut NFT holders</BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'>BitMEX Trading Competition Winners</BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'>“Trading Crypto to the Moon” series interviewees</BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'>{"Holders of >100,000 ALN"}</BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'>{"Liquidity providers of >$10,000 worth of LP tokens"}</BodyText>
            </ul>
            <BodyText variant='body1' component='p' color='#9C9C9C'>The full list of addresses can be found <Link href="https://pastebin.com/ycVL9YLa" target="_blank" rel="noopener">here</Link>.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>These addresses can already start minting Cosmic Traveller.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>How to join the whitelist for Public Mint?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Complete all the following steps to join the whitelist for Public Mint:</BodyText>
            <ol>
              <BodyText variant='body1' component='li' color='#9C9C9C'><Link href="https://aluna.social/signup" target="_blank" rel="noopener">Create an Aluna.Social account</Link></BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'><Link href="https://aluna.social/my/account/web3" target="_blank" rel="noopener">Connect your MetaMask wallet</Link></BodyText>
              <BodyText variant='body1' component='li' color='#9C9C9C'><Link href="https://aluna.social/my/account/api_keys" target="_blank" rel="noopener">Connect your Exchange API</Link></BodyText>
            </ol>
            <BodyText variant='body1' component='p' color='#9C9C9C'>You must have a minimum balance of $500 on your connected exchange account to qualify.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Snapshot will be taken on 6th January 2022.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Whitelisted addresses will be able to start minting at 2PM UTC, 7th January 2022.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>How do I know if I'm whitelisted?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Go to <Link href="/cosmic-traveller">Cosmic Traveller</Link> and connect your wallet.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>If your address is on the whitelist, you will see "Your wallet is whitelisted" and the "Mint" option will be available for you.</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>If your address is NOT whitelisted, you will see "Get whitelisted to mint this NFT".</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>I don't see the connect wallet button / I can't connect my wallet</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Make sure you are already logged in to MetaMask, and on Ethereum mainnet network. Refresh the browser and enlarge window. Use a desktop instead of mobile. If none of these works restart your browser and hit ctrl+shift+r to empty cache on website. Then log into MetaMask and try again.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>What happens to proceeds from (re)sales?</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>All proceeds & royalties are added to the <Link href="https://etherscan.io/address/0xFDfdc90bb26240aca0eE8829A607E2f89Fe428EB" target="_blank" rel="noopener">AlunaDAO Treasury</Link>, which is governed by ALN and ALNV holders.</BodyText>

            <BodyText variant='h6' component='p' sx={{marginTop: '2rem'}}>I need further help!</BodyText>
            <BodyText variant='body1' component='p' color='#9C9C9C'>Please reach out to us on the <Link href="https://discord.gg/cDDjCAtcxK" target="_blank" rel="noopener">Aluna discord</Link>.</BodyText>
          </Container>
        </Container>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, position: 'relative'}}>
          <VideoBanner imageUrl='/images/cosmic-traveller-banner.png' videoUrl='/videos/cosmic-traveller.m4v' clickHandler={() => router.push('/cosmic-traveller')}/>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', width: '100%', height: '100%', pointerEvents: 'none'}}>
            <Typography variant='h3' component='p' align='center' gutterBottom>Cosmic Traveller</Typography>
            <MintCounter tokenId={1} variant='body1' component='p' align='center'/>
            <Button variant='contained' sx={{fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: '300', px: '2rem', my: '2rem', width: '200px'}}>View NFT</Button>
          </Box>
        </Container>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, position: 'relative'}}>
          <VideoBanner imageUrl='/images/ethereal-banner.png' videoUrl='/videos/ethereal-ruins.m4v' clickHandler={() => router.push('/ethereal-ruins')}/>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', width: '100%', height: '100%', pointerEvents: 'none'}}>
            <Typography variant='h3' component='p' align='center' gutterBottom>Ethereal Ruins</Typography>
            <MintCounter tokenId={2} variant='body1' component='p' align='center'/>
            <Button variant='contained' sx={{fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: '300', px: '2rem', my: '2rem', width: '200px'}}>View NFT</Button>
          </Box>
        </Container>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, position: 'relative'}}>
          <VideoBanner imageUrl='/images/akashic-banner.png' videoUrl='/videos/akashic-keystone.m4v' clickHandler={() => router.push('/akashic-keystone')}/>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', width: '100%', height: '100%', pointerEvents: 'none'}}>
            <Typography variant='h3' component='p' align='center' gutterBottom>Akashic Keystone</Typography>
            <MintCounter tokenId={3} variant='body1' component='p' align='center'/>
            <Button variant='contained' sx={{fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: '300', px: '2rem', my: '2rem', width: '200px'}}>View NFT</Button>
          </Box>
        </Container>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, position: 'relative'}}>
          <VideoBanner imageUrl='/images/citadel-banner.png' videoUrl='/videos/citadel.m4v' clickHandler={() => router.push('/citadel-of-prosperity')}/>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', width: '100%', height: '100%', pointerEvents: 'none'}}>
            <Typography variant='h3' component='p' align='center' gutterBottom>Citadel of ProspΞrity</Typography>
            <MintCounter tokenId={4} variant='body1' component='p' align='center'/>
            <Button variant='contained' sx={{fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: '300', px: '2rem', my: '2rem', width: '200px'}}>View NFT</Button>
          </Box>
        </Container>
        <Container id='subscribe' maxWidth={false} component="div" sx={{padding: { xs: 0 }, backgroundColor: '#170E2C'}}>
          <Container maxWidth="sm" component="div" sx={{py: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant='h3' component='p' align='center' gutterBottom>More NFTs on the way.</Typography>
            <Typography variant='h6' component='p' align='center' gutterBottom>Subscribe to get notified about future NFT releases.</Typography>
            <Grid container spacing={1} sx={{my: '1rem'}}>
              <Grid item xs={7}>
                <TextField
                  variant="outlined"
                  color="primary"
                  placeholder="Your email"
                  sx={{width: '100%'}}
                />
              </Grid>
              <Grid item xs={5}>
                <Button variant='contained' sx={{fontSize: '1.5rem', textTransform: 'capitalize', fontWeight: '300', px: '2rem', width: '100%', height: '100%'}}>Subscribe</Button>
              </Grid>
            </Grid>
          </Container>
        </Container>
      </Container>
      <Footer/>
    </>
  )
}
