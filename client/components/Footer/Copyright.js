import {
  Link,
  Typography,
} from '@mui/material';

export default function Copyright() {

  return (
    <Typography variant="body2" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://DOMAIN.com/">
        Alunaverse
      </Link>{' '}
      {new Date().getFullYear()}
      {'. '}
    </Typography>
  );
}