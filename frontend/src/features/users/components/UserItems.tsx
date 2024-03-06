import React from 'react';
import { selectGetUsersByRoleLoading } from '../usersSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Box, Stack, Typography } from '@mui/material';
import UserItem from './UserItem';
import { PageInfo, User } from '../../../types';
import Pagination from '@mui/material/Pagination';
import { getByRole } from '../usersThunks';

interface Props {
  prop: User[];
  gotUsersPageInfo: PageInfo;
  role: string;
}

const UserItems: React.FC<Props> = ({ prop, role, gotUsersPageInfo }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGetUsersByRoleLoading);
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(getByRole({ role: role, page: page }));
  };

  const renderPagination = () => {
    if (gotUsersPageInfo && gotUsersPageInfo.totalPages > 1) {
      return (
        <Box display="flex" justifyContent="center" sx={{ m: 2 }}>
          <Stack spacing={2}>
            <Pagination
              showFirstButton
              showLastButton
              count={gotUsersPageInfo.totalPages}
              page={gotUsersPageInfo.currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size={'small'}
            />
          </Stack>
        </Box>
      );
    }
    return null;
  };

  return (
    <>
      {loading && <Spinner />}

      {prop.length > 0 ? (
        <>
          {renderPagination()}
          {prop.map((item) => (
            <UserItem key={item._id} prop={item} role={role} />
          ))}
          {renderPagination()}
        </>
      ) : (
        <Typography>There are no users</Typography>
      )}
    </>
  );
};

export default UserItems;
