import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectFetchProductsForOneCategoryLoading,
  selectProductsForOneCategory,
  selectUpdateProductsForLoading,
  setProductsForOneCategoriesNull,
} from '../productsForSlice';
import { fetchProductsFor, fetchProductsForOneCategory, updateProductsFor } from '../productsForThunks';
import { CategoriesType } from '../../../types';
import { Box, Checkbox, Grid, Typography } from '@mui/material';
import { closeModalCover } from '../../users/usersSlice';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { LoadingButton } from '@mui/lab';

interface Props {
  productsFoID: string;
  categories: CategoriesType[];
}

const ProductsForItem: React.FC<Props> = ({ productsFoID, categories }) => {
  const productsForOneCategory = useAppSelector(selectProductsForOneCategory);
  const productsForOneCategoryLoading = useAppSelector(selectFetchProductsForOneCategoryLoading);
  const updateLoading = useAppSelector(selectUpdateProductsForLoading);
  const dispatch = useAppDispatch();

  // Состояние для отслеживания выбранных чекбоксов
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProductsForOneCategory(productsFoID));
  }, [dispatch, productsFoID]);

  useEffect(() => {
    // Проверяем, что productsForOneCategory существует и categoryForID не пуст
    if (
      productsForOneCategory &&
      productsForOneCategory.categoryForID &&
      productsForOneCategory.categoryForID.length > 0
    ) {
      // Извлекаем ID выбранных категорий из productsForOneCategory
      const productForOneCategoryIDs: string[] = productsForOneCategory.categoryForID.map((category) => category.ID);

      setCheckedCategories(productForOneCategoryIDs);
    } else if (
      productsForOneCategory &&
      productsForOneCategory.categoryForID &&
      productsForOneCategory.categoryForID.length === 0
    ) {
      setCheckedCategories([]);
    }
  }, [productsForOneCategory]);

  const handleCheckboxChange = (categoryID: string) => {
    setCheckedCategories((prevCheckedCategories) => {
      const updatedCategories = prevCheckedCategories.includes(categoryID)
        ? prevCheckedCategories.filter((id) => id !== categoryID)
        : [...prevCheckedCategories, categoryID];

      // Отправляем запрос на обновление при каждом изменении состояния чекбокса
      dispatch(updateProductsFor({ categoryID: productsFoID, categoryForID: updatedCategories }));

      return updatedCategories;
    });
  };

  const onClickBtnCancel = async () => {
    dispatch(setProductsForOneCategoriesNull());
    dispatch(closeModalCover());
    await dispatch(fetchProductsFor());
  };

  const filterCategories = (currentCategoryID: string) => {
    return categories.filter((category) => category.ID !== currentCategoryID);
  };

  return (
    <>
      {productsForOneCategoryLoading ? (
        <Spinner />
      ) : (
        <Grid container spacing={2}>
          {filterCategories(productsFoID).map((item) => {
            const isChecked = checkedCategories.includes(item.ID);
            return (
              <Grid item key={item.ID}>
                <Grid
                  spacing={1}
                  justifyContent={'space-between'}
                  container
                  sx={{ background: 'rgba(103,255,237,0.89)', borderRadius: '10px' }}
                >
                  <Grid item>
                    <Typography>{item.name}</Typography>
                  </Grid>
                  <Grid>
                    <Checkbox
                      disabled={updateLoading}
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(item.ID)}
                      aria-label={`Select ${item.name}`}
                    />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box sx={{ mt: 2 }} justifyContent={'flex-end'} display={'flex'}>
        <LoadingButton loading={updateLoading} variant={'outlined'} onClick={() => onClickBtnCancel()}>
          Назад
        </LoadingButton>
      </Box>
    </>
  );
};

export default ProductsForItem;
