import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { orderApi } from '../../../__fake-api__/order-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { MensajeDrawer } from '../../../components/dashboard/mensajes/mensaje-drawer';
import { MensajesListTable } from '../../../components/dashboard/mensajes/mensaje-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { gtm } from '../../../lib/gtm';
import type { Mensajes, MensajeStatus } from '../../../types/APImensajes';
import { productApi } from 'src/__fake-api__/product-api';
import { userInfo } from 'os';
import { useAuth } from '../../../hooks/use-auth';

interface Filters {
  query?: string;
  status?: MensajeStatus;
}

type SortDir = 'asc' | 'desc';

interface SortOption {
  label: string;
  value: SortDir;
}

type TabValue = 'all' | 'PENDIENTE' | 'RECIBIDO' | 'pending' | 'rejected';

interface Tab {
  label: string;
  value: TabValue;
}

const tabs: Tab[] = [
  {
    label: 'Todos',
    value: 'all'
  },
  {
    label: 'Pendiente',
    value: 'PENDIENTE'
  },
  {
    label: 'Recibidos',
    value: 'RECIBIDO'
  },
  
];

const sortOptions: SortOption[] = [
  {
    label: 'Newest',
    value: 'desc'
  },
  {
    label: 'Oldest',
    value: 'asc'
  }
];

const applyFilters = (
  orders: Mensajes[],
  filters: Filters
) => orders.filter((order) => {
  if (filters.query) {
    // Checks only the order number, but can be extended to support other fields, such as customer
    // name, email, etc.
    const containsQuery = (order.UsuarioSend || '').toLowerCase().includes(filters.query.toLowerCase());

    if (!containsQuery) {
      return false;
    }
  }

  if (typeof filters.status !== 'undefined') {
    const statusMatched = order.status === filters.status;

    if (!statusMatched) {
      return false;
    }
  }

  return true;
});

const applySort = (orders: Mensajes[], sortDir: SortDir): Mensajes[] => orders.sort((a, b) => {
  const comparator = a.msgDate > b.msgDate ? -1 : 1;

  return sortDir === 'desc' ? comparator : -comparator;
});

const applyPagination = (
  orders: Mensajes[],
  page: number,
  rowsPerPage: number
): Mensajes[] => orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const OrderListInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
      marginRight: -500
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('lg')]: {
        marginRight: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const MensajeList: NextPage = () => {
  const isMounted = useMounted();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [sort, setSort] = useState<SortDir>('desc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [orders, setOrders] = useState<Mensajes[]>([]);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    status: undefined
  });
  const [drawer, setDrawer] = useState<{ isOpen: boolean; mensaje_id?: number; }>({
    isOpen: false,
    mensaje_id: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getMensajes = useCallback(async () => {
    try {
      
      const data = await  productApi.getMensajes('MENSAJE   ');  
      
      console.log('DATOS DE MENSAJES',data)
      if (isMounted()) {
        setOrders(data);
        //alert(data);
        
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getMensajes();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTabsChange = (event: ChangeEvent<{}>, value: TabValue): void => {
    setCurrentTab(value);
    setFilters((prevState) => ({
      ...prevState,
      status: value === 'all' ? undefined : value
    }));
  };

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value as 'asc' | 'desc';
    setSort(value);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDrawer = (mensaje_id: number): void => {
    setDrawer({
      isOpen: true,
      mensaje_id
    });
  };

  const handleCloseDrawer = () => {
    setDrawer({
      isOpen: false,
      mensaje_id: undefined
    });
  };

  // Usually query is done on backend with indexing solutions
  const filteredOrders = applyFilters(orders, filters);
  const sortedOrders = applySort(filteredOrders, sort);
  const paginatedOrders = applyPagination(sortedOrders, page, rowsPerPage);

  

  return (
    <>
      <Head>
        <title>
          Dashboard: Order List | Amimed Salud
        </title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <OrderListInner open={drawer.isOpen}>
          <Box sx={{ px: 3 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Visor PDFs de Terapeutas
                </Typography>
              </Grid>
              <Grid item>
                {/* <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                >
                  Agregar
                </Button> */}
              </Grid>
            </Grid>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              sx={{ mt: 3 }}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </Box>
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
                placeholder="Buscar por"
              />
            </Box>
            <TextField
              label="Sort By"
              name="order"
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
          <Divider />
          <MensajesListTable
            onOpenDrawer={handleOpenDrawer}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            mensajes={paginatedOrders}
            mensajesCount={filteredOrders.length}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </OrderListInner>
        <MensajeDrawer
          containerRef={rootRef}
          onClose={handleCloseDrawer}
          open={drawer.isOpen}
          mensaje={orders.find((order) => order.mensaje_id === drawer.mensaje_id)}
        />
      </Box>
    </>
  );
};

MensajeList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default MensajeList;
