import React from 'react';
import OrderItem from './OrderItem';
import { Box, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { OrderFromServerType, PageInfo } from '../../../types';
import { selectFetchOrdersForAdminLoading, selectFetchOrdersLoading } from '../orderSlice';
import Pagination from '@mui/material/Pagination';
import { getForAdminHisOrders, getOrders } from '../orderThunks';

interface Props {
  ordersItems: OrderFromServerType[];
  ordersPageInfo?: PageInfo;
  adminPageInfo?: PageInfo;
  id?: string;
}

const OrderItems: React.FC<Props> = ({ ordersItems, ordersPageInfo, adminPageInfo, id }) => {
  const ordersLoading = useAppSelector(selectFetchOrdersLoading);
  const ordersLoadingForAdmin = useAppSelector(selectFetchOrdersForAdminLoading);
  const dispatch = useAppDispatch();
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    if (ordersPageInfo) {
      dispatch(getOrders(page));
    } else if (adminPageInfo && id) {
      dispatch(getForAdminHisOrders({ page: page, id: id }));
    }
  };

  const renderPagination = () => {
    if (ordersPageInfo && ordersPageInfo.totalPages > 1) {
      return (
        <Box display="flex" justifyContent="center">
          <Stack spacing={2}>
            <Pagination
              showFirstButton
              showLastButton
              count={ordersPageInfo.totalPages}
              page={ordersPageInfo.currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size={'small'}
            />
          </Stack>
        </Box>
      );
    } else if (adminPageInfo && adminPageInfo.totalPages > 1) {
      return (
        <Box display="flex" justifyContent="center">
          <Stack spacing={2}>
            <Pagination
              showFirstButton
              showLastButton
              count={adminPageInfo.totalPages}
              page={adminPageInfo.currentPage}
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
      {ordersLoading || ordersLoadingForAdmin ? <Spinner /> : null}
      {ordersItems.length > 0 ? (
        <>
          {renderPagination()}
          <Box sx={{ mt: 2, mb: 2 }}>
            {ordersItems.map(
              (item) =>
                (adminPageInfo || ordersPageInfo) && (
                  <OrderItem key={item._id} prop={item} pageInfo={ordersPageInfo} adminPageInfo={adminPageInfo} />
                ),
            )}
          </Box>
          {renderPagination()}
        </>
      ) : (
        <Typography>{'Заказов ещё нет'}</Typography>
      )}
    </>
  );
};

export default OrderItems;
