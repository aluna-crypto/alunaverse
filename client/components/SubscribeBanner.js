import { useState } from 'react'

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const SubscribeBanner = ({title, tokenId, imageUrl, videoUrl, href}) => {
    const [emailAddress, setEmailAddress] = useState("");
    const [validationError, setValidationError] = useState(false);
    const [validationText, setValidationText] = useState("");
    
    const handleSubscribe = () => {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress))
      {
        setValidationError(false)
        setValidationText("")
      } else {
        setValidationError(true)
        setValidationText("Invalid email address")
        return;
      }

      //TODO
      console.log(`Subscribing ${emailAddress}`)

    }
  
    return (
      <Container id='subscribe' maxWidth={false} component="div" sx={{padding: { xs: 0 }, backgroundColor: '#170E2C'}}>
        <Container maxWidth="sm" component="div" sx={{py: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant='h3' component='p' align='center' gutterBottom>More NFTs on the way.</Typography>
          <Typography variant='h6' component='p' align='center' gutterBottom>Subscribe to get notified about future NFT releases.</Typography>
          <Grid container spacing={1} sx={{my: '1rem'}}>
            <Grid item xs={7}>
              <TextField
                variant="outlined"
                color="primary"
                error={validationError}
                helperText={validationText}
                placeholder="Your email"
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
                sx={{width: '100%'}}
              />
            </Grid>
            <Grid item xs={5}>
              <Button 
                variant='contained'
                onClick={handleSubscribe}
                sx={{
                  fontSize: '1.5rem', 
                  textTransform: 'capitalize', 
                  fontWeight: '300', 
                  px: '2rem', 
                  width: '100%', 
                  }}
                >
                  Subscribe
                </Button>
            </Grid>
          </Grid>
        </Container>
      </Container>
    )
  }

  export default SubscribeBanner;