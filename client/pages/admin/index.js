import { useRouter } from 'next/router'

import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

export default function Admin() {
  const router = useRouter()

  return (
    <>
      <Container maxWidth={false} component="main" sx={{my: 5, display: 'flex', flexDirection: 'column'}}>
        <Link variant='h3' component='button' onClick={() => router.push('/admin/1')}>Token 1</Link>
        <Link variant='h3' component='button' onClick={() => router.push('/admin/2')}>Token 2</Link>
        <Link variant='h3' component='button' onClick={() => router.push('/admin/3')}>Token 3</Link>
      </Container>
    </>
  )
}
