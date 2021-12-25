import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks/web3-react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import React from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Typewriter from 'typewriter-effect';

import NFTBanner from '../components/NFTBanner';
import SubscribeBanner from '../components/SubscribeBanner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const headerLinks = [
  { name: "Read the FAQ", href: "/faq"},
]

export default function Home() {
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
        <title>Alunaverse - Utility & Membership NFTs for the AlunaDAO</title>
        <meta name="description" content="Alunaverse (ALNV) is a collection of limited edition utility & membership NFTs for the Aluna ecosystem and AlunaDAO." />
      </Head>
      <Container id='top-anchor' maxWidth={false} component="main" sx={{padding: { xs: 0 }}}>
        <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Header links={headerLinks}/>
          <Container maxWidth='md' component='div' sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Typography variant='h6' component='p' gutterBottom color='#9C9C9C'>ALUNA BEACON</Typography>
            <Typography variant='h5' component='p' align='center'>An unexpected, lost beacon message was picked up echoing throughout space-time:</Typography>
            <Box sx={{py: '4rem', width: '100%', fontSize: '3rem', display: 'flex', textAlign: 'center', justifyContent: 'center'}}>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                  .typeString('To whoever receives this message...')
                  .pauseFor(1000)
                  .deleteAll(1)
                  .typeString('...we invite you to track this signal to its source.')
                  .pauseFor(1000)
                  .deleteAll(1)
                  .typeString('The hidden contents embedded in this signal...')
                  .pauseFor(1000)
                  .deleteAll(1)
                  .typeString('...will help you in your exploration as an individual and collective.')
                  .pauseFor(1000)
                  .deleteAll(1)
                  .typeString('See you on the other side.')
                  .start();
                }}
              />
            </Box>
          </Container>
          </Container>
          <NFTBanner title="Cosmic Traveller" tokenId={1} href="/cosmic-traveller" imageUrl='/images/cosmic-traveller-banner.png' videoUrl='/videos/cosmic-traveller.m4v'/>
          <NFTBanner title="Ethereal Ruins" tokenId={2} href="/ethereal-ruins" imageUrl='/images/ethereal-banner.png' videoUrl='/videos/ethereal-ruins.m4v'/>
          <NFTBanner title="Akashic Keystone" tokenId={3} href="/akashic-keystone" imageUrl='/images/akashic-banner.png' videoUrl='/videos/akashic-keystone.m4v'/>
          <NFTBanner title="Citadel of ProspΞrity" tokenId={4} href="/citadel-of-prosperity" imageUrl='/images/citadel-banner.png' videoUrl='/videos/citadel.m4v'/>
          <SubscribeBanner/>
      </Container>
      <Footer/>
    </>
  )
}
