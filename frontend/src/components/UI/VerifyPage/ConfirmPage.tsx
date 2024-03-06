import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { reAuthorization, verify } from '../../../features/users/usersThunks';
import { Button, Container, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

const ConfirmPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navigateToCabinet = useCallback(async () => {
    await dispatch(reAuthorization());
    navigate('/my-cabinet');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (token) {
      dispatch(verify(token));
    }
    setTimeout(navigateToCabinet, 5000);
  }, [dispatch, token, navigateToCabinet]);
  return (
    <Container>
      <Typography sx={{ display: 'inline-block' }} variant="h5">
        {'Вы будете автоматически переведены в свой кабинет через 5 сек. . .  или вы можете перейти самостоятельно :'}
      </Typography>{' '}
      <Button onClick={navigateToCabinet} variant="text" color="primary">
        {'перейти'}
      </Button>
    </Container>
  );
};

export default ConfirmPage;
