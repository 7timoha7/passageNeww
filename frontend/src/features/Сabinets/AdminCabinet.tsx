import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser, selectUsersByRole, selectUsersByRolePageInfo } from '../users/usersSlice';
import { Box, Card, Grid, List, ListItemButton } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import PersonIcon from '@mui/icons-material/Person';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MyInformation from './components/MyInformation';
import { CabinetState } from '../../types';
import GroupIcon from '@mui/icons-material/Group';
import { getByRole } from '../users/usersThunks';
import UserItems from '../users/components/UserItems';
import { someStyle } from '../../styles';
import Favorites from './components/Favorites';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getForAdminHisOrders, getOrders } from '../Order/orderThunks';
import WorkIcon from '@mui/icons-material/Work';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import OrderItems from '../Order/components/OrderItems';
import {
  selectAdminMyOrders,
  selectAdminMyOrdersPageInfo,
  selectOrders,
  selectOrdersPageInfo,
} from '../Order/orderSlice';
import BannersForm from '../Banners/BannersForm';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CategoryIcon from '@mui/icons-material/Category';
import ProductsForPage from '../ProductsFor/components/ProductsForPage';

const initialState: CabinetState = {
  myInfo: true,
  myOrders: false,
  unacceptedOrders: false,
  users: false,
  favorites: false,
  banners: false,
  productsFor: false,
};

interface Props {
  exist?: CabinetState;
}

const AdminCabinet: React.FC<Props> = ({ exist = initialState }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [state, setState] = React.useState<CabinetState>(exist);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const gotUsers = useAppSelector(selectUsersByRole);
  const gotUsersPageInfo = useAppSelector(selectUsersByRolePageInfo);
  const unacceptedOrders = useAppSelector(selectOrders);
  const orders = useAppSelector(selectAdminMyOrders);
  const orderPageInfo = useAppSelector(selectOrdersPageInfo);
  const adminPageInfo = useAppSelector(selectAdminMyOrdersPageInfo);

  useEffect(() => {
    if (user) {
      if (state.users) {
        dispatch(getByRole({ role: 'user', page: 1 }));
      }
      if (state.myOrders) {
        dispatch(getForAdminHisOrders({ id: user._id, page: 1 }));
      }
      if (state.unacceptedOrders) {
        dispatch(getOrders(1));
      }
    }
  }, [dispatch, user, state.users, state.myOrders, state.unacceptedOrders]);

  const handleClickOption = (option: string, index: number) => {
    setState((prev) => ({ ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])), [option]: true }));
    setSelectedIndex(index);
  };

  const options = [
    { option: 'myInfo', icon: <PersonIcon />, text: 'Моя информация' },
    { option: 'users', icon: <GroupIcon />, text: 'Пользователи' },
    { option: 'favorites', icon: <FavoriteIcon />, text: 'Избранное' },
    { option: 'banners', icon: <ViewCarouselIcon />, text: 'Баннер' },
    { option: 'myOrders', icon: <WorkIcon />, text: 'Мои заказы' },
    { option: 'unacceptedOrders', icon: <WorkspacesIcon />, text: 'Непринятые заказы' },
    { option: 'productsFor', icon: <CategoryIcon />, text: 'Сопутствующие товары' },
  ];

  return (
    <Box>
      <Card sx={{ minHeight: '600px' }}>
        <CardContent>
          <Grid container flexDirection="row" spacing={2} alignItems="self-start">
            <Grid item xs={12} sm={6} md={3}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  boxShadow: someStyle.boxShadow,
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                {options.map((option, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedIndex === index}
                    onClick={() => handleClickOption(option.option, index)}
                  >
                    <ListItemIcon style={selectedIndex === index ? { color: '#00ccff' } : {}}>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText style={selectedIndex === index ? { color: '#00ccff' } : {}} primary={option.text} />
                  </ListItemButton>
                ))}
              </List>
            </Grid>
            <Grid item xs>
              {state.myInfo && <MyInformation />}
              {state.users && gotUsersPageInfo && (
                <UserItems gotUsersPageInfo={gotUsersPageInfo} prop={gotUsers} role="user" />
              )}
              {state.favorites && <Favorites />}
              {state.banners && <BannersForm />}
              {state.myOrders && adminPageInfo && user?._id && (
                <OrderItems ordersItems={orders} adminPageInfo={adminPageInfo} id={user._id} />
              )}
              {state.unaccepktedOrders && orderPageInfo && (
                <OrderItems ordersPageInfo={orderPageInfo} ordersItems={unacceptedOrders} />
              )}
              {state.productsFor && <ProductsForPage />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminCabinet;
