import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { customerApi } from '../../../__fake-api__/customer-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { CustomerListTable } from '../../../components/dashboard/customer/customer-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { Upload as UploadIcon } from '../../../icons/upload';
import { gtm } from '../../../lib/gtm';
import type { Customer } from '../../../types/customer';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { productApi } from 'src/__fake-api__/product-api';
import { VisitasHospitales } from 'src/types/APIAmiInterfaces';
import { useHospitales } from 'src/hooks/useHospitales';
import { useMesesVisitas } from 'src/hooks/useMesesVisitas';
import toast from 'react-hot-toast';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from 'src/hooks/use-auth';

interface Filters {
  query?: string;
  hasAcceptedMarketing?: boolean;
  isProspect?: boolean;
  isReturning?: boolean;
}

type SortField = 'updatedAt' | 'totalOrders';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'updatedAt|desc'
  | 'updatedAt|asc'
  | 'totalOrders|desc'
  | 'totalOrders|asc';

interface SortOption {
  label: string;
  value: Sort;
}

type TabValue = 'all' | 'hasAcceptedMarketing' | 'isProspect' | 'isReturning';

interface Tab {
  label: string;
  value: TabValue;
}

const tabs: Tab[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Accepts Marketing',
    value: 'hasAcceptedMarketing'
  },
  {
    label: 'Prospect',
    value: 'isProspect'
  },
  {
    label: 'Returning',
    value: 'isReturning'
  }
];

const sortOptions: SortOption[] = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
  {
    label: 'Total orders (highest)',
    value: 'totalOrders|desc'
  },
  {
    label: 'Total orders (lowest)',
    value: 'totalOrders|asc'
  }
];

