import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';

import { gtm } from '../../../../lib/gtm';
//import { AsuntoEditForm } from 'src/components/dashboard/mtoAsuntos/asunto-edit-form';
import { useRouter } from 'next/router';
import { useMounted } from '../../../../hooks/use-mounted';
import { tablasApi } from 'src/__fake-api__/TablasReferencia-api';
import { Puestos } from 'src/types/APITablasReferencia';
import { PuestoEditForm } from 'src/components/dashboard/mtoPuestos/puesto-edit-form';


const PuestoEdit: NextPage = () => {
  const router = useRouter();
  const {IdPuesto} = router.query;
 
  //alert(UserId)
  const isMounted = useMounted();
  const [puestoload, setPuestoload] = useState<Puestos | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' })
  }, []);


  

  const getPuestos = useCallback(async () => {
    try {
      //alert('INGRESE AL MODULO2')
      const data = await tablasApi.GetPuesto(Number(IdPuesto));     // PONER EL PARAMETRO AQUI!              <------------------------------------
       
        console.log('data --------------->>>>>',data)
       
        setPuestoload(data);
        
        
        if (isMounted()) {
          setPuestoload(data);
       
      }
    } catch (err) {
      console.error('EL ERROR ES:',err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getPuestos();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  

  if (!puestoload) {
    return null
  }

  return (
    <>
      <Head>
        <title>
          Edit Puesto | Cia
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
              Editar Puesto 
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
                href="/dashboard/puestos"
                passHref
              >
                <Link
                  color="primary"
                  variant="subtitle2"
                >
                  Puestos
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Puesto
              </Typography>
            </Breadcrumbs>
          </Box>
          <PuestoEditForm 
           
           
           puesto={puestoload!}
          
          />
        </Container>
      </Box>
    </>
  );
};

PuestoEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default PuestoEdit;
