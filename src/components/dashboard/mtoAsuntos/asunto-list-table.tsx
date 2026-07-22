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
import { AsuntosMsg } from 'src/types/APITablasReferencia';
import NextLink from 'next/link';

interface AsuntosListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  asuntos: AsuntosMsg[];
  usersCount: number;
  rowsPerPage: number;
}



export const AsuntoListTable: FC<AsuntosListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    asuntos,
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
                Descripcion Asunto
              </TableCell>
              <TableCell>
                Tipo Asunto
              </TableCell>
             
              <TableCell>
                Editar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asuntos.map((asunto) => {
              return (
                <Fragment key={asunto.asunto_id}>
                  <TableRow
                    hover
                    key={asunto.asunto_id}
                  >
                    <TableCell>
                      {asunto.asunto_dsc}
                    </TableCell>
                    <TableCell>
                      {asunto.tipoAsunto=='C'? 'Cita':'Mensaje'}
                    </TableCell>
                    
                    <TableCell align="center">
                    <NextLink
                          href={`/dashboard/asuntos/${asunto.asunto_id}/edit`}
                   
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

AsuntoListTable.propTypes = {
  asuntos: PropTypes.array.isRequired,
  usersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
