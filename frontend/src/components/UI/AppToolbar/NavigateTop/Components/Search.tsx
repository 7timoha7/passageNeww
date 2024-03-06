import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { searchProductsPreview } from '../../../../../features/Products/productsThunks';
import noImg from '../../../../../assets/images/no_image.jpg';
import { apiURL, placeHolderImg } from '../../../../../constants';
import { useNavigate } from 'react-router-dom';
import {
  clearSearchResultsPreview,
  selectSearchLoadingPreview,
  selectSearchResultsPreview,
} from '../../../../../features/Products/productsSlise';
import { Button } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CustomSearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchResultsPreview = useAppSelector(selectSearchResultsPreview);
  const searchLoadingPreview = useAppSelector(selectSearchLoadingPreview);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const menuRef = useRef<HTMLUListElement>(null);

  const delayedSearch = useCallback(
    (value: string) => {
      setTimeout(() => {
        if (value.length >= 3) {
          dispatch(searchProductsPreview({ text: value }));
        } else {
          dispatch(clearSearchResultsPreview());
        }
      }, 500);
    },
    [dispatch],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    delayedSearch(newQuery);
  };

  const closeAndNavigate = useCallback(() => {
    dispatch(clearSearchResultsPreview());
    setQuery('');
  }, [dispatch]);

  const handleExtendedSearch = () => {
    if (query.trim() !== '') {
      closeAndNavigate();
      navigate(`/search-results/${encodeURIComponent(query)}`);
    }
  };

  const handleProductCard = (id: string) => {
    if (query.trim() !== '') {
      closeAndNavigate();
      navigate('/product/' + id);
    }
  };

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeAndNavigate();
      }
    },
    [closeAndNavigate],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Box position="relative" width="100%">
      <TextField
        // variant="outlined"
        size="small"
        label="Живой поиск"
        type="search"
        value={query}
        onChange={(e) => onChange(e)}
        fullWidth
        InputProps={{
          endAdornment: (
            <React.Fragment>{searchLoadingPreview && <CircularProgress color="inherit" size={15} />}</React.Fragment>
          ),
        }}
        onFocus={() => dispatch(clearSearchResultsPreview())}
      />
      {searchResultsPreview.results.length > 0 && (
        <Box>
          <ul
            ref={menuRef}
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              zIndex: 2,
              overflowY: 'auto',
              maxHeight: '400px',
            }}
          >
            {searchResultsPreview.results.map((option) => (
              <li
                key={option._id}
                style={{
                  padding: '8px',
                  display: 'flex', // Добавлено свойство display: flex
                  alignItems: 'center', // Добавлено свойство align-items: center
                  cursor: 'pointer',
                  borderBottom: '1px solid #ccc',
                  color: 'black',
                }}
                onClick={() => handleProductCard(option._id)}
              >
                <Box marginRight={2}>
                  <LazyLoadImage
                    src={option.images[0] ? apiURL + option.images[0] : noImg}
                    alt={option.name}
                    width="35px"
                    height="35px"
                    style={{ objectFit: 'contain' }}
                    placeholderSrc={placeHolderImg}
                    effect="blur"
                  />
                </Box>

                <div>
                  <div style={{ fontWeight: 'bold' }}>{option.name}</div>
                  <div style={{ marginLeft: '8px' }}>Цена: {option.price}</div>
                </div>
              </li>
            ))}
          </ul>
          {searchResultsPreview.hasMore && (
            <Box display="flex" justifyContent="center">
              <Button color="primary" onClick={handleExtendedSearch}>
                Все результаты
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CustomSearchBar;
