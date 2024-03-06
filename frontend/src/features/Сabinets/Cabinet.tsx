import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import UserCabinet from './UserCabinet';
import AdminCabinet from './AdminCabinet';
import { Navigate } from 'react-router-dom';
import DirectorCabinet from './DirectorCabinet';
import React from 'react';
import { JSX } from 'react/jsx-runtime';

const Cabinet = () => {
  const user = useAppSelector(selectUser);

  let showCabinet: JSX.Element;

  switch (user?.role) {
    case 'user':
      showCabinet = <UserCabinet />;
      break;
    case 'admin':
      showCabinet = <AdminCabinet />;
      break;
    case 'director':
      showCabinet = <DirectorCabinet />;
      break;
    default:
      showCabinet = <Navigate to="/login" />;
  }

  return <div>{showCabinet}</div>;
};

export default Cabinet;
