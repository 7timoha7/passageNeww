import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCategories, selectFetchAllCategoriesLoading } from '../../MenuCategories/menuCategoriesSlice';
import { selectCreateProductsForLoading, selectFetchProductsForLoading, selectProductsFor } from '../productsForSlice';
import { CategoriesType } from '../../../types';
import { fetchCategories } from '../../MenuCategories/menuCategoriesThunks';
import { createProductsFor, fetchProductsFor } from '../productsForThunks';
import { Box, Grid, Typography } from '@mui/material';
import { openModalCover, selectModalCoverState } from '../../users/usersSlice';
import ProductsForItem from './ProductsForItem';
import ModalCoverNew from '../../../components/UI/ModalCover/ModalCoverNew';
import { LoadingButton } from '@mui/lab';
import Spinner from '../../../components/UI/Spinner/Spinner';

const ProductsForPage = () => {
  const [state, setState] = useState<CategoriesType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categories = useAppSelector(selectCategories);
  const categoriesFor = useAppSelector(selectProductsFor);
  const stateModal = useAppSelector(selectModalCoverState);
  const createLoading = useAppSelector(selectCreateProductsForLoading);
  const categoriesLading = useAppSelector(selectFetchAllCategoriesLoading);
  const categoriesForLoading = useAppSelector(selectFetchProductsForLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductsFor());
  }, [dispatch]);

  useEffect(() => {
    if (categories) {
      const newCategories = categories.filter((category) => category.productsHave);
      setState(newCategories);
    }
  }, [categories]);

  const onClickButton = async (categoryID: string) => {
    let indicator = false;
    if (categoriesFor) {
      categoriesFor.forEach((item) => {
        if (item.categoryID.ID === categoryID) {
          indicator = true;
        }
      });
    }

    if (!indicator) {
      await dispatch(createProductsFor({ categoryID: categoryID, categoryForID: [] }));
    }

    setSelectedCategoryId(categoryID);
    if (!createLoading) {
      dispatch(openModalCover());
    }
  };

  return (
    <div>
      <Box
        sx={{
          border: '5px solid rgba(55,52,147,0.82)',
          borderRadius: '10px',
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Сопутствующие категории
        </Typography>
        {categoriesLading || categoriesForLoading ? (
          <Spinner />
        ) : (
          <>
            {state.map((item) => {
              return (
                <Box key={item.ID} sx={{ background: 'rgba(103,204,255,0.55)', mb: 1, borderRadius: '10px', p: 2 }}>
                  <Grid
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    container
                    sx={{ background: 'transparent' }}
                  >
                    <Grid item>
                      <Typography>{item.name}</Typography>
                    </Grid>
                    <Grid item ml={'auto'}>
                      <LoadingButton
                        loading={createLoading}
                        size={'small'}
                        onClick={() => onClickButton(item.ID)}
                        variant={'contained'}
                      >
                        Изменить
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    {categoriesFor &&
                      categoriesFor.map((itemCategory) => {
                        if (itemCategory.categoryID.ID === item.ID) {
                          return (
                            <Grid key={itemCategory._id} container spacing={1}>
                              {itemCategory.categoryForID.map((itemCategoryMass) => {
                                return (
                                  <Grid item key={itemCategoryMass.ID}>
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        background: '#65ffd5',
                                        margin: '3px',
                                        borderRadius: '5px',
                                        padding: '3px',
                                      }}
                                    >
                                      {itemCategoryMass.name}
                                    </span>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          );
                        }
                      })}
                  </Box>
                </Box>
              );
            })}
          </>
        )}
      </Box>
      <ModalCoverNew state={stateModal}>
        {selectedCategoryId && <ProductsForItem productsFoID={selectedCategoryId} categories={state} />}
      </ModalCoverNew>
    </div>
  );
};

export default ProductsForPage;
