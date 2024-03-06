import React, { useState } from 'react';
import {
  Badge,
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBasket, updateBasket } from './basketThunks';
import { selectBasket, selectBasketUpdateLoading } from './basketSlice';
import { selectUser } from '../users/usersSlice';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

const Basket = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // const [stateBasket, setStateBasket] = useState<BasketTypeOnServerMutation | null>(null);
  const dispatch = useAppDispatch();
  const basket = useAppSelector(selectBasket);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const addBasketLoading = useAppSelector(selectBasketUpdateLoading);

  const loadingBasket = () => {
    return !!addBasketLoading;
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleUpdateBasket = async (product_id: string, action: 'increase' | 'decrease' | 'remove') => {
    if (user) {
      await dispatch(updateBasket({ sessionKey: user._id, product_id, action }));
      await dispatch(fetchBasket(user._id));
    } else if (basket?.session_key) {
      await dispatch(updateBasket({ sessionKey: basket.session_key, product_id, action }));
      await dispatch(fetchBasket(basket.session_key));
    }
  };

  const clearBasket = async (action: 'clear') => {
    if (basket?.session_key) {
      await dispatch(updateBasket({ action: action, sessionKey: basket.session_key, product_id: action }));
      await dispatch(fetchBasket(basket.session_key));
      setAnchorEl(null);
    } else if (user) {
      await dispatch(updateBasket({ action: action, sessionKey: user._id, product_id: action }));
      await dispatch(fetchBasket(user._id));
      setAnchorEl(null);
    }
  };

  const navigateToFullBasket = async () => {
    navigate('/basket');
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="Корзина" color="inherit" onClick={handlePopoverOpen}>
        <Badge badgeContent={basket?.items?.length || 0} color="error">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <IconButton aria-label="Закрыть" onClick={handlePopoverClose}>
          <DisabledByDefaultIcon />
        </IconButton>
        <TableContainer>
          <Table>
            <TableBody>
              {basket?.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body1">{item.product.name}</Typography>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      disabled={addBasketLoading === item.product.goodID}
                      color="primary"
                      onClick={() => handleUpdateBasket(item.product.goodID, 'increase')}
                    >
                      {addBasketLoading === item.product.goodID ? (
                        <CircularProgress size={'23px'} color="error" />
                      ) : (
                        <AddCircleOutlineIcon />
                      )}
                    </IconButton>
                    <IconButton
                      disabled={addBasketLoading === item.product.goodID}
                      color="primary"
                      style={{ color: 'black' }} // ваш цвет для кнопок -
                      onClick={() =>
                        item.quantity === 1
                          ? handleUpdateBasket(item.product.goodID, 'remove')
                          : handleUpdateBasket(item.product.goodID, 'decrease')
                      }
                    >
                      {addBasketLoading === item.product.goodID ? (
                        <CircularProgress size={'23px'} color="error" />
                      ) : (
                        <RemoveCircleOutlineIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{`${(item.product.price * item.quantity).toFixed(2)} сом`}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1">Общая сумма: {basket?.totalPrice} сом</Typography>
        </ListItem>
        <Divider />
        <Grid container spacing={2} sx={{ p: 1 }}>
          <Grid item>
            <LoadingButton
              loading={loadingBasket()}
              onClick={() => navigateToFullBasket()}
              variant="outlined"
              color="primary"
            >
              Перейти в корзину
            </LoadingButton>
          </Grid>
          <Grid item>
            <LoadingButton
              loading={loadingBasket()}
              disabled={basket?.items?.length === 0}
              onClick={() => clearBasket('clear')}
              variant="text"
              color="error"
            >
              Очистить корзину
            </LoadingButton>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

export default Basket;
