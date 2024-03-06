import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { selectUser } from '../../users/usersSlice';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { OrderFromServerType, PageInfo, User } from '../../../types';
import { selectOrderChangeStatusLoading, selectOrderDeleteLoading } from '../orderSlice';
import { changeStatusOrder, deleteOrder, getForAdminHisOrders, getOrders } from '../orderThunks';

interface Props {
  prop: OrderFromServerType;
  pageInfo?: PageInfo;
  adminPageInfo?: PageInfo;
}

const OrderItem: React.FC<Props> = ({ prop, pageInfo, adminPageInfo }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const buttonLoading = useAppSelector(selectOrderChangeStatusLoading);
  const deleteOrderLoading = useAppSelector(selectOrderDeleteLoading);
  const [openDelete, setOpenDelete] = useState(false);

  // const background = prop.status === 'open' ? '#FFEAE9' : prop.status === 'in progress' ? 'lightyellow' : '#CCFFCD';
  const backgroundOrder = () => {
    if (prop.status === 'open') {
      return '#FFEAE9';
    } else if (prop.status === 'in progress') {
      return 'lightyellow';
    } else if (prop.status === 'canceled') {
      return '#fca5a5';
    } else {
      return '#CCFFCD';
    }
  };
  const handleClickOnCheckout = async (id: string) => {
    await dispatch(changeStatusOrder({ id: id, status: 'in progress' }));

    if (pageInfo) {
      let newPage: number;

      if ((pageInfo.totalItems - 1) % pageInfo.pageSize !== 0) {
        newPage = pageInfo.currentPage;
      } else {
        newPage = Math.max(1, pageInfo.currentPage - 1);
      }

      await dispatch(getOrders(newPage));
    }
  };

  const handleClickOnClose = async (id: string, status: string) => {
    if (user?._id) {
      if (status === 'closed') {
        await dispatch(changeStatusOrder({ id: id, status: status }));
      } else if (status === 'canceled') {
        await dispatch(changeStatusOrder({ id: id, status: status }));
      }

      if (adminPageInfo) {
        let newPage: number;

        if ((adminPageInfo.totalItems - 1) % adminPageInfo.pageSize !== 0) {
          newPage = adminPageInfo.currentPage;
        } else {
          newPage = Math.max(1, adminPageInfo.currentPage - 1);
        }

        await dispatch(getForAdminHisOrders({ id: user?._id, page: newPage }));
      }
    }
  };

  const handleDeleteOrder = async (id: string, admin: User | null) => {
    if (admin) {
      await dispatch(deleteOrder(id)).unwrap();

      if (adminPageInfo) {
        let newPage: number;

        if ((adminPageInfo.totalItems - 1) % adminPageInfo.pageSize !== 0) {
          newPage = adminPageInfo.currentPage;
        } else {
          newPage = Math.max(1, adminPageInfo.currentPage - 1);
        }

        await dispatch(getForAdminHisOrders({ id: admin._id, page: newPage }));
      }
    }
  };

  const colorStatus = (color: string) => {
    if (color === 'open') {
      return '#1fc000';
    } else if (color === 'in progress') {
      return '#bbc700';
    } else if (color === 'closed') {
      return '#0028b2';
    } else if (color === 'canceled') {
      return '#b20000';
    }
  };

  return (
    <Accordion sx={{ background: backgroundOrder }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Grid container justifyContent="space-between">
          <Grid item xs={12} sm={12} lg={6} xl={3}>
            <Typography variant="subtitle2">
              {'Заказ'} № {prop.orderArt}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} xl={3}>
            <Typography variant="subtitle2">
              {'Имя заказчика'}:{' '}
              <span style={{ fontWeight: 'bold' }}>
                {prop.firstName} {prop.lastName}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} xl={3}>
            <Typography variant="subtitle2">Дата: {dayjs(prop.createdAt).format('DD-MM-YYYY HH:mm:ss')}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} xl={3}>
            <Typography variant="subtitle2">
              {'Телефон'}: {prop.phoneNumber}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ background: 'WhiteSmoke' }}>
        <Typography>
          Дата: <span style={{ fontWeight: 'bold' }}> {prop.createdAt}</span>
        </Typography>
        <Typography>
          Комментарий: <span style={{ fontWeight: 'bold' }}> {prop.orderComment}</span>
        </Typography>
        <Typography>
          Способ доставки: <span style={{ fontWeight: 'bold' }}> {prop.deliveryMethod}</span>
        </Typography>
        {prop.deliveryMethod === 'доставка' && (
          <Typography>
            Адрес: <span style={{ fontWeight: 'bold' }}>{prop.address}</span>
          </Typography>
        )}
        <Typography>
          Способ оплаты: <span style={{ fontWeight: 'bold' }}> {prop.paymentMethod}</span>
        </Typography>
        <Typography>
          Email: <span style={{ fontWeight: 'bold' }}>{prop.email}</span>
        </Typography>
        <Typography>
          Общая сумма: <span style={{ fontWeight: 'bold' }}>{prop.totalPrice} сом</span>
        </Typography>
        <Typography>
          Статус: <span style={{ color: colorStatus(prop.status), fontWeight: 'bold' }}>{prop.status}</span>
        </Typography>
        {user && (user.role === 'admin' || user.role === 'director') && prop.admin_id && (
          <Typography fontWeight="bolder" color="blueviolet">
            Заказ оформил(а): {prop.admin_id.firstName} {prop.admin_id.lastName}
          </Typography>
        )}
        <Accordion sx={{ mb: 2, background: '#88d8e3' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>Товары: {prop.products.length}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ background: 'WhiteSmoke' }}>
            {prop.products.map((item) => {
              return (
                <Grid
                  key={item.product._id}
                  container
                  justifyContent="space-between"
                  sx={{ p: 1, m: 1, border: '1px solid black', borderRadius: '5px' }}
                >
                  <Grid item xs={12} sm={12} lg={6} xl={3}>
                    <Typography>
                      Артикул: <span style={{ fontWeight: 'bold' }}> {item.product.article}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6} xl={3}>
                    <Typography>
                      Название: <span style={{ fontWeight: 'bold' }}>{item.product.name}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6} xl={3}>
                    <Typography>
                      Количество: <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6} xl={3}>
                    <Typography>
                      Цена: <span style={{ fontWeight: 'bold' }}> {item.product.price}</span>
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </AccordionDetails>
        </Accordion>
        <Grid container spacing={2} justifyContent={'flex-end'}>
          {user && user.role === 'admin' && prop.status === 'open' && (
            <Grid item>
              <Box textAlign="right">
                <LoadingButton
                  variant="contained"
                  loading={buttonLoading === prop._id}
                  size="small"
                  sx={{ background: '#099100' }}
                  onClick={() => handleClickOnCheckout(prop._id)}
                >
                  Оформить заказ
                </LoadingButton>
              </Box>
            </Grid>
          )}
          {user && user.role === 'admin' && prop.status === 'in progress' && (
            <Grid item>
              <Box textAlign="right">
                <LoadingButton
                  variant="contained"
                  loading={buttonLoading === prop._id}
                  color="success"
                  onClick={() => handleClickOnClose(prop._id, 'closed')}
                  size="small"
                  sx={{ background: '#004fb4' }}
                >
                  Закрыть заказ
                </LoadingButton>
              </Box>
            </Grid>
          )}
          {user && user.role === 'admin' && prop.status === 'in progress' && (
            <Grid item>
              <Box textAlign="right">
                <LoadingButton
                  variant="contained"
                  loading={buttonLoading === prop._id}
                  color="error"
                  onClick={() => handleClickOnClose(prop._id, 'canceled')}
                  size="small"
                  sx={{ background: '#b40000' }}
                >
                  Отменить
                </LoadingButton>
              </Box>
            </Grid>
          )}
          {user && user.role === 'director' && !prop.user_id && (
            <Grid item>
              <Button
                onClick={() => setOpenDelete(true)}
                size="small"
                variant="contained"
                color="error"
                sx={{ background: '#CD1818' }}
              >
                Удалить
              </Button>
            </Grid>
          )}
        </Grid>
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogContent>
            <Typography variant="body1">Вы уверены, что хотите удалить выбранный заказ ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>{'Назад'}</Button>
            <LoadingButton
              onClick={() => prop.admin_id && handleDeleteOrder(prop._id, prop.admin_id)}
              loading={deleteOrderLoading === prop._id}
            >
              {'Продолжить'}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderItem;
