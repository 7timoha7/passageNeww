import React from 'react';
import img1 from '../../../assets/images/kerama/1.jpg';
import img2 from '../../../assets/images/kerama/2.jpg';
import img3 from '../../../assets/images/kerama/3.jpg';
import img4 from '../../../assets/images/kerama/4.jpg';
import img5 from '../../../assets/images/kerama/5.jpg';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';

const PorcelainStoneware = () => {
  return (
    <>
      <MDBCarousel showIndicators showControls fade style={{ margin: 0 }}>
        <MDBCarouselItem itemId={1}>
          <img src={img1} className="d-block w-100" alt="..." />
          <MDBCarouselCaption style={{ background: 'rgba(0,0,0,0.47)', borderRadius: '10px' }}>
            <h5>
              MAXIMUS
              <br />
              СТЕНЫ
            </h5>
            <p>
              ЛУЧШЕЕ РЕШЕНИЕ ДЛЯ ПОТРЯСАЮЩЕГО ОФОРМЛЕНИЯ ВЕРТИКАЛЬНЫХ ПОВЕРХНОСТЕЙ, ТАКИХ КАК СТЕНЫ КУХНИ, ВАННОЙ
              КОМНАТЫ/САНУЗЛА И ПРОЧИХ СТЕН . ПЛИТКА MAXIMUS ПРИДАСТ ВАШИМ КОМНАТАМ ИНДИВИДУАЛЬНОСТЬ И ПОЗВОЛИТ
              БЕЗГРАНИЧНО ВЫРАЗИТЬ СВОЙ СТИЛЬ.
            </p>
          </MDBCarouselCaption>
        </MDBCarouselItem>

        <MDBCarouselItem itemId={2}>
          <img src={img2} className="d-block w-100" alt="..." />
          <MDBCarouselCaption>
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </MDBCarouselCaption>
        </MDBCarouselItem>

        <MDBCarouselItem itemId={3}>
          <img src={img3} className="d-block w-100" alt="..." />
          <MDBCarouselCaption>
            <h5>Third slide label</h5>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </MDBCarouselCaption>
        </MDBCarouselItem>
        <MDBCarouselItem itemId={3}>
          <img src={img4} className="d-block w-100" alt="..." />
          <MDBCarouselCaption>
            <h5>Third slide label</h5>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </MDBCarouselCaption>
        </MDBCarouselItem>
        <MDBCarouselItem itemId={3}>
          <img src={img5} className="d-block w-100" alt="..." />
          <MDBCarouselCaption>
            <h5>Third slide label</h5>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </MDBCarouselCaption>
        </MDBCarouselItem>
      </MDBCarousel>
    </>
  );
};

export default PorcelainStoneware;
