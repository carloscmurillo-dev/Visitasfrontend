import type { ChangeEvent, FC, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
//import type { Order } from '../../../types/order';
import type { Mensajes } from '../../../types/APImensajes';
import { SeverityPill } from '../../severity-pill';
import type { SeverityPillColor } from '../../severity-pill';

interface CitasListTableProps {
  onOpenDrawer?: (mensaje_id: number) => void;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  mensajes: Mensajes[];
  mensajesCount: number;
  page: number;
  rowsPerPage: number;
}

const severityMap: { [key: string]: SeverityPillColor; } = {
  complete: 'success',
  pending: 'info',
  canceled: 'warning',
  rejected: 'error'
};

export const CitasListTable: FC<CitasListTableProps> = (props) => {
  const {
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    mensajes,
    mensajesCount,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Table>
        <TableBody>
          {mensajes.map((mensaje) => (
            <TableRow
              hover
              key={mensaje.mensaje_id}
              onClick={() => onOpenDrawer?.(mensaje.mensaje_id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.200',
                    borderRadius: 2,
                    maxWidth: 'fit-content',
                    ml: 3,
                    p: 1
                  }}
                >
                  <Typography
                    align="center"
                    variant="subtitle2"
                  >
                    {/* {format(mensaje.msgDate, 'LLL').toUpperCase()} */}
                  </Typography>
                  <Typography
                    align="center"
                    variant="h6"
                  >
                  
                    {format(new Date(mensaje.msgDate), 'dd/MM/yyyy')}
                  </Typography>
                </Box>
                <Box sx={{ width: 220,ml: 10 }}>
                 
                 <Typography
                   color="textSecondary"
                   variant="h6"
                 >
                 
                   {mensaje.Name}
                 </Typography>
               </Box>
               <Box sx={{ width: 320,ml: 10 }}>
                 
                 <Typography
                   color="textSecondary"
                   variant="h6"
                 >
                   {mensaje.titulo}
                 
                 </Typography>
               </Box>
                
                <Box sx={{width: 300, ml: 2 }}>
                  <Typography variant="subtitle1">
                    {mensaje.UsuarioSend}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Envia a:
                    {' '}
                    {mensaje.UsuarioRecep}
                  </Typography>
                </Box>
             
              
             {/*   <Box sx={{ width: 200,ml: 10 }}>
                 
                 <Typography
                   color="textSecondary"
                   variant="body1"
                 >
                   Cat.:{mensaje.Categoria}
                
                 </Typography>
               </Box> */}
                
              </TableCell>
              <TableCell align="right">
                <SeverityPill color={severityMap[mensaje.status] || 'warning'}>
                  {mensaje.status}
                </SeverityPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={mensajesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

CitasListTable.propTypes = {
  onOpenDrawer: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  mensajes: PropTypes.array.isRequired,
  mensajesCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
