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

import {tablasApi} from '../../../__fake-api__/TablasReferencia-api'
import {AsuntosMsg} from 'src/types/APITablasReferencia'
import { AsuntoListTable } from 'src/components/dashboard/mtoAsuntos/asunto-list-table';

const applyFilters = (
  asuntos: AsuntosMsg[],
  filters: Filters
): AsuntosMsg[] => asuntos.filter((asuntos) => {
  if (filters.name) {
    const nameMatched = asuntos.asunto_dsc?.toLowerCase().includes(filters.name.toLowerCase());

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
  asuntos: AsuntosMsg[],
  page: number,
  rowsPerPage: number
): AsuntosMsg[] => asuntos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const AsuntosList: NextPage = () => {
  const isMounted = useMounted();
  const [asuntoList, setAsuntosList] = useState<AsuntosMsg[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    name: undefined,
    category: [],
    status: [],
    inStock: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getReportes = useCallback(async () => {
    try {
      console.log('ENTRE AL GETREPORTES')
      const data = await tablasApi.getAsuntos();
      console.log('CARGA DE DATA>>>>>>>>>>>>>>>>>>>>>>>',data)
      if (isMounted()) {
        setAsuntosList(data);
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);


  useEffect(
    () => {
      getReportes();
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
  const filteredUsers = applyFilters(asuntoList, filters);
  const paginatedUsers = applyPagination(filteredUsers, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Asuntos | cia
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
                  Asuntos
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href="/dashboard/asuntos/new"
                  passHref
                >
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Agregar
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
            <Box
              sx={{
                m: -1,
                mt: 3
              }}
            >
              <Button
                startIcon={<UploadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Importar
              </Button>
              <Button
                startIcon={<DownloadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Exportar
              </Button>
            </Box>
          </Box>
          <Card>
            <ProjectListFilters onChange={handleFiltersChange} />
            <AsuntoListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              asuntos={paginatedUsers}
              usersCount={filteredUsers.length}
              rowsPerPage={rowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

AsuntosList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default AsuntosList;
