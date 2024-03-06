import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import React from 'react';
import { ToolBarStylesTop, ToolBarTopText } from '../../../../styles';
import { useMediaQuery } from '@mui/material';

interface Props {
  close?: () => void;
}

const NavigateTop: React.FC<Props> = ({ close }) => {
  const menu = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Новинки',
      link: '/productsNews',
    },
    {
      name: 'Доставка',
      link: '/delivery',
    },
    {
      name: 'Контакты',
      link: '/contacts',
    },
    {
      name: 'О нас',
      link: '/about',
    },
  ];

  const isMobile = useMediaQuery('(max-width:760px)');

  return (
    <Box display="flex" justifyContent={!isMobile ? 'center' : 'start'} alignItems={'center'} sx={ToolBarStylesTop}>
      {menu.map((item) => (
        <Button onClick={close} component={Link} to={item.link} sx={ToolBarTopText} key={item.name}>
          {item.name}
        </Button>
      ))}
    </Box>
  );
};

export default NavigateTop;
