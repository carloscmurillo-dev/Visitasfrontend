import { useState, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProveedorCrearForm } from '../../../components/dashboard/Proveedor/proveedor-crear-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import type { Proveedorsol } from '../../../types/APIproveedores';
import { getInitials } from '../../../utils/get-initials';
import { useRouter } from 'next/router';

const ProveedorEdit: NextPage = () => {
  const router = useRouter();
  const {proveedorid} = router.query;
 
  const isMounted = useMounted();
  //const [proveedorsol, setProveedorsol] = useState<Proveedorsol[]>([]);
  const [proveedorsol, setProveedorsol] = useState<Proveedorsol | null>(null);
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProveedorsol = useCallback(async () => {
    try {
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
  );

  if (!proveedorsol) {
     //return null;
   
     
     
   }

  return (
    <>
      <Head>
        <title>
          Dashboard: Proveedor Edit | Conexion Gessa
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
              href="/dashboard/proveedores"
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
                  Solicitud Nuevo Proveedor
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
              {getInitials('Nuevo Proveedor')}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {'Nuevo Proveedor'}
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
                  user_id:
                </Typography>
                <Chip
                  label={'ID'}
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

// ProveedorEdit.getLayout = (page) => (
//   <AuthGuard>
//     <DashboardLayout>
//       {page}
//     </DashboardLayout>
//   </AuthGuard>
// );

export default ProveedorEdit;
