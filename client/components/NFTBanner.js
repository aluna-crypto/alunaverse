import { useRouter } from 'next/router'

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import VideoBanner from '../components/VideoBanner';
import MintCounter from '../components/MintCounter';


const NFTBanner = ({title, tokenId, imageUrl, videoUrl, href}) => {
  const router = useRouter();
  
    return (
      <Container maxWidth={false} component="div" sx={{padding: { xs: 0 }, position: 'relative'}}>
        <VideoBanner imageUrl={imageUrl} videoUrl={videoUrl} clickHandler={() => router.push(href)}/>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', width: '100%', height: '100%', pointerEvents: 'none'}}>
          <Typography variant='h3' component='p' align='center' gutterBottom>{title}</Typography>
          <MintCounter tokenId={tokenId} variant='body1' component='p' align='center'/>
          <Button variant='contained' sx={{fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: '300', px: '2rem', my: '2rem', width: '200px'}}>View NFT</Button>
        </Box>
      </Container>
    )
  }

  export default NFTBanner;