import { Alert, Button, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import NoFoundPage from '../NoFoundPage/NoFoundPage';
import { sendMail } from '../../../features/users/usersThunks';
import Collapse from '@mui/material/Collapse';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ModalCover from '../ModalCover/ModalCover';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';

const VerifyPage = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [open] = useState(true);
  const onButtonClick = async () => {
    await dispatch(sendMail());
    setActive(true);
  };

  const goBack = () => {
    navigate(-2);
  };

  return (
    <Container>
      {user && !user.isVerified ? (
        <>
          <ModalCover state={open}>
            <Typography sx={{ display: 'inline-block' }} variant="body1" textAlign="center">
              {'Вы не подтвердили свой email'}, {'для получения письма подтверждения нажмите на кнопку'}
            </Typography>
            <Button variant="outlined" onClick={onButtonClick} disabled={active}>
              {'Отправить письмо'}
            </Button>
            <Collapse in={active}>
              <Alert
                iconMapping={{
                  success: <CheckCircleOutlineIcon fontSize="inherit" />,
                }}
              >
                {'Письмо успешно отправленно, проверьте свой почтовый ящик. Папку входящие или Спам'}
              </Alert>
            </Collapse>
            <Button
              variant="contained"
              color="success"
              size="small"
              style={{ margin: '10px auto', display: 'block', background: '#dc0b0b', marginTop: '10px' }}
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

export default VerifyPage;
