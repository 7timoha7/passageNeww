import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { CategoriesType } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  categories: CategoriesType[];
  close: () => void;
}

const AccordionCategories: React.FC<Props> = ({ categories, close }) => {
  const navigate = useNavigate();

  const renderCategory = (category: CategoriesType) => {
    const navigateAndClose = (item: string) => {
      navigate('products/' + item);
      close();
    };

    const subCategories = categories.filter((subItem) => subItem.ownerID === category.ID);

    if (subCategories.length > 0) {
      return (
        <Accordion
          key={category._id}
          sx={{
            background: 'transparent',
            // ':hover': { background: 'rgba(255,172,172,0.53)' },
            color: 'rgb(255,255,255)',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${category._id}-content`}
            id={`${category._id}-header`}
            sx={{ background: 'rgba(255,172,172,0.19)' }}
          >
            <Typography>{category.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>{subCategories.map((subCategory) => renderCategory(subCategory))}</AccordionDetails>
        </Accordion>
      );
    } else {
      return (
        <Button
          key={category._id}
          variant={'text'}
          color={'inherit'}
          sx={{
            width: '100%',
            justifyContent: 'flex-start', // Выравнивание текста влево
            textTransform: 'none', // Отключает преобразование текста в заглавные буквы
            textAlign: 'left',
          }}
          onClick={() => navigateAndClose(category.ID)}
        >
          {category.name}
        </Button>
      );
    }
  };

  const topLevelCategories = categories.filter((category) => !category.ownerID);

  return <>{topLevelCategories.map((topLevelCategory) => renderCategory(topLevelCategory))}</>;
};

export default AccordionCategories;
