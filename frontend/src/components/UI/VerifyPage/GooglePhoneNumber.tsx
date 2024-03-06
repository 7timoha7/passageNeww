import React, { useState } from 'react';
import ModalCover from '../ModalCover/ModalCover';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import NoFoundPage from '../NoFoundPage/NoFoundPage';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import { useNavigate } from 'react-router-dom';
import { googlePhoneNumber } from '../../../features/users/usersThunks';
import ReactPhoneInput from 'react-phone-input-2';

const GooglePhoneNumber = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  const goBack = () => {
    navigate(-2);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user) {
      await dispatch(googlePhoneNumber(phoneNumber));
      await navigate('/my-cabinet');
    }
  };

  return (
    <Container>
      {user && user.phoneNumber === '000' ? (
        <>
          <ModalCover state={open}>
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography sx={{ display: 'inline-block', mb: 2 }} variant="body1" textAlign="center">
                {'Для входа в личный кабинет , вам необходимо ввести номер телефона.'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box>
                  <ReactPhoneInput
                    inputProps={{
                      name: 'phoneNumber',
                      required: true,
                      autoFocus: true,
                    }}
                    country={'kg'}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                  />
                </Box>
                <Button variant="contained" type="submit" sx={{ mt: 3 }} disabled={phoneNumber.length < 8}>
                  {'Подтвердить'}
                </Button>
              </form>
            </Card>
            <Button
              variant="contained"
              color="success"
              size="small"
              style={{ margin: '10px auto', display: 'block', background: '#03C988' }}
              onClick={goBack}
            >
              {'Назад'}
            </Button>
          </ModalCover>
        </>
      ) : (
        <NoFoundPage />
      )}
    </Container>
  );
};

export default GooglePhoneNumber;
