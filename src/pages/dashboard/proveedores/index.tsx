import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProveedorListTable } from '../../../components/dashboard/Proveedor/proveedor-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { Upload as UploadIcon } from '../../../icons/upload';
import { gtm } from '../../../lib/gtm';
import type { Proveedorsol } from '../../../types/APIproveedores';

interface Filters {
  query?: string;
  hasAcceptedMarketing?: boolean;
  isProspect?: boolean;
  isReturning?: boolean;
}

type SortField = 'updatedAt' | 'totalOrders';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'proveedor_dsc|asc'
  | 'proveedor_dsc|desc'
  | 'CedJuridica|asc'
  | 'CedJuridica|desc';

interface SortOption {
  label: string;
  value: Sort;
}

type TabValue = 'all' | 'hasAcceptedMarketing' | 'isProspect' | 'isReturning';

interface Tab {
  label: string;
  value: TabValue;
}

// const tabs: Tab[] = [
//   {
//     label: 'Todos',
//     value: 'all'
//   },
//   {
//     label: 'Accepts Marketing',
//     value: 'hasAcceptedMarketing'
//   },
//   {
//     label: 'Prospect',
//     value: 'isProspect'
//   },
//   {
//     label: 'Returning',
//     value: 'isReturning'
//   }
// ];

const sortOptions: SortOption[] = [
  {
    label: 'Proveedor asc',
    value: 'proveedor_dsc|asc'
    
  },
  {
    label: 'Proveedor desc',
    value: 'proveedor_dsc|asc'
  },
  {
    label: 'Cedula Juridica',
    value: 'CedJuridica|asc'
  },
  {
    label: 'Cedula Juridica',
    value: 'CedJuridica|desc'
  }
];

const applyFilters = (
  proveedores: Proveedorsol[],
  filters: Filters
  
): Proveedorsol[] => proveedores.filter((proveedor) => {
  console.log(proveedor)
  if (filters.query) {
    let queryMatched = false;
    const properties: ('proveedor_dsc' | 'GerenteGeneral')[] = ['proveedor_dsc', 'GerenteGeneral'];

    properties.forEach((property) => {
      if ((proveedor[property]).toLowerCase().includes(filters.query!.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  // if (filters.hasAcceptedMarketing && !customer.hasAcceptedMarketing) {
  //   return false;
  // }

  // if (filters.isProspect && !customer.isProspect) {
  //   return false;
  // }

  // if (filters.isReturning && !customer.isReturning) {
  //   return false;
  // }

  return true;
});

const descendingComparator = (a: Proveedorsol, b: Proveedorsol, sortBy: SortField): number => {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.

  // if (b[sortBy]! < a[sortBy]!) {
  //   return -1;
  // }

  // if (b[sortBy]! > a[sortBy]!) {
  //   return 1;
  // }

  return 0;
};

const getComparator = (sortDir: SortDir, sortBy: SortField) => (
  sortDir === 'desc'
    ? (a: Proveedorsol, b: Proveedorsol) => descendingComparator(a, b, sortBy)
    : (a: Proveedorsol, b: Proveedorsol) => -descendingComparator(a, b, sortBy)
);

const applySort = (proveedores: Proveedorsol[], sort: Sort): Proveedorsol[] => {
  const [sortBy, sortDir] = sort.split('|') as [SortField, SortDir];
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = proveedores.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (
  proveedores: Proveedorsol[],
  page: number,
  rowsPerPage: number
): Proveedorsol[] => proveedores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ProveedorList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [proveedores, setProveedores] = useState<Proveedorsol[]>([]);
  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProveedores = useCallback(async () => {
    try {
      //alert('consultado la api proveedores')
      const data = await productApi.getProveedoresol();
      console.log(data);
      
      if (isMounted()) {
        setProveedores(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getProveedores();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTabsChange = (event: ChangeEvent<{}>, value: TabValue): void => {
    const updatedFilters: Filters = {
      ...filters,
      hasAcceptedMarketing: undefined,
      isProspect: undefined,
      isReturning: undefined
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setCurrentTab(value);
  };

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredProveedores = applyFilters(proveedores, filters);
  const sortedProveedores = applySort(filteredProveedores, sort);
  const paginatedProveedores = applyPagination(sortedProveedores, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Lista Proveedores | Conexion Gessa
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
                  Proveedores
                </Typography>
              </Grid>
              <Grid item>
              <NextLink
              //   usado para cargar nuevo proveedor   <------
                  href="/dashboard/proveedores/crearProveedor"
                  passHref
                >
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                >
                  Agregar Proveedor
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
                
              </Button>
              <Button
                startIcon={<DownloadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                
              </Button>
            </Box>
          </Box>
          <Card>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ px: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {/* {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))} */}
            </Tabs>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                m: -1.5,
                p: 3
              }}
            >
              <Box
                component="form"
                onSubmit={handleQueryChange}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Buscar Proveedores..."
                />
              </Box>
              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <ProveedorListTable
              proveedores={paginatedProveedores}
              proveedorCount={filteredProveedores.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProveedorList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProveedorList;
