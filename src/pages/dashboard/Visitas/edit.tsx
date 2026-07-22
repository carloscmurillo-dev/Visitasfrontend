import { useState, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProveedorEditForm } from '../../../components/dashboard/Proveedor/proveedor-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
// import type { Proveedorsol } from '../../../types/APIproveedores';

import { VisitasHospital as Proveedorsol  } from 'src/types/APIAmiInterfaces';

import { getInitials } from '../../../utils/get-initials';
import { useRouter } from 'next/router';

const ProveedorEdit: NextPage = () => {
 
  const router = useRouter();
  const {proveedorid} = router.query;
   //alert(proveedor_id)
  const isMounted = useMounted();
  const [proveedorsol, setProveedorsol] = useState<Proveedorsol | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProveedorsol = useCallback(async () => {
    try {

      

      const data = await productApi.getVisitaTerapeuta(proveedorid?.toString() ?? '');     // PONER EL PARAMETRO AQUI!              <------------------------------------
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
     return null
    
     
   }

  return (
    <>
      <Head>
        <title>
          Dashboard: Proveedor Edit | Amimed Salud
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
              {getInitials(proveedorsol?.Id)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {proveedorsol?.FechaVisita}
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
                  label={proveedorsol?.Id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProveedorEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProveedorEdit;
