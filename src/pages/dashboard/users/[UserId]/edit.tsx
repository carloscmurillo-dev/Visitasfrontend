import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { ProductCreateForm } from '../../../../components/dashboard/product/product-create-form';
import { gtm } from '../../../../lib/gtm';
import { UserEditForm } from 'src/components/dashboard/users/user-edit-form';
import { useRouter } from 'next/router';
import { useMounted } from '../../../../hooks/use-mounted';
import { authApi } from 'src/__fake-api__/auth-api';
import { APIUser } from 'src/types/APIUser';


const UsuarioEdit: NextPage = () => {
  const router = useRouter();
  const {UserId} = router.query;
 
  //alert(UserId)
  const isMounted = useMounted();
  const [usuarioload, setUsuarioload] = useState<APIUser | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getUsuario = useCallback(async () => {
    try {
      //alert('si entre...')
      const data = await authApi.GetUser(Number(UserId));     // PONER EL PARAMETRO AQUI!              <------------------------------------
       
        console.log('data --------------->>>>>',data)
       
        setUsuarioload(data);
        
        
        if (isMounted()) {
        setUsuarioload(data);
       
      }
    } catch (err) {
      console.error('EL ERROR ES:',err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getUsuario();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  

  if (!usuarioload) {
    return null
  }

  return (
    <>
      <Head>
        <title>
          Edit usuario | Amimed Salud
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
              Editar Usuario 
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
                  Usuarios
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
          <UserEditForm 
           
           
           usuario={usuarioload!}
          
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
