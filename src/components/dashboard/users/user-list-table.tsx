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
import { APIUser } from 'src/types/APIUser';
import NextLink from 'next/link';

interface UserListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  users: APIUser[];
  usersCount: number;
  rowsPerPage: number;
}



export const UserListTable: FC<UserListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    users,
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
              <TableCell />
              <TableCell>
                Nombre
              </TableCell>
              <TableCell>
                Usuario
              </TableCell>
              <TableCell>
                Terapeuta o Funcionario
              </TableCell>
              <TableCell>
                Tipo
              </TableCell>
              <TableCell>
                Editar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <Fragment key={user.UserId}>
                  <TableRow
                    hover
                    key={user.UserId}
                  >
                    <TableCell>
                      {user.UserId}
                    </TableCell>
                    <TableCell>
                      {user.Name}
                    </TableCell>
                    <TableCell>
                      {user.Username}
                    </TableCell>
                    <TableCell>
                      {`${user.proveedor_dsc} (${user.gln})`}
                    </TableCell>
                    <TableCell>
                      {user.UserTypeDescription}
                    </TableCell>
                    <TableCell align="center">
                    <NextLink
                          href={`/dashboard/users/${user.UserId}/edit`}
                   
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

UserListTable.propTypes = {
  users: PropTypes.array.isRequired,
  usersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
