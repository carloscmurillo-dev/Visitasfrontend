import { ChangeEvent, Fragment, MouseEvent, useState } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { Category } from 'src/types/APIcategory';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';

interface CategoryListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  categories: Category[];
  productsCount: number;
  rowsPerPage: number;
}

const categoryOptions = [
  {
    label: 'Healthcare',
    value: 'healthcare'
  },
  {
    label: 'Makeup',
    value: 'makeup'
  },
  {
    label: 'Dress',
    value: 'dress'
  },
  {
    label: 'Skincare',
    value: 'skincare'
  },
  {
    label: 'Jewelry',
    value: 'jewelry'
  },
  {
    label: 'Blouse',
    value: 'blouse'
  }
];

export const CategoryListTable: FC<CategoryListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    categories,
    productsCount,
    rowsPerPage,
    ...other
  } = props;
  const [openCategory, setOpenCategory] = useState<number | null>(null);

  const handleOpenCategory = (categoryId: number): void => {
    setOpenCategory((prevValue) => (prevValue === categoryId ? null : categoryId));
  };

  const handleUpdateCategory = (): void => {
    setOpenCategory(null);
    toast.success('Product updated');
  };

  const handleCancelEdit = (): void => {
    setOpenCategory(null);
  };

  const handleDeleteCategory = (): void => {
    toast.error('Product cannot be deleted');
  };

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                ID
              </TableCell>
              <TableCell>
                Categoria
              </TableCell>
              <TableCell>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => {
              const open = category.categoria_id === openCategory;

              return (
                <Fragment key={category.categoria_id}>
                  <TableRow
                    hover
                    key={category.categoria_id}
                  >
                    <TableCell>
                      {category.categoria_id}
                    </TableCell>
                    <TableCell>
                      {category.categoria_dsc}
                    </TableCell>
                    <TableCell>
                      <NextLink
                        href={`/dashboard/subcategories/${category.categoria_id}`}
                        passHref
                      >
                        <IconButton component="a">
                          <ArrowRightIcon fontSize="small" />
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
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

CategoryListTable.propTypes = {
  categories: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
