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

interface ProveedorListTableProps {
  proveedores: Proveedorsol[];
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
      event.target.checked ? proveedores.map((proveedor) => proveedor.proveedor_dsc)
        : []
    );
  };

  const handleSelectOneCustomer = (
    event: ChangeEvent<HTMLInputElement>,
    proveedor_dsc: string
  ): void => {
    if (!selectedProveedores.includes(proveedor_dsc)) {
      setSelectedProveedores((prevSelected) => [...prevSelected, proveedor_dsc]);
    } else {
      setSelectedProveedores((prevSelected) => prevSelected.filter((id) => id !== proveedor_dsc));
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
       
        <Grid
         item
         md={6}
         xs={12}
                                   
                                  >
                                    <TextField
                                      fullWidth
                                      value={0}
                                      //onChange={handleComercialShortDescriptionChange}
                                      label="Numero de Convenio:"
                                    />
                                  </Grid>
        <Button
          size="small"
          sx={{ ml: 2 }}
        >
          VB Gerencia Comercial
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
                Proveedor
              </TableCell>
              <TableCell>
                Fecha Solicitud
              </TableCell>
              <TableCell>
                Cedula Juridica
              </TableCell>
              <TableCell>
                Razon Social
              </TableCell>
              <TableCell align="right">
                Editar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => {
              const isProveedorSelected = selectedProveedores.includes(proveedor.proveedor_dsc);

              return (
                <TableRow
                  hover
                  key={proveedor.proveedor_id}
                  selected={isProveedorSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isProveedorSelected}
                      onChange={(event) => handleSelectOneCustomer(
                        event,
                        proveedor.proveedor_dsc
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
                        {getInitials(proveedor.proveedor_dsc)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/proveedores/${proveedor.proveedor_id}/edit`}    // poneer aque edicion
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {proveedor.proveedor_dsc}
                          </Link>
                        </NextLink>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {proveedor.GerenteGeneral}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="success.main"
                      variant="subtitle2"
                    >
                     {format(new Date(proveedor.fechaSolicitud), 'dd/MM/yyyy')}
                     {/* {proveedor.fechaSolicitud} */}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="success.main"
                      variant="subtitle2"
                    >
                      {proveedor.CedJuridica}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="success.main"
                      variant="subtitle2"
                    >
                      {proveedor.RazonSocial}
                    </Typography>
                  </TableCell>
                 
                  <TableCell align="right">
                    <NextLink
                          href={`/dashboard/proveedores/${proveedor.proveedor_id}/edit`}
                   
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                   
                  </TableCell>
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
