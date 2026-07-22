import type { FC } from 'react';
import NextLink from 'next/link';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
//import { useTheme } from '@mui/material/styles';
import { CheckCircleOutlined as CheckCircleOutlinedIcon } from '../../icons/check-circle-outlined';
import { Users as UsersIcon } from '../../icons/users';
import { Star as StarIcon } from '../../icons/star';
import { Template as TemplateIcon } from '../../icons/template';
import router from 'next/router';

export const HomeHero: FC = () => {
  //const theme = useTheme();
 

  router.push('/dashboard').catch(console.error);
 
  return (
    <Box
     
     
    >
      {/* <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          color="primary"
          variant="overline"
        >
          
        </Typography>
        <Typography
          align="center"
          variant="h1"
        >
          Amimed Salud v1.0 test...
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ py: 3 }}
        >
         
        </Typography>
        <Box
          sx={{
            alignItems: {
              sm: 'center',
              xs: 'flex-start'
            },
            display: 'flex',
            flexDirection: {
              sm: 'row',
              xs: 'column'
            },
            py: 3,
            m: -1,
            '& > *': {
              m: 1
            }
          }}
        >
          
        
         
          <NextLink
            href="/dashboard"
            passHref
          >
            <Button
              component="a"
              size="large"
              variant="contained"
            >
              Ingresar al portal proveedores
            </Button>
          </NextLink>
        </Box>
      </Container> */}
      </Box>

        );
}


