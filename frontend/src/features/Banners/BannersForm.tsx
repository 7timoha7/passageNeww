import React, { useState } from 'react';
import { Box, Button, Card, CardMedia, Container, Grid, TextField, Typography } from '@mui/material';
import { createBanners, fetchBanners } from './bannersThunks';
import { BannerToServerType } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CloseIcon from '@mui/icons-material/Close';
import { selectCreateBannersLoading } from './bannersSlice';
import { LoadingButton } from '@mui/lab';
import BannersCard from './BannersCard';

const BannersForm = () => {
  const [formData, setFormData] = useState<BannerToServerType>({
    title: '',
    desk: '',
    image: null,
  });

  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreateBannersLoading);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'image' ? files?.[0] || null : value,
    }));
  };

  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: null,
    }));
    // Clear the file input value
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.image) {
      await dispatch(createBanners(formData));
      setFormData({
        title: '',
        desk: '',
        image: null,
      });
      // Clear the file input value after successful submission
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      await dispatch(fetchBanners());
    } else {
      alert('Выберите изображение перед отправкой формы.');
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Создание баннеров
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Заголовок"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Описание"
                fullWidth
                name="desk"
                value={formData.desk}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Assign an id to the file input for easy reference */}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                  id="imageInput"
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageInput">
                  <Button disabled={createLoading} component="span" variant="outlined" color="primary">
                    Выберите картинку
                  </Button>
                </label>
                <span style={{ marginLeft: '10px' }}>{formData.image?.name}</span>
              </div>
            </Grid>
            {formData.image && (
              <Grid item xs={12}>
                <Card style={{ position: 'relative' }}>
                  <CardMedia component="img" alt="Image Preview" image={URL.createObjectURL(formData.image)} />
                  <Button
                    disabled={createLoading}
                    color="primary"
                    onClick={handleRemoveImage}
                    style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(150,135,135,0.45)' }}
                  >
                    <CloseIcon />
                  </Button>
                </Card>
              </Grid>
            )}
            <Grid item xs={12}>
              <LoadingButton loading={createLoading} type="submit" variant="contained" color="primary" fullWidth>
                Создать баннер
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Container>

      <Container maxWidth={'xl'} sx={{ mt: 2 }}>
        <BannersCard />
      </Container>
    </>
  );
};

export default BannersForm;
