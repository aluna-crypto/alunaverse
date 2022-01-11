import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks/web3-react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import React from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

import Typewriter from 'typewriter-effect';

import MintControl from '../components/MintControl';
import MintCounter from '../components/MintCounter';
import NFTBanner from '../components/NFTBanner';
import SubscribeBanner from '../components/SubscribeBanner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { GridCell, BodyText } from '../components'

const headerLinks = [
  { name: "Read the FAQ", href: "/faq"},
]

export default function AkashicKeystone() {
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
        <title>Alunaverse - Akashic Keystone</title>
        <meta name="description" content="Alunaverse (ALNV) is a collection of limited edition utility & membership NFTs for the Aluna ecosystem and AlunaDAO." />
      </Head>
      <Container id='top-anchor' maxWidth={false} component="main" sx={{padding: { xs: 0 }}}>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Header links={headerLinks}/>
          <Container maxWidth='md' component='div' sx={{
            marginTop: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Typography variant='h3' component='p' align='center' gutterBottom>Akashic Keystone</Typography>
            <MintCounter tokenId={3} variant='body1' component='p' align='center'/>
            <video
              style={{
                width: '100%',
                margin: '4rem 0',
                objectFit: 'cover',
                display: 'block',
              }}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/akashic-keystone.m4v" type="video/mp4"/>
            </video>
            <Container maxWidth='sm' component='div' sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Typography variant='h6' component='p' align='center' sx={{fontSize: '20px', lineHeight: '30px', margin: '1rem 0'}}>A mysterious relic discovered within the Ethereal Ruins. Uncovering the object proved to be a challenging test of wit, patience and presence for the Alunaut.</Typography>
              <Typography variant='h6' component='p' align='center' sx={{fontSize: '20px', lineHeight: '30px', margin: '1rem 0'}}>The object is covered in engravings from an unknown language, remnants of a not yet documented civilisation. The keystone emanates a constant humming sound, hovers and seems to return to a steady clockwise rotation.</Typography>
              <Typography variant='h6' component='p' align='center' sx={{fontSize: '20px', lineHeight: '30px', margin: '1rem 0'}}>Being in its presence facilitates a state of mental clarity and physical rejuvination, particularly when focusing one’s mind to it.</Typography>
              <Typography variant='h6' component='p' align='center' sx={{fontSize: '20px', lineHeight: '30px', margin: '1rem 0'}}>This NFT grants holders extra perks on the Aluna.Social platform and AlunaDAO.</Typography>
              <Typography variant='h6' component='p' align='center' sx={{fontSize: '20px', lineHeight: '30px', margin: '1rem 0'}}>Aluna commissioned 3D Artists <Link href="https://www.behance.net/tth_cmn" target="_blank" rel="noopener">Cosmin Toth</Link> and <Link href="https://diorn.tv/" target="_blank" rel="noopener">Dorin Croitoru</Link> to create this animation which was further soundtracked by Aluna HQ.</Typography>
            </Container>
            <Container maxWidth='md' component='div' sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MintControl tokenId={3} style={{margin: '3rem 0'}}/>
            </Container>
          </Container>
        </Container>
        <Typography variant='h4' component='p' align='center' marginBottom='3rem'>More NFTs:</Typography>
        <NFTBanner title="Cosmic Traveller" tokenId={1} href="/cosmic-traveller" imageUrl='/images/cosmic-traveller-banner.png' videoUrl='/videos/cosmic-traveller.m4v'/>
        <NFTBanner title="Ethereal Ruins" tokenId={2} href="/ethereal-ruins" imageUrl='/images/ethereal-banner.png' videoUrl='/videos/ethereal-ruins.m4v'/>
        <NFTBanner title="Citadel of ProspΞrity" tokenId={4} href="/citadel-of-prosperity" imageUrl='/images/citadel-banner.png' videoUrl='/videos/citadel.m4v'/>
        <SubscribeBanner/>
      </Container>
      <Footer/>
    </>
  )
}
