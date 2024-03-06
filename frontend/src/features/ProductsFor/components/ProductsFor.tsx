import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectFetchProductsForOneLoading, selectProductsForOne } from '../productsForSlice';
import { fetchProductsForOne } from '../productsForThunks';
import Slider, { Settings } from 'react-slick';
import { selectBasket } from '../../Basket/basketSlice';
import { ProductType } from '../../../types';
import { ProductsNewsBorderStyles } from '../../../styles';
import { Box, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Spinner from '../../../components/UI/Spinner/Spinner';
import ProductCard from '../../Products/components/ProductCard';

interface Props {
  categoriesID: string;
}

const ProductsFor: React.FC<Props> = ({ categoriesID }) => {
  const productsFor = useAppSelector(selectProductsForOne);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsForOne(categoriesID));
  }, [categoriesID, dispatch]);

  const sliderRef = useRef<Slider>(null);
  const basket = useAppSelector(selectBasket);
  const productsForOneLoading = useAppSelector(selectFetchProductsForOneLoading);

  // // Проверьте, что bestsellersProduct - это массив
  // if (!Array.isArray(productsFor)) {
  //   // Обработайте случай, когда bestsellersProduct не является массивом
  //   return null;
  // }

  const sliderSettings: Settings = {
    dots: false, // Отключаем точки (индикаторы текущего слайда)
    arrows: false, // Отключаем стандартные стрелки
    infinite: true, // Бесконечная прокрутка слайдов
    slidesToShow: 3, // Количество отображаемых слайдов за один раз
    slidesToScroll: 1, // Количество слайдов, которые прокручиваются за один раз
    autoplay: true, // Включаем автопрокрутку
    autoplaySpeed: 2000, // Интервал между автоматической сменой слайдов в миллисекундах
    variableWidth: true, // Разрешаем переменную ширину слайдов, чтобы они могли занимать разное пространство
    centerMode: true, // Разрешаем режим центрирования, где активный слайд всегда по центру
    centerPadding: '10px', // Отступ от края контейнера для активного слайда
    adaptiveHeight: true, // Адаптивная высота слайда под контент
    speed: 500, // Скорость анимации переключения слайдов в миллисекундах
    initialSlide: 0, // Номер начального слайда
    swipeToSlide: true, // Позволяет переключаться по слайдам при свайпе
    focusOnSelect: true, // Слайд будет центрироваться при клике
    draggable: true, // Включает/отключает перетаскивание слайдов мышью (для десктопа)
    responsive: [
      { breakpoint: 1800, settings: { variableWidth: false, slidesToShow: 4, centerMode: false } },
      { breakpoint: 1300, settings: { variableWidth: false, slidesToShow: 3, centerMode: false } },
      { breakpoint: 1080, settings: { variableWidth: false, slidesToShow: 2, centerMode: false } },
      { breakpoint: 800, settings: { variableWidth: false, slidesToShow: 2, centerMode: false } },
      { breakpoint: 400, settings: { variableWidth: false, slidesToShow: 1, centerMode: false } },
    ],
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const indicator = (item: ProductType) => {
    if (basket && item) {
      return basket.items.some((itemBasket) => itemBasket.product.goodID === item.goodID);
    } else {
      return false;
    }
  };

  return (
    <>
      {(productsFor && productsFor.categoryForID.length < 1) || !productsFor ? null : (
        <div
          style={{
            border: ProductsNewsBorderStyles,
            borderRadius: '10px',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        >
          <style>
            {`
        .slick-track {
          display: flex !important;
          align-items: stretch;
        }

        .slick-slide {
          display: flex !important;
          height: auto !important;
          padding-bottom: 10px;
          padding-top: 10px;
          padding-left: 7px;      
        }

        .slick-list {
          overflow: hidden;          
        }
      `}
          </style>

          <Grid container justifyContent={'space-between'} alignItems={'center'} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={'bold'} style={{ marginLeft: '2%' }}>
              Рекомендованные товары
            </Typography>
            <Grid item></Grid>
            <Grid item>
              <Grid container spacing={2} sx={{ mr: 3, mt: 2 }}>
                <Grid item>
                  <IconButton color={'primary'} size={'large'} onClick={handlePrev}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton color={'primary'} size={'large'} onClick={handleNext}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {productsForOneLoading ? (
            <Spinner />
          ) : (
            <>
              {productsFor && productsFor.categoryForID.length < 2 ? (
                <Box sx={{ p: 2 }}>
                  <ProductCard
                    newsSize={true}
                    indicator={indicator(productsFor.categoryForID[0])}
                    product={productsFor.categoryForID[0]}
                  />
                </Box>
              ) : (
                <Slider ref={sliderRef} {...sliderSettings}>
                  {productsFor &&
                    productsFor.categoryForID.map((item) => (
                      <div key={item._id}>
                        <ProductCard newsSize={true} indicator={indicator(item)} product={item} />
                      </div>
                    ))}
                </Slider>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProductsFor;
