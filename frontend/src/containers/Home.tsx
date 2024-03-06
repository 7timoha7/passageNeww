import Layout from '../components/UI/Layout/Layout';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import WhatsAppButton from '../components/UI/WhatsAppButton/WhatsAppButton';

const Home = () => {
  return (
    <>
      <CssBaseline />
      <Layout>
        <WhatsAppButton />
        <Outlet />
      </Layout>
    </>
  );
};

export default Home;
