import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBanners, selectFetchBannersLoading } from './bannersSlice';
import { fetchBanners } from './bannersThunks';
import { MDBCarousel, MDBCarouselCaption, MDBCarouselItem } from 'mdb-react-ui-kit';
import Spinner from '../../components/UI/Spinner/Spinner';
import PorcelainStoneware from '../../components/UI/Banners/PorcelainStoneware';
import { apiURL } from '../../constants';

const Banners = () => {
  const banners = useAppSelector(selectBanners);
  const fetchBannersLoading = useAppSelector(selectFetchBannersLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <>
      {fetchBannersLoading ? (
        <Spinner />
      ) : (
        <>
          {banners.length ? (
            <MDBCarousel showIndicators showControls fade style={{ margin: 0 }}>
              {banners.map((item, index) => {
                return (
                  <MDBCarouselItem key={item._id} itemId={index + 1} style={{ height: '70vh' }}>
                    <img
                      src={apiURL + '/' + item.image}
                      className="d-block w-100"
                      alt="..."
                      style={{ objectFit: 'contain', height: '100%' }}
                    />
                    <MDBCarouselCaption style={{ background: 'rgba(0,0,0,0.47)', borderRadius: '10px' }}>
                      <h5>{item.title}</h5>
                      <p>{item.desk}</p>
                    </MDBCarouselCaption>
                  </MDBCarouselItem>
                );
              })}
            </MDBCarousel>
          ) : (
            <PorcelainStoneware />
          )}
        </>
      )}
    </>
  );
};

export default Banners;
