import { ChangeEvent, Fragment, MouseEvent } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { Puestos } from 'src/types/APITablasReferencia';
import NextLink from 'next/link';

interface PuestosListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  puestos: Puestos[];
  usersCount: number;
  rowsPerPage: number;
}



export const PuestoListTable: FC<PuestosListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    puestos,
    usersCount,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              
              <TableCell>
                Descripcion Puesto
              </TableCell>
              
             
              <TableCell>
                Editar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {puestos.map((puesto) => {
              return (
                <Fragment key={puesto.IdPuesto}>
                  <TableRow
                    hover
                    key={puesto.IdPuesto}
                  >
                    <TableCell>
                      {puesto.DescripcionPuesto}
                    </TableCell>
                    
                    
                    <TableCell align="center">
                    <NextLink
                          href={`/dashboard/puestos/${puesto.IdPuesto}/edit`}
                   
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                   
                  </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={usersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

PuestoListTable.propTypes = {
  puestos: PropTypes.array.isRequired,
  usersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
