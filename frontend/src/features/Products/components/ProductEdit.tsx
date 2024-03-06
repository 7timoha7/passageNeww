import React, { useEffect, useState } from 'react';
import { Box, Card, Container, Grid, IconButton, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import { ImgType, ProductTypeMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLoadingEditProduct, selectProductError, selectProductLoading, selectProductOne } from '../productsSlise';
import { useNavigate, useParams } from 'react-router-dom';
import { editProduct, productFetch, removeProductImage } from '../productsThunks';
import Spinner from '../../../components/UI/Spinner/Spinner';
import FileInput from '../../../components/UI/FileInput/FileInput';
import { apiURL } from '../../../constants';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import { LoadingButton } from '@mui/lab';

const ProductEdit = () => {
  const [state, setState] = useState<ProductTypeMutation>({
    _id: '',
    name: '',
    ownerID: '',
    images: [],
    price: 0,
    article: '',
    goodID: '',
    measureCode: '',
    measureName: '',
    quantity: [],
  });

  const [stateImg, setStateImg] = useState<ImgType>({
    image: null,
  });

  const dispatch = useAppDispatch();
  const error = useAppSelector(selectProductError);
  const loadingFetchOneProduct = useAppSelector(selectProductLoading);
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const oneProduct = useAppSelector(selectProductOne);
  const loadingEditProduct = useAppSelector(selectLoadingEditProduct);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    dispatch(productFetch(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (oneProduct) {
      setState((prevState) => ({
        ...prevState,
        _id: oneProduct._id,
        name: oneProduct.name,
        ownerID: oneProduct.ownerID,
        quantity: oneProduct.quantity,
        measureName: oneProduct.measureName,
        goodID: oneProduct.goodID,
        article: oneProduct.article,
        measureCode: oneProduct.measureCode,
        price: oneProduct.price,
      }));
    }
  }, [oneProduct, setState]);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const fileInputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files) {
      setStateImg((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const onClickAdd = async () => {
    if (stateImg.image) {
      const mass = state.images;
      mass?.push(stateImg.image);
      setState((prev) => ({ ...prev, images: mass }));
    }
  };

  const deleteImg = (index: number) => {
    const mass = state.images;
    mass?.splice(index, 1);
    setState({
      ...state,
      images: mass,
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(editProduct(state));
    navigate('/product/' + state._id);
  };

  const deleteOldImg = async (productId: string, imageIndex: number) => {
    await dispatch(removeProductImage({ productId, imageIndex }));
    await dispatch(productFetch(productId));
  };

  return (
    <>
      {loadingFetchOneProduct ? (
        <Spinner />
      ) : (
        <Container maxWidth="sm">
          <Typography
            component="div"
            variant="h5"
            textTransform="capitalize"
            color="black"
            sx={{ mt: 2 }}
            textAlign={'center'}
          >
            Изменить продукт
          </Typography>
          <Box component="form" sx={{ mt: 2 }} onSubmit={onSubmit}>
            <Grid container spacing={2} textAlign="center" direction="column">
              <Card sx={{ mt: 5, p: 3 }}>
                <Grid item xs>
                  <TextField
                    label={'Имя'}
                    type={'text'}
                    name="name"
                    autoComplete="current-place"
                    onChange={inputChangeHandler}
                    value={state.name}
                    required
                  />
                </Grid>
              </Card>
              <Card sx={{ mt: 5, p: 3 }}>
                <Grid item xs>
                  <FileInput
                    label={'Картинка'}
                    onChange={fileInputChangeHandler}
                    name="image"
                    type="images/*"
                    error={error}
                  />
                  <Grid container justifyContent={'end'} mt={3}>
                    <Grid item>
                      <IconButton onClick={onClickAdd} disabled={!stateImg.image} color={'success'}>
                        <DownloadSharpIcon fontSize="large" />
                        <Typography>{'Загрузить'}</Typography>
                      </IconButton>
                    </Grid>
                    <Grid container direction="column">
                      <Grid item xs>
                        {oneProduct?.images &&
                          oneProduct.images.map((image, index) => (
                            <Grid container key={index} marginLeft={3} mb={2} alignItems={'center'}>
                              <img src={apiURL + '/' + image} style={{ width: '100px' }} alt={image} />
                              <Grid item ml={3}>
                                <IconButton onClick={() => deleteOldImg(id, index)}>
                                  <DeleteForeverSharpIcon sx={{ color: 'rgba(230,17,17,0.87)' }} />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                      </Grid>
                      <Grid item xs>
                        {state.images &&
                          state.images.length > 0 &&
                          state.images.map((image, index) => (
                            <Grid container key={index} marginLeft={3} mb={2} alignItems={'center'}>
                              <img src={URL.createObjectURL(image)} style={{ width: '100px' }} alt={image.name} />
                              <Grid item ml={3}>
                                <IconButton onClick={() => deleteImg(index)}>
                                  <DeleteForeverSharpIcon sx={{ color: 'rgba(230,17,17,0.87)' }} />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
              <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                <Grid item>
                  <LoadingButton type="submit" color="success" variant="contained" loading={loadingEditProduct}>
                    Изменить
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <LoadingButton
                    onClick={goBack}
                    type="button"
                    color="warning"
                    variant="contained"
                    loading={loadingEditProduct}
                  >
                    Назад
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </>
  );
};

export default ProductEdit;
