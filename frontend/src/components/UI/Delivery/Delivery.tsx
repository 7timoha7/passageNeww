import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircleOutline, CancelOutlined, DirectionsCar, AccessTime, MonetizationOn } from '@mui/icons-material';

const Delivery = () => {
  return (
    <>
      <Box
        sx={{
          border: '5px solid rgba(55,52,147,0.82)',
          borderRadius: '10px',
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Правила доставки
        </Typography>
        <Divider />

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutline />
            </ListItemIcon>
            <ListItemText primary="Бесплатная доставка в пределах города" />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText primary="Доставка за городской чертой - 50 сом за километр" />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <DirectionsCar />
            </ListItemIcon>
            <ListItemText primary="Доставка с понедельника по субботу" />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CancelOutlined />
            </ListItemIcon>
            <ListItemText primary="Доставка не осуществляется в воскресенье" />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <AccessTime />
            </ListItemIcon>
            <ListItemText primary="Прием заказов на доставку до 16:00" />
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Delivery;
