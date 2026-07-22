import { ChangeEvent, Fragment, MouseEvent } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Po } from 'src/types/pos';
import { productApi, ProductStatus } from 'src/__fake-api__/product-api';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import { SeverityPill } from '../../severity-pill';
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
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { Articulo, ProductNew } from 'src/types/product-new';
import { Category } from 'src/types/APIcategory';

interface ProductListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  //pos: Po[];
  articulos: Articulo[];
  categories: Category[];
  ArticulosCount: number;
  rowsPerPage: number;
}



export const ProductListTable: FC<ProductListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    //pos,
    articulos,
    ArticulosCount,
    rowsPerPage,
    ...other
  } = props;
  

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                Descripcion
              </TableCell>
              <TableCell>
                Marca 
              </TableCell>
              <TableCell>
                Codigo Barras
              </TableCell>
              <TableCell>
                Categoria
              </TableCell>
              <TableCell>
                Estatus
              </TableCell>
              <TableCell>
                Editar...
              </TableCell>
            </TableRow>
           
          </TableHead>
          <TableBody>
            {articulos.map((arti) => {
              return (
                <Fragment key={arti.ArticuloID}>
                  <TableRow
                    hover
                    key={arti.ArticuloID}
                  >
                    <TableCell>
                      {arti.ArticuloID}
                    </TableCell>
                   <TableCell >
                      {arti.DescripcionProducto} <SeverityPill color='error'> {arti.CambioPrecio? 'CAMBIO DE PRECIO!':''}   </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {arti.MarcaDsc}
                    </TableCell>
                    <TableCell>
                      {arti.EAN13}
                    </TableCell>
                    <TableCell>
                   
                      {arti.categoria_dsc}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={arti.status == 'DIGITADO  ' ? 'error' : arti.status == 'ASISTENTE ' ? 'success' : 'secondary'}>
                        {arti.status}
                      </SeverityPill>
                      </TableCell>
                    <TableCell align="center">
                    <NextLink
                          href={`/dashboard/products-new/${arti.ArticuloID}`}
                   
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
        count={ArticulosCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProductListTable.propTypes = {
  articulos: PropTypes.array.isRequired,
  ArticulosCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
