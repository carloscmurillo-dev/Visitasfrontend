import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ArticulosCreateForm } from '../../../components/dashboard/product-new/product-new-create-form';
import { gtm } from '../../../lib/gtm';
import { CategoryCreateForm } from 'src/components/dashboard/categories/category-create-form';


const ArticuloCreate: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Dashboard: Crear Articulo | Portal Gessa
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
              Crear Articulo 
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
                href="/dashboard/products-new"
                passHref
              >
                <Link
                  color="primary"
                  variant="subtitle2"
                >
                  Tabla de productos
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Productos 
              </Typography>
            </Breadcrumbs>
          </Box>
          <ArticulosCreateForm />
        </Container>
      </Box>
    </>
  );
};

ArticuloCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ArticuloCreate;
