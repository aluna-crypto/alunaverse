import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ContractProvider } from '../contexts/contractProvider';
import { SnackbarProvider } from 'notistack';
import { ethers } from 'ethers';

import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../themes/theme';
import getLibrary from '../utils/getLibrary'

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Alunaverse</title>
        <meta property="og:title" content="Alunaverse - Utility & Membership NFTs for the AlunaDAO" />
        <meta property="og:url" content="http://alunaverse.aluna.social/" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Alunaverse (ALNV) is a collection of limited edition utility & membership NFTs for the Aluna ecosystem and AlunaDAO." />
        <meta property="og:image" content="/images/aluna-logo-image.png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <ContractProvider>
              <Component {...pageProps} />
            </ContractProvider>
          </Web3ReactProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
