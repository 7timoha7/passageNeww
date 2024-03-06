import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectCategories } from '../../../features/MenuCategories/menuCategoriesSlice';
import { selectProductOne } from '../../../features/Products/productsSlise';

const BreadcrumbsPage = () => {
  const location = useLocation();
  const url = location.pathname;

  const parts = url.split('/');
  const pathName = parts[1];
  const categoryId = parts[2];

  const categories = useAppSelector(selectCategories);
  const productOne = useAppSelector(selectProductOne);
  const [breadcrumbs, setBreadcrumbs] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const getCategoryPath = (categoryID: string) => {
      const category = categories.find((item) => item.ID === categoryID);
      return category ? category.name : '';
    };

    const generateBreadcrumbs = () => {
      if (pathName === 'products' && categoryId) {
        const categoryPath = getCategoryPath(categoryId);
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <Link fontWeight={'bold'} underline="hover" key="2" color="inherit" href={`/products/${categoryId}`}>
            {categoryPath ? categoryPath : 'Категория'}
          </Link>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'product' && productOne) {
        const categoryPath = getCategoryPath(productOne.ownerID);
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <Link underline="hover" key="2" color="inherit" href={`/products/${productOne.ownerID}`}>
            {categoryPath ? categoryPath : 'Категория'}
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            {productOne.name}
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'productsNews') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            Новинки
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'delivery') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            Доставка
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (location.pathname === '/') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'contacts') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            Контакты
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'about') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            О нас
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'my-cabinet') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            Личный кабинет
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'login') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            Вход
          </span>,
        ];
        setBreadcrumbs(state);
      } else if (pathName === 'register') {
        const state = [
          <Link underline="hover" key="1" color="inherit" href="/">
            Главная
          </Link>,
          <span key="3" style={{ fontWeight: 'bold' }}>
            Регистрация
          </span>,
        ];
        setBreadcrumbs(state);
      } else {
        // Если не находимся в категории или продукте, сбрасываем крошки
        setBreadcrumbs([]);
      }
    };

    generateBreadcrumbs();
  }, [pathName, categoryId, categories, productOne, location.pathname]);

  return (
    <>
      <Box sx={{ m: 1, mt: 2 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default BreadcrumbsPage;
