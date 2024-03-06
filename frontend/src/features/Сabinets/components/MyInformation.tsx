import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Box, Paper, Typography } from '@mui/material';
import { reAuthorization } from '../../users/usersThunks';
import { selectUser } from '../../users/usersSlice';
import ChangePassword from './ChangePassword';
import { someStyle } from '../../../styles';
import CurveText from '../../../components/UI/CurveText/CurveText';
import { useEffect } from 'react';
import ChatIdAdminForm from './ChatIdAdminForm';

const MyInformation = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reAuthorization());
  }, [dispatch]);

  return (
    <Paper elevation={4} sx={{ minHeight: '300px', boxShadow: someStyle.boxShadow, p: 2 }}>
      {user && (
        <>
          <Box textAlign="center">
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
          {user.role === 'admin' && <CurveText name="Статус" data={user.role} />}
          <CurveText name="Телефон" data={user.phoneNumber} />
          <CurveText name="Почта" data={user.email} />
          {user.role === 'admin' && <ChatIdAdminForm user={user} />}
          <ChangePassword />
        </>
      )}
    </Paper>
  );
};

export default MyInformation;
