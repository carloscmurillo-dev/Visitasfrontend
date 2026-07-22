import { ChangeEvent, Fragment, MouseEvent, useState } from 'react';
import type { FC } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { Category } from 'src/types/APIcategory';
import { SubCategory } from 'src/types/APISubCategory';

interface SubCategoryListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  subcategories: SubCategory[];
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

export const SubCategoryListTable: FC<SubCategoryListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    subcategories,
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
                SubCategoria
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.map((category) => {
              const open = category.subcategoria_id === openCategory;

              return (
                <Fragment key={category.subcategoria_id}>
                  <TableRow
                    hover
                    key={category.subcategoria_id}
                  >
                    <TableCell>
                      {category.subcategoria_id}
                    </TableCell>
                    <TableCell>
                      {category.subcategoria_dsc}
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

SubCategoryListTable.propTypes = {
  subcategories: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
