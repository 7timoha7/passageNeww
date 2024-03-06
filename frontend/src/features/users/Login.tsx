import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError, selectLoginLoading } from './usersSlice';
import { googleLogin, login } from './usersThunks';
import { Alert, Avatar, Box, Container, Grid, Link, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { LoginMutation } from '../../types';
import { GoogleLogin } from '@react-oauth/google';
import 'react-phone-input-2/lib/style.css';
import RestorePassword from './components/RestorePassword';

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();

  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login(state)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const googleLoginHandler = async (credentials: string) => {
    await dispatch(googleLogin(credentials)).unwrap();
    await navigate('/');
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#62b8ee' }}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Войти
        </Typography>
        <Box sx={{ pt: 2 }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                void googleLoginHandler(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log('Login failed');
            }}
          />
        </Box>
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {error && error.error === 'Email incorrect' && (
                <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
                  {'Не верный Email'}
                </Alert>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Email'}
                name="email"
                type="email"
                autoComplete="current-email"
                value={state.email}
                onChange={inputChangeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              {error && error.error === 'Password incorrect' && (
                <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
                  {'Не верный пароль'}
                </Alert>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Пароль'}
                name="password"
                type="password"
                autoComplete="current-password"
                value={state.password}
                onChange={inputChangeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <RestorePassword />
            </Grid>
          </Grid>
          <LoadingButton
            color="primary"
            type="submit"
            loading={loading}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {'Войти'}
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {'Регистрация'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
