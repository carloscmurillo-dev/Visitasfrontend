import { useState, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProveedorCrearForm } from '../../../components/dashboard/Visita/visita-crear-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import type { Proveedorsol } from '../../../types/APIproveedores';
import { getInitials } from '../../../utils/get-initials';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';

const CrearVisita: NextPage = () => {
  const router = useRouter();
  const {proveedorid} = router.query;
 
  const isMounted = useMounted();
  //const [proveedorsol, setProveedorsol] = useState<Proveedorsol[]>([]);
  const [proveedorsol, setProveedorsol] = useState<Proveedorsol | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

 /*  const getProveedorsol = useCallback(async () => {
    try {
      alert('entrando a crear ')
      const data = await productApi.getProveedorsol(0);     // PONER EL PARAMETRO AQUI!              <------------------------------------
       // alert('leyendo proveedor')
        console.log(data)
      if (isMounted()) {
        setProveedorsol(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getProveedorsol();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  ); */

  if (!proveedorsol) {
     //return null;
   
     
     
   }

  return (
    <>
      <Head>
        <title>
          Dashboard: Crear Visita | Amimed Salud
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <NextLink
              href="/dashboard/Visitas"
              passHref
            >
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle2">
                  Nueva Visita
                </Typography>
              </Link>
            </NextLink>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <Avatar
              src={''} //customer.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials('Nueva Visita')}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {'Nueva Visita'}
              </Typography>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography variant="subtitle2">
                  Terapeuta: {user.name}
                </Typography>
                <Chip
                  label={user.gln}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ProveedorCrearForm 
          
             />
          </Box>
        </Container>
      </Box>
    </>
  );
};



export default CrearVisita;
