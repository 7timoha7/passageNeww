import React from 'react';
import { Box } from '@mui/material';
import Banners from '../features/Banners/Banners';

const MainPage = () => {
  return (
    <>
      <Box
        sx={{
          '@media (max-width:800px)': {
            display: 'none',
          },
        }}
      >
        {/*<PorcelainStoneware />*/}
        <Banners />
      </Box>
    </>
  );
};

export default MainPage;
