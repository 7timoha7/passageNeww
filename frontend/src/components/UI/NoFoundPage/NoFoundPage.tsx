import notFoundImage from '../../../assets/images/not_found.png';
import React from 'react';

const NoFoundPage = () => {
  return (
    <img
      src={notFoundImage}
      alt="not found"
      style={{ marginTop: '7px', width: '100%', height: 'auto', borderRadius: '25px' }}
    />
  );
};

export default NoFoundPage;
