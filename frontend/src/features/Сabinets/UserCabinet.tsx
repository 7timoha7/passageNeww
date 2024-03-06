import React, { useEffect } from 'react';
import { Card, CardContent, Grid, List } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MyInformation from './components/MyInformation';
import { CabinetState } from '../../types';
import { someStyle } from '../../styles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Favorites from './components/Favorites';
import { selectOrders, selectOrdersPageInfo } from '../Order/orderSlice';
import { getOrders } from '../Order/orderThunks';
import OrderItems from '../Order/components/OrderItems';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';

const initialState: CabinetState = {
  orders: false,
  favorites: false,
  myInfo: true,
};

interface Props {
  exist?: CabinetState;
}

const UserCabinet: React.FC<Props> = ({ exist = initialState }) => {
  const dispatch = useAppDispatch();
  const [state, setState] = React.useState<CabinetState>(exist);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const orders = useAppSelector(selectOrders);
  const orderPageInfo = useAppSelector(selectOrdersPageInfo);

  useEffect(() => {
    if (state.orders) {
      dispatch(getOrders(1));
    }
  }, [dispatch, state.orders]);

  const options = [
    { option: 'myInfo', icon: <PersonIcon />, text: 'Моя информация' },
    { option: 'orders', icon: <AssignmentIcon />, text: 'Мои заказы' },
    { option: 'favorites', icon: <FavoriteIcon />, text: 'Избранное' },
  ];

  const handleClickOption = (option: string, index: number) => {
    setState((prev) => ({ ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])), [option]: true }));
    setSelectedIndex(index);
  };

  return (
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
                  <ListItemIcon style={selectedIndex === index ? { color: '#00ccff' } : {}}>{option.icon}</ListItemIcon>
                  <ListItemText style={selectedIndex === index ? { color: '#00ccff' } : {}} primary={option.text} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs>
            {state.myInfo && <MyInformation />}
            {state.favorites && <Favorites />}
            {state.orders && orderPageInfo && <OrderItems ordersPageInfo={orderPageInfo} ordersItems={orders} />}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCabinet;
