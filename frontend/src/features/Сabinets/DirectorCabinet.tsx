import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getByRole } from '../users/usersThunks';
import { selectGetUsersByRoleLoading, selectUsersByRole, selectUsersByRolePageInfo } from '../users/usersSlice';
import { Box, Card, CardContent, Grid, List, Typography } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { CabinetState } from '../../types';
import UserItems from '../users/components/UserItems';
import WcIcon from '@mui/icons-material/Wc';
import MyInformation from './components/MyInformation';
import { someStyle } from '../../styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Favorites from './components/Favorites';
import UpdateBase from './components/UpdateBase';
import ReportsAdmins from './components/ReportsAdmins';
import AssignmentIcon from '@mui/icons-material/Assignment';

const initialState: CabinetState = {
  myInfo: true,
  simpleUsers: false,
  admins: false,
  favorites: false,
  update: false,
  reportsAdmins: false,
};

interface Props {
  exist?: CabinetState;
}

const DirectorCabinet: React.FC<Props> = ({ exist = initialState }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGetUsersByRoleLoading);
  const gotUsers = useAppSelector(selectUsersByRole);
  const gotUsersPageInfo = useAppSelector(selectUsersByRolePageInfo);

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [state, setState] = React.useState<CabinetState>(exist);

  useEffect(() => {
    if (state.simpleUsers) {
      dispatch(getByRole({ role: 'user', page: 1 }));
    } else if (state.admins) {
      dispatch(getByRole({ role: 'admin', page: 1 }));
    } else if (state.reportsAdmins) {
      dispatch(getByRole({ role: 'admin', page: 1 }));
    }
  }, [dispatch, state.simpleUsers, state.admins, state.reportsAdmins]);

  const options = [
    { option: 'myInfo', icon: <PersonIcon />, text: 'Моя информация' },
    { option: 'update', icon: <AutorenewIcon color={'success'} />, text: 'Обновление базы с 1С' },
    { option: 'simpleUsers', icon: <GroupIcon />, text: 'Пользователи' },
    { option: 'admins', icon: <WcIcon />, text: 'Админы' },
    { option: 'reportsAdmins', icon: <AssignmentIcon />, text: 'Отчеты админов' },
    { option: 'favorites', icon: <FavoriteIcon />, text: 'Избранное' },
  ];

  const handleClickOption = (option: string, index: number) => {
    setState((prev) => ({ ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])), [option]: true }));
    setSelectedIndex(index);
  };

  return (
    <Box mt={3}>
      {loading && <Typography>loading...</Typography>}
      <Card sx={{ minHeight: '600px' }}>
        <CardContent>
          <Grid container flexDirection="row" spacing={2} alignItems="self-start">
            <Grid item xs={12} sm={6} md={3}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  boxShadow: someStyle.boxShadow,
                  paddingRight: '5px',
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
              {state.update && <UpdateBase />}
              {state.simpleUsers && gotUsersPageInfo && (
                <UserItems gotUsersPageInfo={gotUsersPageInfo} prop={gotUsers} role="user" />
              )}
              {state.admins && gotUsersPageInfo && (
                <UserItems gotUsersPageInfo={gotUsersPageInfo} prop={gotUsers} role="admin" />
              )}
              {state.reportsAdmins && gotUsersPageInfo && (
                <ReportsAdmins gotUsersPageInfo={gotUsersPageInfo} admins={gotUsers} />
              )}
              {state.favorites && <Favorites />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DirectorCabinet;