const applyFilters = (
  customers: Customer[],
  filters: Filters
): Customer[] => customers.filter((customer) => {
  if (filters.query) {
    let queryMatched = false;
    const properties: ('email' | 'name')[] = ['email', 'name'];

    properties.forEach((property) => {
      if ((customer[property]).toLowerCase().includes(filters.query!.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  if (filters.hasAcceptedMarketing && !customer.hasAcceptedMarketing) {
    return false;
  }

  if (filters.isProspect && !customer.isProspect) {
    return false;
  }

  if (filters.isReturning && !customer.isReturning) {
    return false;
  }

  return true;
});

const descendingComparator = (a: Customer, b: Customer, sortBy: SortField): number => {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.

  if (b[sortBy]! < a[sortBy]!) {
    return -1;
  }

  if (b[sortBy]! > a[sortBy]!) {
    return 1;
  }

  return 0;
};

const getComparator = (sortDir: SortDir, sortBy: SortField) => (
  sortDir === 'desc'
    ? (a: Customer, b: Customer) => descendingComparator(a, b, sortBy)
    : (a: Customer, b: Customer) => -descendingComparator(a, b, sortBy)
);

const applySort = (customers: Customer[], sort: Sort): Customer[] => {
  const [sortBy, sortDir] = sort.split('|') as [SortField, SortDir];
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

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
  customers: Customer[],
  page: number,
  rowsPerPage: number
): Customer[] => customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const CustomerList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  });


  const [hospitalSelected, setselectHospital] = useState<string | null>(null);
  const [mesVisitaSelected, setvisitasSelected] = useState<string | null>(null);


  const [proveedores, setProveedores] = useState<VisitasHospitales[]>([]);

  const { mesesVisitas } = useMesesVisitas();
  const { hospitales } = useHospitales();

  const handleGeneraExcel = async (): Promise<void> => {
    // console.log('ITEM FILE DE NUEVO',itemFileCod)
  
    // console.log('visita en excel',proveedor)
  
    if ((confirm('Desea Exportar datos de Visitas: '  + '' + ' a Excel?') == true) )
      {
          
          /*  const dataExcelCargaPlu = [{'CodBarras':'',	'CodPLU':''	,'IndPesado':''}]
        
           const dataExcel = await productApi.LoadProdutos(openProduct!);
           const dataExcelNlo = await productApi.LoadProdutosNlo(openProduct!);
           const dataExcelPre = await productApi.LoadProdutosPre(openProduct!);s
  
           const dataExcelProv = await productApi.LoadProdutosProv(openProduct!);
           const dataExcelPdv = await productApi.LoadProdutosPdv(openProduct!); */
  
          const dataExcel = await productApi.getVisitasXFiltros(hospitalSelected?? '',mesVisitaSelected?? '');
           
        
                
                const worksheet = XLSX.utils.json_to_sheet(dataExcel);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "VisitasTerapeutas");
  
               
  
                // Buffer to store the generated Excel file
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
                saveAs(blob, "data_" + 'VisitasHospital' + ".xlsx");
  
             
  
  
                toast.success('Excel descargado!');
                // router.reload();
              }
  };





  const handleChangeHOSPITAL = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const categorySplit = (event.target.value).split('-');
    setselectHospital(categorySplit[0]);

     getProveedores(event.target.value,mesVisitaSelected?? '')
   
    
   
  };

  const handleChangeMesVisita = async (event: React.ChangeEvent<HTMLInputElement>) => {
   
    setvisitasSelected(event.target.value);
  

    getProveedores(hospitalSelected?? '',event.target.value)
  };


  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProveedores = useCallback(async (h:string,m:string) => {
    try {
      alert(user.gln)
      const data = await productApi.getVisitasXTerapeutaHistorico(user.gln);
      // const data = await productApi.getVisitasXTerapeuta('1');
      console.log('los historicos son',data);
      
      if (isMounted()) {
        setProveedores(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

   useEffect(
    () => {
      getProveedores('','');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  ); 

 
  
 

 

  return (
    <>
      <Head>
        <title>
          Dashboard: Control Visitas Historicas | Amimed Salud
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
                  Control de Visitas Historicas Terapeutas
                </Typography>
              </Grid>
             
            </Grid>
            <Box
              sx={{
                m: -1,
                mt: 3
              }}
            >
             
              <Button
               onClick={handleGeneraExcel}
              
                startIcon={<DownloadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Exportar a Excel
              </Button>

              <Box sx={{ height: 400, width: '100%' }}>


              <Card>
        <CardHeader title="Parámetros para filtrar visitas..." />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >



                

   {/*            <Grid
                item
                md={6}
                xs={12}
             
              >
                <TextField
                    onChange={handleChangeHOSPITAL}
                  fullWidth
                  label="Hospital"
              
                  select
                >
                  {hospitales && hospitales.map((option) => (
                    <MenuItem
                      key={option.IdHospital}
                      value={`${option.IdHospital}`}
                      
                    >
                      {`${option.DscHospital}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                md={6}
                xs={12}
                
              >
                <TextField
                  onChange={handleChangeMesVisita}
                  fullWidth
                  label="Mes de Visita"
                  // value={formik.values.IdMesVisita?.toString() ?? ""}
                  select
                >
                  {mesesVisitas && mesesVisitas.map((option) => (
                    <MenuItem
                      key={option.IdMesVisita}
                      value={`${option.IdMesVisita}`}
                      
                    >
                      {`${option.DscMesVisita}`}
                    </MenuItem>
                  ))}
                </TextField>

                  <Button
                    // onClick={getProveedores('','')}
                  
                    sx={{ m: 1 }}
                    variant="contained"
                  >
                    Filtrar Visita
                  </Button>




              </Grid> */}
              <Divider />


              <Card>
        <CardHeader title="Resultado visitas..." />
        <Divider />


              <CardContent>
          <Grid
            container
            spacing={3}
          >



      <DataGrid
      getRowId={(row) => row.Id}
        rows={proveedores}
        columns={[{ field: 'Id' }, { field: 'IdHospital' }, { field: 'DscHospital' }, { field: 'idPaciente' }
            , { field: 'NombrePaciente' }, { field: 'IdTerapeuta' }, { field: 'NombreTerapeuta' }, { field: 'IdMesVisita' }, { field: 'DscMesVisita' }
			, { field: 'FechaVisita' }, { field: 'IdTipoVisita' }, { field: 'DscTipoVisita' }, { field: 'IdTipoEquipo' }, { field: 'DscTipoEquipo' }
			, { field: 'FrecuenciaCardiaca' }, { field: 'PresionArterialSistolica' }, { field: 'PresionArterialDiastolica' }, { field: 'SaturacionOxigeno' }, { field: 'HoraUsoPromDia' }
			, { field: 'HorasTotalMensuales' }, { field: 'DiasUsoSobreTotal' }, { field: 'FugaLmin' }, { field: 'IndiceApnea' }
			, { field: 'PresionUtilizadaEpap' }, { field: 'PresionUtilizadaIPAP' }, { field: 'PresionUtilizadaCPAP' }, { field: 'CambioEquipo' }, { field: 'NumSerieEquipoyDN' }
			, { field: 'IdEstadoEquipo' }, { field: 'DscEstadoEquipo' }, { field: 'IdEvaluacionVisita' }, { field: 'DscEvaluacionVisita' }, 
			{ field: 'ObservacionesClinicas' }, { field: 'ComentariosAdministrativos' }, { field: 'SharePoint' }]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[15]}
        checkboxSelection
        disableRowSelectionOnClick
      />

</Grid>

</CardContent>

</Card>

</Grid>
</CardContent>

</Card>
    
    <Divider />
   
     





    </Box>


            </Box>
          </Box>
         </Container>
      </Box>

     
    



      
    </>
  );
};

CustomerList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);





export default CustomerList;
