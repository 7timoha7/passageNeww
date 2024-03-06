import React from 'react';
import { AppBar, Box, Container, Divider, Grid, Link, Typography } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FooterStyle } from '../../../styles';

const Footer = () => {
  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={FooterStyle}>
        <Container maxWidth={'lg'} sx={{ paddingY: 2 }}>
          <Grid container justifyContent={'space-between'}>
            <Grid item>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: 'black',
                    '&:hover': { color: 'white' },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handlePhoneClick('+996555555555')}
                >
                  <CallIcon />
                  +996 555 555555
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: 'black',
                    '&:hover': { color: 'white' },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handlePhoneClick('+99677777777')}
                >
                  <CallIcon />
                  +996 777 77777
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: 'black',
                    '&:hover': { color: 'white' },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handlePhoneClick('+99650588888')}
                >
                  <CallIcon />
                  +996 505 88888
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: 'black',
                    '&:hover': { color: 'white' },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handleEmailClick('passage@gmail.com')}
                >
                  <EmailIcon />
                  passage@gmail.com
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: 'black',
                    '&:hover': { color: 'white' },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Link
                    href="https://www.instagram.com/passage.kg/"
                    color="inherit"
                    underline="none"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <InstagramIcon />
                    Passage
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Typography sx={{ textAlign: 'end', marginTop: 1, fontSize: '12px', color: '#332f2f' }}>
            Разработчик проекта:{' '}
            <Link
              sx={{ textDecoration: 'none', '&:hover': { color: 'white' } }}
              href="https://summary-topaz.vercel.app/"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Маркелов Артем
            </Link>
          </Typography>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Footer;
