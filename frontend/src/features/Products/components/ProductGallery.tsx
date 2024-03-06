import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { apiURL } from '../../../constants';

interface Props {
  images: string[];
}

const ProductGallery: React.FC<Props> = ({ images }) => {
  // Преобразование строк в объекты ImageType
  const galleryImages = images.map((image) => ({
    original: apiURL + '/' + image,
    thumbnail: apiURL + '/' + image,
    originalHeight: 800, // Замените на нужную высоту
    originalWidth: 600, // Замените на нужную ширину
    thumbnailMaxHeight: 150, // Замените на нужную высоту
    thumbnailMaxWidth: 100, // Замените на нужную ширину
  }));

  const handleScreenChange = (isFullScreen: boolean) => {
    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      galleryRef.current?.fullScreen();
    }
  };

  const galleryRef = React.useRef<ImageGallery>(null);

  return (
    <div>
      <ImageGallery
        ref={galleryRef}
        items={galleryImages}
        onScreenChange={handleScreenChange}
        onClick={() => galleryRef.current?.fullScreen()}
        lazyLoad={true} // Включение ленивой загрузки
      />
    </div>
  );
};

export default ProductGallery;
