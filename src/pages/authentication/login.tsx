import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Grid, Link, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { JWTLogin } from '../../components/authentication/jwt-login';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';

type Platform = 'Amplify' | 'Auth0' | 'Firebase' | 'JWT';

const platformIcons: { [key in Platform]: string; } = {
  Amplify: '/static/icons/amplify.svg',
  Auth0: '/static/icons/auth0.svg',
  Firebase: '/static/icons/firebase.svg',
  JWT: '/static/icons/jwt.svg'
};

const Login: NextPage = () => {
  const router = useRouter();
  const { platform }: { platform: Platform } = useAuth();
  const { disableGuard } = router.query;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const BackgroundHead = {
    backgroundImage: 'url(/static/Fondo_Super_Color.jpg)',  height: 800,  backgroundSize: 'cover', width: `calc(100vw + 48px)`,
    }
  return (
    <>
      <Head>
        <title>
          Login | Amimed Salud
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <div>
        <img style={{height: 600, width: `calc(100vw + 48px)` }} src='/static/fondo_Super_Color.jpg'/>
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px', marginTop: -320

            }
          }}
        >
          
            <Box
              sx={{
                alignItems: 'center', alignSelf: 'center', alignContent: 'center',
                display: 'flex',
                '& img': {
                  height: 120,
                  m: 10
                }
              }}
            >
            
            </Box>
          <Card
            elevation={16}
            sx={{ p: 4, backgroundColor: 'white' }}
          >

            <Box
              sx={{
                flexGrow: 1,
                mt: 26
              }}
            >
              {platform === 'JWT' && <JWTLogin />}
            </Box>
            <Divider sx={{ my: 3 }} />


          </Card>
        </Container>
        </div>
      </Box>
    </>
  );
};

Login.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Login;
