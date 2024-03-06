import { Button, Grid, Typography } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import { AccountCircle, LockOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(29,53,4,0.9)',
    },
    secondary: {
      main: 'rgb(255,255,255)',
    },
  },
});

const AnonymousMenu = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container>
          <Grid item mr={1} mb={1} alignItems="center">
            <Button
              component={NavLink}
              to="/register"
              variant="outlined"
              startIcon={<AccountCircle />}
              color="secondary"
              sx={{ ':hover': { color: 'rgba(0,0,0,0.72)' } }}
            >
              <Typography mt={0.5} fontWeight="bold">
                Регистрация
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              sx={{ ':hover': { color: 'rgba(0,0,0,0.72)' } }}
              component={NavLink}
              to="/login"
              variant="outlined"
              startIcon={<LockOutlined />}
              color="secondary"
            >
              <Typography mt={0.5} fontWeight="bold">
                Вход
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AnonymousMenu;
