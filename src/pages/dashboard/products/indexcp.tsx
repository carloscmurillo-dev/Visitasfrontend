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
import { ProductListTable } from '../../../components/dashboard/product/product-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Upload as UploadIcon } from '../../../icons/upload';
import { Plus as PlusIcon } from '../../../icons/plus';
import { gtm } from '../../../lib/gtm';
import type { Item } from '../../../types/product';
import { Category } from 'src/types/APIcategory';
import { Po } from 'src/types/pos';
import { TiposRegistro } from 'src/types/APITiposRegistro';
import { useAuth } from '../../../hooks/use-auth';
import { toast } from 'react-hot-toast';

const applyFilters = (
  products: Item[],
  filters: Filters
): Item[] =>  products.filter((product) => {
  if (filters.name) {
    const nameMatched = product.descriptionShort.toLowerCase().includes(filters.name.toLowerCase());

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
  products: Item[],
  page: number,
  rowsPerPage: number
): Item[] => products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ProductList: NextPage = () => {
  const isMounted = useMounted();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [tiposregistro,setTiposregistro]= useState<TiposRegistro[]>([]);
  const [pos, setPos] = useState<Po[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { user } = useAuth(); 
  const [filters, setFilters] = useState<Filters>({
    name: undefined,
    category: [],
    status: [],
    inStock: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  const getPOS = useCallback(async () => {
    const response = await productApi.getPOS();
    if (isMounted()) {
      setPos(response);
    }
  }, [isMounted]);
  const getCategories = useCallback(async () => {
    try {
      console.log('VOY POR CATEGOS')
      const data = await productApi.getCateXProveedor(user.gln);
      //const data = await productApi.getCategories();
      if (isMounted()) {
        setCategories(data);
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const getProductsCambPrecio = useCallback(async () => {
    try {

      const id = toast.loading('Cargando Productos para cambio de precios...')


      console.log('VOY POR CAMBIOS PRECIOS')
      const data = await productApi.getProductsCambPrecio(user.gln);
      console.log('Datos de items',data)


      toast.dismiss(id)

      if (data.length === 0) {
        toast.error('No existen productos para cambio de precios asociados!')
      }
      if (isMounted()) {
        setProducts(data);
        if (data.length > 0) {
          toast.success('Productos cambio de precios Cargados!')
        }
       
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  async function fetchTipoRegistro() {
    const data = await productApi.GetTipoRegistros();
    setTiposregistro(data);
  }

  useEffect(
    () => {
      getCategories();
      getPOS();
      getProductsCambPrecio();
      fetchTipoRegistro();
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
  const filteredProducts = applyFilters(products, filters);
  const paginatedProducts = applyPagination(filteredProducts, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Cambio de Precios | GESSA
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
                  Cambio Precios
                </Typography>
              </Grid>
              {/* <Grid item>
                <NextLink
                  href="/dashboard/products/new"
                  passHref
                >
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    
                  </Button>
                </NextLink>
              </Grid> */}
            </Grid>
            {/* <Box
              sx={{
                m: -1,
                mt: 3
              }}
            >
              <Button
                startIcon={<UploadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                
              </Button>
              <Button
                startIcon={<DownloadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                
              </Button>
            </Box> */}
          </Box>
          <Card>
            <ProjectListFilters onChange={handleFiltersChange} />
            <ProductListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              categories={categories}
             
              products={paginatedProducts}
              pos={pos}
              tiposregistro = {tiposregistro}
              productsCount={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              cambioPrecios={true}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProductList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProductList;
