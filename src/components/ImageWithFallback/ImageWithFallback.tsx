'use client';

import { useState } from 'react';
import defaultSrc from './../../assets/Not_found.svg';
import { CircularProgress } from '@mui/material';

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  alt: string;
  hideIfHasError?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerstyleprops?: any;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  hideIfHasError = false,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const handleError = () => {
    setImgSrc(defaultSrc);
  };

  if (hideIfHasError && hasError) return <></>;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        ...props.containerstyleprops,
      }}
    >
      <img
        src={imgSrc || defaultSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          handleError();
          setHasError(true);
        }}
        {...props}
      />
      {!isLoaded && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0px',
            left: '0px',
          }}
        >
          <CircularProgress
            sx={{
              maxWidth: '40%',
              width: '100%',
              height: 'auto!important',
              position: 'absolute',
            }}
          />
        </div>
      )}
    </div>
  );
};

export { ImageWithFallback };
