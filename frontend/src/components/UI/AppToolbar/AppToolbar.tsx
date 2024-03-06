import { AppBar, Box, Container, Grid, styled, Toolbar, useMediaQuery } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import { NavLink } from 'react-router-dom';
import { ToolBarMobileStyles, ToolBarStyles } from '../../../styles';
import NavigateTop from './NavigateTop/NavigateTop';
import Search from './NavigateTop/Components/Search';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';
import React from 'react';
import Basket from '../../../features/Basket/Basket';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  const isMobile = useMediaQuery('(max-width:760px)');

  const Link = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: 'inherit',
    },
  });
  return (
    <Box mb={3} sx={{ flexGrow: 1, margin: 0 }}>
      {!isMobile && <NavigateTop />}

      <AppBar position="sticky" sx={!isMobile ? ToolBarStyles : ToolBarMobileStyles}>
        <Toolbar>
          <Container maxWidth="xl">
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ '@media (max-width: 550px)': { justifyContent: 'center' } }}
            >
              <Grid item>
                <Link to="/" style={{ margin: 'auto' }}>
                  <img style={{ maxWidth: '150px' }} src="/logo.svg" alt="passage" />
                </Link>
              </Grid>

              <Grid item sx={{ flexGrow: 1, minWidth: 0 }}>
                <Search />
              </Grid>
              <Grid item>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Grid>
              <Grid item>
                <Basket />
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppToolbar;
