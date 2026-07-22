import { useEffect, useCallback, useState } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ArticulosEditForm } from '../../../components/dashboard/product-new/product-new-edit-form';
import { gtm } from '../../../lib/gtm';
import { useRouter } from 'next/router';
import { productApi } from '../../../__fake-api__/product-api';
import { useMounted } from '../../../hooks/use-mounted';
import { Articulo } from 'src/types/product-new';




const ArticuloEdit: NextPage = () => {
  const router = useRouter();
  const { articuloId } = router.query;
  const isMounted = useMounted();
  console.log(router.query)
  console.log(articuloId)
  const [articulo ,setarticulo] =  useState<Articulo | null>(null);

  alert(articuloId)

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getArticulo = useCallback(async () => {
    try {
      console.log('articulo en getarticulo...',articuloId)
      const data = await productApi.getArticulo(Number(articuloId));     // PONER EL PARAMETRO AQUI!              <------------------------------------
      
      
        console.log('data = ',data)
      if (isMounted()) {
        setarticulo(data);
        console.log('Descripcion',articulo?.DescripcionProducto)
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getArticulo();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!articulo) {
    return null
   
    
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Editar Articulo | Portal Gessa
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
              Editar Articulo Proveedor
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
                href="/dashboard"
                passHref
              >
                <Link
                  color="primary"
                  variant="subtitle2"
                >
                  Productos-new
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Edicion Productos No Alineados
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box mt={3}>
          <ArticulosEditForm 
          
            xarticulo={articulo} />
           </Box>             
        </Container>
      </Box>
    </>
  );
};

ArticuloEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ArticuloEdit;
