import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { ProductType } from '../../../types';
import noImage from '../../../assets/images/no_image.jpg';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { apiURL, placeHolderImg } from '../../../constants';
import { selectFetchFavoriteProductsOneLoading, selectUser } from '../../users/usersSlice';
import { changeFavorites, reAuthorization } from '../../users/usersThunks';
import { getFavoriteProducts } from '../productsThunks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { fetchBasket, updateBasket } from '../../Basket/basketThunks';
import { selectPageInfo } from '../productsSlise';
import { selectBasketUpdateLoading } from '../../Basket/basketSlice';
import { CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LoadingButton } from '@mui/lab';
import { createBestseller, deleteBestseller, fetchBestsellers } from '../../Bestsellers/bestsellersThunks';
import {
  selectBestsellers,
  selectCreateBestsellersLoading,
  selectDeleteBestsellersLoading,
} from '../../Bestsellers/bestsellersSlice';

interface Props {
  product: ProductType;
  indicator?: boolean;
  newsSize?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, indicator, newsSize }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const sessionKey = localStorage.getItem('sessionKey');
  const pageInfo = useAppSelector(selectPageInfo);
  const addBasketLoading = useAppSelector(selectBasketUpdateLoading);
  const favoriteLoading = useAppSelector(selectFetchFavoriteProductsOneLoading);

  const handleAddToCart = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.persist(); // сохраняем событие
    if (sessionKey) {
      await dispatch(
        updateBasket({
          sessionKey: sessionKey,
          product_id: product.goodID,
          action: 'increase',
        }),
      );
      await dispatch(fetchBasket(sessionKey));
    } else if (user) {
      await dispatch(
        updateBasket({
          sessionKey: '1',
          product_id: product.goodID,
          action: 'increase',
        }),
      );
      await dispatch(fetchBasket('1'));
    }
  };
  const onClickFavorite = async (id: string) => {
    if (!favorite) {
      await dispatch(changeFavorites({ addProduct: id }));
      await dispatch(reAuthorization());
    } else {
      await dispatch(changeFavorites({ deleteProduct: id }));
      await dispatch(reAuthorization());
      await dispatch(getFavoriteProducts(1));
      if (pageInfo) {
        let newPage: number;
        if ((pageInfo.totalItems - 1) % pageInfo.pageSize !== 0) {
          newPage = pageInfo.currentPage;
        } else {
          newPage = Math.max(1, pageInfo.currentPage - 1);
        }
        await dispatch(getFavoriteProducts(newPage));
      }
    }
  };

  const favorite =
    (user?.role === 'user' || user?.role === 'director' || user?.role === 'admin') &&
    user.favorites.includes(product.goodID);

  let imgProduct = noImage;
  if (product.images.length) {
    imgProduct = apiURL + product.images[0];
  }

  const addBestsellerBtn = async () => {
    await dispatch(createBestseller(product.goodID));
    await dispatch(fetchBestsellers());
  };

  const deleteBestsellerBtn = async () => {
    await dispatch(deleteBestseller(product.goodID));
    await dispatch(fetchBestsellers());
  };

  const bestsellers = useAppSelector(selectBestsellers);
  const bestsellersAddLoading = useAppSelector(selectCreateBestsellersLoading);
  const bestsellersDeleteLoading = useAppSelector(selectDeleteBestsellersLoading);

  const bestsellerAdded = () => {
    let flag = false;
    if (bestsellers.length) {
      bestsellers.forEach((item) => {
        if (item.goodID === product.goodID) {
          flag = true;
        }
      });
    }

    return flag;
  };

  const onClickCard = () => {
    // dispatch(setProductsForID(product.ownerID));
    navigate('/product/' + product._id);
  };

  return (
    <Box
      sx={{
        height: newsSize ? '405px' : '100%',
      }}
    >
      <Card
        onClick={() => onClickCard()}
        sx={{
          height: '100%',
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: indicator ? 'none' : '0px 0px 3px 3px rgba(0,200,255,1)',
          },
          '@media (max-width:600px)': {
            width: '200px',
          },
          '@media (max-width:480px)': {
            width: '180px',
          },
          '@media (max-width:420px)': {
            width: '165px',
          },
          '@media (max-width:400px)': {
            width: '290px',
          },
        }}
      >
        <LazyLoadImage
          effect="blur" // можно изменить на 'opacity' или другой
          src={imgProduct}
          alt="Product"
          height={200}
          width="100%"
          placeholderSrc={placeHolderImg}
          style={{ objectFit: 'contain' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            cursor: 'pointer',
            padding: '8px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClickFavorite(product.goodID).then((r) => r);
          }}
        >
          {user &&
            user.isVerified &&
            (user.role === 'user' || user.role === 'director' || user.role === 'admin') &&
            (favorite ? (
              favoriteLoading === product.goodID ? (
                <CircularProgress size={'20px'} color="error" />
              ) : (
                <FavoriteIcon color="error" />
              )
            ) : favoriteLoading === product.goodID ? (
              <CircularProgress size={'20px'} color="error" />
            ) : (
              <FavoriteBorderIcon />
            ))}
        </Box>
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box>
            <Typography variant="body2" color="black">
              {product.name}
            </Typography>
          </Box>

          <Typography color="red">{product.price + ' сом'}</Typography>
          <Box
            sx={{
              marginTop: 'auto',
              alignSelf: 'flex-end',
            }}
          >
            {addBasketLoading !== product.goodID ? (
              <Tooltip title={indicator ? 'Товар уже в корзине' : 'Добавить в корзину'} arrow placement="top">
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!indicator) {
                      handleAddToCart(e).then((r) => r);
                    }
                  }}
                  sx={{
                    cursor: indicator ? 'not-allowed' : 'pointer',
                  }}
                >
                  <AddShoppingCartIcon
                    fontSize="large"
                    color={indicator ? 'disabled' : indicator ? 'error' : 'inherit'}
                  />
                </Box>
              </Tooltip>
            ) : (
              <CircularProgress size={'20px'} color="error" />
            )}
          </Box>
        </CardContent>
        {user?.role === 'admin' && (
          <>
            {!bestsellerAdded() ? (
              <LoadingButton
                loading={bestsellersAddLoading}
                color={'success'}
                disabled={bestsellerAdded()}
                onClick={(e) => {
                  e.stopPropagation();
                  addBestsellerBtn().then((r) => r);
                }}
              >
                Добавить в хиты продаж
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={bestsellersDeleteLoading}
                color={'error'}
                disabled={!bestsellerAdded()}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBestsellerBtn().then((r) => r);
                }}
              >
                Удалить из хиты продаж
              </LoadingButton>
            )}
          </>
        )}
      </Card>
    </Box>
  );
};

export default ProductCard;
