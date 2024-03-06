import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Stack, useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import { BasketTypeOnServerMutation, CategoriesType, ProductType } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import ProductCard from './ProductCard';
import { selectBasket } from '../../Basket/basketSlice';
import { productsFetch } from '../productsThunks';
import { selectPageInfo, selectProductsState } from '../productsSlise';

interface Props {
  categoryName: CategoriesType | null;
}

const Products: React.FC<Props> = ({ categoryName }) => {
  const [name, setName] = useState('');
  const [stateBasket, setStateBasket] = useState<BasketTypeOnServerMutation | null>(null);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const productsInCategory = useAppSelector(selectProductsState);
  const basket = useAppSelector(selectBasket);
  const pageInfo = useAppSelector(selectPageInfo);

  useEffect(() => {
    if (basket) {
      setStateBasket(basket);
    }
  }, [basket]);

  useEffect(() => {
    if (id) {
      dispatch(productsFetch({ id, page: 1 }));
    }
    if (categoryName) {
      setName(categoryName.name);
    }
  }, [categoryName, dispatch, id]);

  const indicator = (item: ProductType) => {
    if (stateBasket && item) {
      return stateBasket.items.some((itemBasket) => itemBasket.product.goodID === item.goodID);
    } else {
      return false;
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(productsFetch({ id: id || '', page }));
  };

  const renderPagination = () => {
    if (pageInfo && pageInfo.totalPages > 1) {
      return (
        <Box display="flex" justifyContent="center">
          <Stack spacing={2}>
            <Pagination
              showFirstButton
              showLastButton
              count={pageInfo.totalPages}
              page={pageInfo.currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size={'small'}
            />
          </Stack>
        </Box>
      );
    }
    return null;
  };

  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <Box>
      <Box textAlign="center" mb={2}>
        <Typography variant="h4" fontWeight={'bold'} style={{ marginLeft: '2%' }}>
          {name}
        </Typography>
      </Box>

      {renderPagination()}

      <Grid container spacing={isSmallScreen ? 1.5 : 4} mt={2} mb={2} justifyContent={'center'}>
        {productsInCategory.map((item) => (
          <Grid item key={item._id}>
            <ProductCard product={item} indicator={indicator(item)} />
          </Grid>
        ))}
      </Grid>

      {renderPagination()}
    </Box>
  );
};

export default Products;
