import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
//import { ProductCreateForm } from '../../../components/dashboard/product/product-create-form';
import { gtm } from '../../../lib/gtm';
//import { CategoryCreateForm } from 'src/components/dashboard/categories/category-create-form';
import { PuestoCreateForm } from 'src/components/dashboard/mtoPuestos/puesto-create-form';

const PuestoCreate: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Dashboard: Crear Puesto | 
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
              Crear nuevo Puesto
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
          <PuestoCreateForm />
        </Container>
      </Box>
    </>
  );
};

PuestoCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default PuestoCreate;
