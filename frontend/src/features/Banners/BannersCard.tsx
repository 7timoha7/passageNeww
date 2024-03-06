import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBanners, selectDeleteBannersLoading, selectFetchBannersLoading } from './bannersSlice';
import { deleteBanners, fetchBanners } from './bannersThunks';
import Spinner from '../../components/UI/Spinner/Spinner';
import Card from '@mui/material/Card';
import { Grid, IconButton, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { apiURL, placeHolderImg } from '../../constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const BannersCard = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const loadingBanners = useAppSelector(selectFetchBannersLoading);
  const deleteLoading = useAppSelector(selectDeleteBannersLoading);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const deleteBanner = async (id: string) => {
    await dispatch(deleteBanners(id));
    await dispatch(fetchBanners());
  };

  return (
    <>
      {loadingBanners ? (
        <Spinner />
      ) : (
        <>
          <Grid container spacing={1} justifyContent={'center'}>
            {banners.map((item) => (
              <Grid item key={item._id}>
                <Card
                  sx={{
                    position: 'relative',
                    maxWidth: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '@media (max-width:600px)': {
                      width: '200px',
                    },
                    '@media (max-width:480px)': {
                      width: '170px',
                    },
                    '@media (max-width:420px)': {
                      width: '165px',
                    },
                    '@media (max-width:400px)': {
                      width: '100%',
                    },
                  }}
                >
                  <LazyLoadImage
                    effect="blur" // можно изменить на 'opacity' или другой
                    src={apiURL + '/' + item.image}
                    alt="Product"
                    height={150}
                    width="100%"
                    placeholderSrc={placeHolderImg}
                    style={{ objectFit: 'contain' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography fontSize={'small'} color="text.secondary">
                      {item.desk}
                    </Typography>
                  </CardContent>
                  <IconButton
                    sx={{ position: 'absolute', top: '0', right: '0' }}
                    disabled={deleteLoading}
                    color={'error'}
                    onClick={() => deleteBanner(item._id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};
export default BannersCard;
