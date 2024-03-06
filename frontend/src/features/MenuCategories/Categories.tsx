import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import './Categories.css';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectFetchAllCategoriesLoading } from './menuCategoriesSlice';
import Spinner from '../../components/UI/Spinner/Spinner';

interface Category {
  _id: string;
  name: string;
  ID: string;
  ownerID?: string;
}

interface HierarchicalCategory extends Category {
  subCategories?: HierarchicalCategory[];
}

interface OpenState {
  [categoryId: string]: boolean;
}

interface Props {
  categories: Category[];
  close: () => void;
}

const CategoryWrapper = styled.div`
  max-width: 100%;
`;

const CategoryItem = styled.div<{ $level: number }>`
  border-bottom: 2px solid #ccc;
  cursor: pointer;
  transition: background-color 0.4s ease;
  display: flex;
  align-items: center;
  padding: 5px 5px 5px ${(props) => props.$level * 10}px;
  color: #ffffff;

  &:hover {
    background: rgba(145, 145, 145, 0.58);
  }
`;

const SpecialCategoryItem = styled(CategoryItem)`
  background: rgba(231, 225, 225, 0.42);

  &:hover {
    background: rgba(145, 145, 145, 0.58);
  }
`;

const SubCategoryList = styled.div<{ $isOpen: boolean; $opacity: number }>`
  padding-left: 0;
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s ease, transform 0.5s ease, opacity 0.5s ease;
  opacity: ${({ $opacity }) => $opacity};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
`;

const IconWrapper = styled.div`
  margin-right: 0;
`;

const Categories: React.FC<Props> = ({ categories, close }) => {
  const [categoryTree, setCategoryTree] = useState<HierarchicalCategory[]>([]);
  const [openState, setOpenState] = useState<OpenState>({});
  const [subCategoriesOpacity, setSubCategoriesOpacity] = useState<number>(1);
  const navigate = useNavigate();
  const loading = useAppSelector(selectFetchAllCategoriesLoading);

  useEffect(() => {
    const buildCategoryTree = (categories: Category[], parentID?: string): HierarchicalCategory[] => {
      return categories
        .filter((category) => category.ownerID === parentID)
        .map((category) => {
          const subCategories = buildCategoryTree(categories, category.ID);
          return { ...category, subCategories };
        });
    };

    const topLevelCategory = categories.find((category) => category.name === 'Товары');
    const tree = topLevelCategory ? buildCategoryTree(categories, topLevelCategory.ID) : [];
    setCategoryTree(tree);
  }, [categories]);

  const handleCategoryClick = (categoryId: string, ownerID?: string) => {
    setOpenState((prevOpenState) => {
      const updatedOpenState: OpenState = { ...prevOpenState, [categoryId]: !prevOpenState[categoryId] };

      if (ownerID) {
        Object.keys(prevOpenState).forEach((id) => {
          if (prevOpenState[id] && id !== categoryId && categories.find((cat) => cat.ID === id)?.ownerID === ownerID) {
            updatedOpenState[id] = false;
          }
        });
      }

      return updatedOpenState;
    });

    setSubCategoriesOpacity(0);
    setTimeout(() => setSubCategoriesOpacity(1), 50);
  };

  const navigateAndClose = (item: string) => {
    navigate('products/' + item);
    close();
  };

  const renderCategories = (categories: HierarchicalCategory[] | undefined, $level = 0) => {
    if (!categories) {
      return null;
    }

    return (
      <CategoryWrapper>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {categories.map((category) => (
              <div key={category.ID}>
                {category.subCategories && category.subCategories.length > 0 ? (
                  <CategoryItem $level={$level} onClick={() => handleCategoryClick(category.ID, category.ownerID)}>
                    <IconWrapper>{openState[category.ID] ? <ExpandMore /> : <ChevronRight />}</IconWrapper>
                    {category.name}
                  </CategoryItem>
                ) : (
                  <SpecialCategoryItem $level={$level + 1} onClick={() => navigateAndClose(category.ID)}>
                    <IconWrapper />
                    {category.name}
                  </SpecialCategoryItem>
                )}
                {openState[category.ID] && category.subCategories && (
                  <SubCategoryList $isOpen={openState[category.ID]} $opacity={subCategoriesOpacity}>
                    {renderCategories(category.subCategories, $level + 1)}
                  </SubCategoryList>
                )}
              </div>
            ))}
          </>
        )}
      </CategoryWrapper>
    );
  };

  return <div>{renderCategories(categoryTree)}</div>;
};

export default Categories;
