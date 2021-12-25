import { useRouter } from 'next/router'

import Container from '@mui/material/Container';

import Header from '../../components/Header/Header';
import AlunaverseAdminPanel from '../../components/Admin/AlunaverseAdmin';

const headerLinks = [
  {name: "Home", href: "/"}
]

export default function AdminPage() {
  const router = useRouter()
  const { tokenId } = router.query

  return (
    <>
      <Header links={headerLinks}/>
      <Container maxWidth={false} component="main" sx={{my: 5}}>
        <AlunaverseAdminPanel tokenId={tokenId}/>
      </Container>
    </>
  )
}
