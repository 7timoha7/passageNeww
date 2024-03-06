import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import React from 'react';
import { ProductsNewsBorderStyles } from '../../../styles';

const ContactsPage = () => {
  const theme = useTheme();

  useEffect(() => {
    const apiKey = 'YOUR_API_KEY';

    const loadMap = (id: string, center: number[], popupContent: string, link: string) => {
      (window as any).DG.then(() => {
        const map = (window as any).DG.map(id, {
          center: center,
          zoom: 15,
        });

        const popup = (window as any).DG.popup(center).setContent(
          `${popupContent}<br><a href="${link}" target="_blank" rel="noopener noreferrer">Открыть в 2ГИС</a>`,
        );

        (window as any).DG.marker(center).addTo(map).bindPopup(popup).openPopup();
      });
    };

    const script = document.createElement('script');
    script.src = `https://maps.api.2gis.ru/2.0/loader.js?key=${apiKey}`;
    script.async = true;
    script.onload = () => {
      loadMap(
        'map1',
        [42.864777, 74.630775],
        `
      <strong>Passage - Матросова, 1/2</strong><br>
      График работы:<br>
      ПН-СБ: С 09:00 - 18:00<br>
      ВС: С 10:00 - 15:00<br>
      <strong>Телефоны:</strong><br>
      0 997 100 500<br>
      0 553 100 500
    `,
        'https://2gis.kg/bishkek/firm/70000001059206763?m=74.630806%2C42.86478%2F17&utm_source=details&utm_medium=widget&utm_campaign=firmsonmap',
      );

      loadMap(
        'map2',
        [42.859199, 74.619065],
        `
      <strong>Passage - Кулатова, 8 — 2 этаж</strong><br>
      График работы:<br>
      ПН-СБ: С 09:00 - 18:00<br>
      ВС: С 10:00 - 16:00<br>
      <strong>Телефон:</strong><br>
      0 997 100 500
    `,
        'https://2gis.kg/bishkek/firm/70000001061184205?m=74.619007%2C42.859134%2F17&utm_source=details&utm_medium=widget&utm_campaign=firmsonmap',
      );
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Box
      sx={{
        border: ProductsNewsBorderStyles,
        borderRadius: '10px',
        p: 2,
      }}
    >
      <Typography variant="h4" fontWeight={'bold'} style={{ marginLeft: '2%' }}>
        Контакты
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: theme.spacing(2), mt: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            sx={{
              padding: theme.spacing(2),
              textAlign: 'center',
              marginBottom: theme.spacing(2),
              height: '100%',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Passage - Матросова, 1/2
            </Typography>
            <Paper id="map1" sx={{ width: '100%', height: ['250px', '400px'] }}></Paper>
            <Typography variant="body2" sx={{ marginTop: theme.spacing(2) }}>
              <strong>График работы:</strong>
              <br />
              ПН-СБ: С 09:00 - 18:00
              <br />
              ВС: С 10:00 - 15:00
              <br />
              <strong>Телефоны:</strong>
              <br />
              0 997 100 500
              <br />0 553 100 500
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            sx={{
              padding: theme.spacing(2),
              textAlign: 'center',
              marginBottom: theme.spacing(2),
              height: '100%',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Passage - Кулатова, 8 — 2 этаж
            </Typography>
            <Paper id="map2" sx={{ width: '100%', height: ['250px', '400px'] }}></Paper>
            <Typography variant="body2" sx={{ marginTop: theme.spacing(2) }}>
              <strong>График работы:</strong>
              <br />
              ПН-СБ: С 09:00 - 18:00
              <br />
              ВС: С 10:00 - 16:00
              <br />
              <strong>Телефон:</strong>
              <br />0 997 100 500
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactsPage;
