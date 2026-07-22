import { useState, useEffect, useCallback, MouseEvent, ChangeEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Card, Container, Grid, Typography } from '@mui/material';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProjectListFilters } from '../../../components/dashboard/product-new/product-new-list-filters';
import type { Filters } from '../../../components/dashboard/product-new/product-new-list-filters';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Upload as UploadIcon } from '../../../icons/upload';
import { Plus as PlusIcon } from '../../../icons/plus';
import { gtm } from '../../../lib/gtm';

import { Category } from 'src/types/APIcategory';
import { useAuth } from 'src/hooks/use-auth';
import type {Articulo,ProductNew} from '../../../types/product-new';
import { ProductListChgTable } from '../../../components/dashboard/product-new/product-new-list-chg-table';
import { Po } from 'src/types/pos';

const applyFilters = (
  productosNew: Articulo[],
  filters: Filters
): Articulo[] => productosNew.filter((productoNuevo) => {
  if (filters.name) {
    const nameMatched = productoNuevo.DescripcionProducto.toLowerCase().includes(filters.name.toLowerCase());

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
  products: Articulo[],
  page: number,
  rowsPerPage: number
): Articulo[] => products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ProductListNew: NextPage = () => {
  const isMounted = useMounted();
  const isMountedAr = useMounted();

  const { user } = useAuth();

  console.log('Usuario en tabla chg',user)
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsNew, setProductsNew] = useState<Articulo[]>([]);
  //const [pos, setPos] = useState<Po[]>([]);
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
  //const getPOS = useCallback(async () => {
   // const response = await productApi.getPOS();
   // if (isMounted()) {
   //   setPos(response);
   // }
  //}, [isMounted]);
  const getCategories = useCallback(async () => {
    try {
      const data = await productApi.getCategories();
      if (isMounted()) {
        setCategories(data);
        console.log('Datos categorias',data)
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const getArticulos = useCallback(async () => {
    try {
      console.log('en la funcion')
      const data = await productApi.getArticulosChg();
      console.log('datos',data);
      if (isMounted()) {
        setProductsNew(data);
        
      }
    } catch (err) {
      console.log('me dio error')
      console.error('EL ERROR ES:',err);
    }
  }, [isMounted]);

  useEffect(
    () => {

      console.log('Entre al useEffect')
      getArticulos();
      getCategories();
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
  const filteredProductsNew = applyFilters(productsNew, filters);
  const paginatedProductsNew = applyPagination(filteredProductsNew, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Productos  | GESSA
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
                  Cambio Precios Articulos 
                </Typography>
              </Grid>
             
            </Grid>
            <Box
              sx={{
                m: -1,
                mt: 3
              }}
            >
           
            </Box>
          </Box>
          <Card>
            <ProjectListFilters onChange={handleFiltersChange} />
            <ProductListChgTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              categories={categories}
              articulos={paginatedProductsNew}
              //pos={pos}
              ArticulosCount={filteredProductsNew.length}
              rowsPerPage={rowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProductListNew.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProductListNew;
