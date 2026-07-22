import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { ProductCreateForm } from '../../../../components/dashboard/product/product-create-form';
import { gtm } from '../../../../lib/gtm';
import { SubCategoryCreateForm } from 'src/components/dashboard/subcategories/subcategory-create-form';
import { useRouter } from 'next/router';

const ProductCreate: NextPage = () => {
    const router = useRouter();
    const { categoryId } = router.query;
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Nueva subcategoria | GESSA
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
              Crear nueva subcategoria
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
                  Categorias
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Subcategorias
              </Typography>
            </Breadcrumbs>
          </Box>
          <SubCategoryCreateForm categoryId={Number(categoryId)} />
        </Container>
      </Box>
    </>
  );
};

ProductCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProductCreate;
