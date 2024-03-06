import { Grid, Paper, Typography } from '@mui/material';
import advantages1 from '../../../assets/images/advantages/advantage_1.png';
import advantages2 from '../../../assets/images/advantages/advantage_2.png';
import advantages3 from '../../../assets/images/advantages/advantage_3.png';
import React from 'react';

const AboutPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        О нас
      </Typography>
      <Typography variant="body1" paragraph>
        Сеть шоурумов Passage является официальным представителем ведущих мировых брендов - RAK ceramics, KLUDI RAK, RAK
        porcelain, Vitra. RAK ceramics - является одним из крупнейших керамических брендов в мире. Специализируясь на
        настенной и напольной плитке из керамического гранита и сантехнике, Rak ceramics производит 118 миллионов м2
        плитки и 5.7 миллионов сантехнических изделий.
      </Typography>
      <Typography variant="body1" paragraph>
        KLUDI RAK – сантехника с беспрецедентной гарантией в 10 лет! В сочетании с лучшими немецкими технологиями и
        процессами обеспечения качества, современными европейским оборудованием, KLUDI RAK предлагает долговечную
        сантехнику, которая радует многих клиентов.
      </Typography>
      <Typography variant="body1" paragraph>
        RAK porcelain — это новое сочетание качества, долговечности и эстетики, состоящее из изысканных столовых
        приборов, модной посуды и эргономичных кухонных аксессуаров, которые обеспечивают уникальные впечатления от еды.
      </Typography>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Преимущества RAK ceramics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <img src={advantages3} alt="Преимущество 1" style={{ width: '100%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <img src={advantages2} alt="Преимущество 2" style={{ width: '100%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <img src={advantages1} alt="Преимущество 3" style={{ width: '100%', height: 'auto' }} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AboutPage;
