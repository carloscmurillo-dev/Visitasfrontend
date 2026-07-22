import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { productApi } from '../../../__fake-api__/product-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProveedorListTable } from '../../../components/dashboard/Visita/visita-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { Upload as UploadIcon } from '../../../icons/upload';
import { gtm } from '../../../lib/gtm';
import type { Proveedorsol } from '../../../types/APIproveedores';
import { useAuth } from 'src/hooks/use-auth';
import { VisitasHospital, VisitasHospitales } from 'src/types/APIAmiInterfaces';
import { Filters, ProjectListFilters } from 'src/components/dashboard/Visita/visita-list-filters';
import { FileDropzone } from 'src/components/file-dropzone';
import { DropEvent, FileRejection } from 'react-dropzone';
import * as XLSX from "xlsx"
import { base64toBlob, fileToBase64 } from 'src/utils/file-to-base64';
import { string } from 'prop-types';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";


const applyFilters = (
  visitas: VisitasHospitales[],
  filters: Filters
  
): VisitasHospitales[] => visitas.filter((visita) => {
  if (filters.name) {
    const nameMatched = visita.NombrePaciente.toLowerCase().includes(filters.name.toLowerCase());

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
  proveedores: VisitasHospitales[],
  page: number,
  rowsPerPage: number
): VisitasHospitales[] => proveedores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ProveedorList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [proveedores, setProveedores] = useState<VisitasHospitales[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);


const [openE, setOpenE] = useState(false);
const handleOpenE = () => setOpenE(true);
const handleCloseE = () => setOpenE(false);

//const [data, setData] = useState<string[][]>([])    ;
type ParsedRow = (string | number | null)[]


const [data, setData] = useState<string[][]>([])    ;

  const [columns, setColumns] = useState<ColumnDef<any>[]>();



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

  const getProveedores = useCallback(async () => {
    try {
      //alert('consultado la api proveedores')
      console.log('el gln es ', user.gln)
      const data = await productApi.getVisitasXTerapeuta(user.gln);
      console.log('Datos devueltos',data);
      
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
  const filteredProveedores = applyFilters(proveedores, filters);
  const paginatedProveedores = applyPagination(filteredProveedores, page, rowsPerPage);

  const handleDropCover1 = async ([file]: File[]) => {
    
    console.log('ANTE FORMATO:',file)
   
  
   
   
     
      if (!file) return;

    //  const data2 = await fileToBase64(file) as string;
     
  
      const reader = new FileReader();
      reader.readAsBinaryString(file);
  
      reader.onload = (e) => {
        if (!e.target) return; 
        const binaryString = e.target?.result;

       // console.log('binary string',binaryString)
   


        const workbook = XLSX.read(binaryString, { type: "binary" });
  
        const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
        const sheet = workbook.Sheets[sheetName];

        const parsedData2  = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convertir a JSON
        const parsedData:  ParsedRow[]  = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convertir a JSON

        setData(parsedData2 as string[][]);

         console.log('como file',data)
         console.log('como file 2------------------------>',parsedData)
         
         //let {enca1,enca2,enca3,enca4} = data[0];
        
         console.log('unitario', parsedData[1]?.[0])
         if(parsedData[0]?.[0] != 'GLN')
            alert('Columna GLN no encontrada en archivo excel')

         if(parsedData[0]?.[1] != 'CODIGOBARRAS')
          alert('Columna CODIGOBARRAS no encontrada en archivo excel')

         if(parsedData[0]?.[2] != 'COSTO')
          alert('Columna COSTO no encontrada en archivo excel')

         if(parsedData[0]?.[3] != 'DESC_INTRODUCCION')
          alert('Columna DESC_INTRODUCCION no encontrada en archivo excel')


         parsedData.forEach((fila,indexf) => 
       //   console.log(fila));
         fila.forEach((columna,indexC) =>
          console.log(columna))
        );


        // if(parsedData[0][0]!= 'gln')
      };





  };


  /* const handleFileUpload =  (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      if (!e.target?.result) return;

      const binaryString = e.target.result as string;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
      const sheet = workbook.Sheets[sheetName];

      const parsedData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (parsedData.length > 0) {
        const headers = parsedData[0] as string[];
        const formattedColumns = headers.map((header) => ({
          accessorKey: header,
          header: header,
        }));

        const formattedData = parsedData.slice(1).map((row) =>
          headers.reduce((obj, key, index) => {
            obj[key] = row[index] || "";
            return obj;
          }, {} as Record<string, any>)
        );

        setColumns(formattedColumns);
        setData(formattedData as string[][]);
      }
    };
  };
 */
  const table = useReactTable({
    data,
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
  });

  

  return (
    <>
      <Head>
        <title>
          Dashboard: Visitas Terapeutas | Amimed Salud
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
                  Visitas de Terapeutas
                </Typography>
              </Grid>
              <Grid item>
              <NextLink
              //   usado para cargar nuevo proveedor   <------
                  href="/dashboard/Visitas/crearVisita"   
                  passHref
                >
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                >
                  Agregar Visita
                </Button>
                </NextLink>
              </Grid>
            </Grid>


            <div>
      <Button onClick={handleOpen}>Cargar Excel...</Button>
      <Modal
       
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

      <Box sx={style}>
         <>
       
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cargar Excel de Precios 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Seleccione archivo excel a validar y subir...
          </Typography>
          <Grid
                                  item
                                  md={12}
                                  xs={12} 
                                  sx={{ mt: -4 }}
                                  >
                                  <Card sx={{ mt: 4 }}>
                                  <CardContent>
                                
                              
                               
                                    <Box sx={{ mt: 3 }}>
                                      <FileDropzone
                                        accept={{
                                          '*.pdf"': []
                                        }}
                                        maxFiles={1}
                                        onDrop={handleDropCover1}
                                        
                                      />
                                    </Box>
                                  </CardContent>
                                </Card>
                                </Grid>
                                {data.length > 0 &&
                                           <>
                                          <Button onClick={handleOpenE}>Ver Excel cargado...</Button>
                                          <Modal
                                          
                                            open={openE}
                                            onClose={handleCloseE}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                          >
                                                <Box sx={styleModal2}>
                                              <table>
                                              <thead>
                                                <tr>
                                                  {data.length > 0 &&
                                                    data[0].map((header, index) => <th key={index}>{header}</th>)}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {data.slice(1).map((row, rowIndex) => (
                                                  <tr key={rowIndex}>
                                                    {row.map((cell, cellIndex) => (
                                                      <td key={cellIndex}>{cell}</td>
                                                    ))}
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                            </Box>
                                            </Modal>
                                            </> }

          </>
        </Box>
      </Modal>
    </div>

            
         
          </Box>
          <Card>
      
          <ProjectListFilters onChange={handleFiltersChange} />
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  heigh: 1800,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleModal2 = {
  position: 'absolute',
  top: '20%',
  left: '10%',
 
  width: 1000,
  heigh: 1800,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

export default ProveedorList;


/* import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelReader = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convertir a JSON
      setData(parsedData);
    };
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <table border="1">
        <thead>
          <tr>
            {data.length > 0 &&
              data[0].map((header, index) => <th key={index}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelReader;

 */