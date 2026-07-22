import { useEffect, useState } from 'react';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Grid,
  TextField,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import type { Proveedorsol } from '../../../types/APIproveedores';
import { getInitials } from '../../../utils/get-initials';
import { Scrollbar } from '../../scrollbar';
import { VisitasHospitales } from 'src/types/APIAmiInterfaces';
import { SeverityPill } from 'src/components/severity-pill';

interface ProveedorListTableProps {
  proveedores: VisitasHospitales[];
  proveedorCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

export const ProveedorListTable: FC<ProveedorListTableProps> = (props) => {
  const {
    proveedores,
    proveedorCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedProveedores, setSelectedProveedores] = useState<string[]>([]);
  const [mesVisitaSelected, setvisitasSelected] = useState<string | null>(null);

  // Reset selected customers when customers change
  useEffect(
    () => {
      if (selectedProveedores.length) {
        setSelectedProveedores([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [proveedores]
  );

  const handleSelectAllProveedores = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedProveedores(
      event.target.checked ? proveedores.map((proveedor) => proveedor.Id)
        : []
    );
  };

  const handleSelectOneCustomer = (
    event: ChangeEvent<HTMLInputElement>,
    VisitaID: string
  ): void => {
    if (!selectedProveedores.includes(VisitaID)) {
      setSelectedProveedores((prevSelected) => [...prevSelected, VisitaID]);
    } else {
      setSelectedProveedores((prevSelected) => prevSelected.filter((id) => id !== VisitaID));
    }
  };

  const enableBulkActions = selectedProveedores.length > 0;
  const selectedSomeProveedores = selectedProveedores.length > 0
    && selectedProveedores.length < proveedores.length;
  const selectedAllProveedores = selectedProveedores.length === proveedores.length;

  return (
    <div {...other}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          display: enableBulkActions ? 'block' : 'none',
          px: 2,
          py: 0.5
        }}
      >
        <Checkbox
          checked={selectedAllProveedores}
          indeterminate={selectedSomeProveedores}
          onChange={handleSelectAllProveedores}
        />
       
       <Button
          size="small"
          sx={{ ml: 2 }}
        >
          Delete
        </Button>
        <Button
          size="small"
          sx={{ ml: 2 }}
        >
          Edit
        </Button>
      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ visibility: enableBulkActions ? 'collapse' : 'visible' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllProveedores}
                  indeterminate={selectedSomeProveedores}
                  onChange={handleSelectAllProveedores}
                />
              </TableCell>
              <TableCell>
                Paciente
              </TableCell>
           
              <TableCell>
                Fecha Visita
              </TableCell>
              <TableCell>
                Mes de visita
              </TableCell>
              <TableCell>
                Estatus
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => {
              const isProveedorSelected = selectedProveedores.includes(proveedor.Id);

              return (
                <TableRow
                  hover
                  key={proveedor.NombrePaciente}
                  selected={isProveedorSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isProveedorSelected}
                      onChange={(event) => handleSelectOneCustomer(
                        event,
                        proveedor.Id
                      )}
                      value={isProveedorSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src='../../icons/user.tsx'
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(proveedor.NombrePaciente)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/Visitas/${proveedor.Id!}/edit`}    // poneer aque edicion
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {proveedor.NombrePaciente}
                          </Link>
                        </NextLink>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {proveedor.DscHospital}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="success.main"
                      variant="subtitle2"
                    >
                     {proveedor.FechaVisita}
                 
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="success.main"
                      variant="subtitle2"
                    >
                      {proveedor.DscMesVisita}
                    </Typography>
                  </TableCell>

                  <TableCell>
                      
                      <SeverityPill color={proveedor.SharePoint?  'success': 'error' }>
                        {proveedor.SharePoint  ? 'Procesada'  : 'Pendiente'}
                            
                      </SeverityPill> 
                      </TableCell>
                 
               {/*    <TableCell align="right">
                    <NextLink
                          href={`/dashboard/proveedores/${proveedor.Id}/edit`}
                   
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                   
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={proveedorCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProveedorListTable.propTypes = {
  proveedores: PropTypes.array.isRequired,
  proveedorCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
