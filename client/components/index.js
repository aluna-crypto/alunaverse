import { styled } from '@mui/material/styles';
import { 
    Grid,
    Typography,
} from '@mui/material';

export const GridCell = styled(Grid)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const BodyText = styled(Typography)(({theme}) => ({
    margin: theme.spacing(2, 0)
}));
