import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';

import { gtm } from '../../../../lib/gtm';
import { AsuntoEditForm } from 'src/components/dashboard/mtoAsuntos/asunto-edit-form';
import { useRouter } from 'next/router';
import { useMounted } from '../../../../hooks/use-mounted';
import { tablasApi } from 'src/__fake-api__/TablasReferencia-api';
import { AsuntosMsg } from 'src/types/APITablasReferencia';


const UsuarioEdit: NextPage = () => {
  const router = useRouter();
  const {asunto_id} = router.query;
 
  //alert(UserId)
  const isMounted = useMounted();
  const [asuntoload, setAsuntoload] = useState<AsuntosMsg | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getAsuntos = useCallback(async () => {
    try {
      
      const data = await tablasApi.GetAsunto(Number(asunto_id));     // PONER EL PARAMETRO AQUI!              <------------------------------------
       
        //console.log('data --------------->>>>>',data)
       
        setAsuntoload(data);
        
        
        if (isMounted()) {
          setAsuntoload(data);
       
      }
    } catch (err) {
      console.error('EL ERROR ES:',err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getAsuntos();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  

  if (!asuntoload) {
    return null
  }

  return (
    <>
      <Head>
        <title>
          Edit Asunto | Cia
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
              Editar Asunto 
            </Typography>
            <Breadcrumbs
              separator="/"
              sx={{ mt: 1 }}
            >
              <NextLink
                href="/dashboard"
                passHref
              >
                <Link variant="subtitle2">
                  Dashboard
                </Link>
              </NextLink>
              <NextLink
                href="/dashboard/asuntos"
                passHref
              >
                <Link
                  color="primary"
                  variant="subtitle2"
                >
                  Asuntos
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Usuario
              </Typography>
            </Breadcrumbs>
          </Box>
          <AsuntoEditForm 
           
           
           asunto={asuntoload!}
          
          />
        </Container>
      </Box>
    </>
  );
};

UsuarioEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default UsuarioEdit;
