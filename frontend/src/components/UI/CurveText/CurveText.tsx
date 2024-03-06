import React from 'react';
import { Typography } from '@mui/material';

interface Props {
  name: string;
  data?: string | number;
}

const CurveText: React.FC<Props> = ({ name, data }) => {
  return (
    <Typography variant="subtitle1" fontWeight="bold" p={1}>
      {`${name}`}: {data}
    </Typography>
  );
};

export default CurveText;
