import { useState, useEffect, useCallback, MouseEvent, ChangeEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Card, Container, Grid, Typography } from '@mui/material';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProjectListFilters } from '../../../components/dashboard/product/product-list-filters';
import type { Filters } from '../../../components/dashboard/product/product-list-filters';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Upload as UploadIcon } from '../../../icons/upload';
import { Plus as PlusIcon } from '../../../icons/plus';
import { gtm } from '../../../lib/gtm';
import type { Item, Product } from '../../../types/product';
import { Category } from 'src/types/APIcategory';
import { useAuth } from 'src/hooks/use-auth';
import { authApi } from 'src/__fake-api__/auth-api';
import { APIUser } from 'src/types/APIUser';
import { UserListTable } from 'src/components/dashboard/users/user-list-table';

const applyFilters = (
  users: APIUser[],
  filters: Filters
): APIUser[] => users.filter((user) => {
  if (filters.name) {
    const nameMatched = user.Name.toLowerCase().includes(filters.name.toLowerCase());

    if (!nameMatched) {
      return false;
    }
  }

  // It is possible to select multiple category options
  if (filters.category?.length > 0) {
    return false;
  }

  // It is possible to select multiple status options
  if (filters.status?.length > 0) {

    return false;

  }

  // Present only if filter required
  if (typeof filters.inStock !== 'undefined') {

    return false;

  }

  return true;
});

const applyPagination = (
  users: APIUser[],
  page: number,
  rowsPerPage: number
): APIUser[] => users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const UserList: NextPage = () => {
  const isMounted = useMounted();
  const [userList, setUserList] = useState<APIUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    name: undefined,
    category: [],
    status: [],
    inStock: undefined
  });


  // test
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  
  const getUsers = useCallback(async () => {
    try {
      const data = await authApi.getUsers();
      if (isMounted()) {
        console.warn('xxxx', data)
        setUserList(data);
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);


  useEffect(
    () => {
      getUsers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFiltersChange = (filters: Filters): void => {
    setFilters(filters);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredUsers = applyFilters(userList, filters);
  const paginatedUsers = applyPagination(filteredUsers, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Usuarios | Conexión Gessa
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Usuarios 
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href="/dashboard/users/new"
                  passHref
                >
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Agregar Usuario
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
         
          </Box>
          <Card>
            <ProjectListFilters onChange={handleFiltersChange} />
            <UserListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              users={paginatedUsers}
              usersCount={filteredUsers.length}
              rowsPerPage={rowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

UserList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default UserList;
