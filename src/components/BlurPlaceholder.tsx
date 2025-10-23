import { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TechnicalAnalysisPlaceholder from '../assets/placeholders/technical-analysis-placeholder.png';
import PriceChartPlaceholder from '../assets/placeholders/price-chart-placeholder.png';
import TwitterSentimentsPlaceholder from '../assets/placeholders/twitter-sentiments-placeholder.png';
import TokenInfoPlaceholder from '../assets/placeholders/token-info-placeholder.png';

interface BlurPlaceholderProp {
  block?:
    | 'technical'
    | 'price-chart'
    | 'twitter-sentiment'
    | 'last-transaction'
    | 'token-info';
  blurSize?: number;
  height?: number;
  children?: ReactNode;
  customContent?: ReactNode;
}

const BlurPlaceholder: FC<BlurPlaceholderProp> = ({
  block,
  blurSize = 15,
  height,
  children,
  customContent,
}) => {
  let placeholderImage;

  switch (block) {
    case 'token-info':
      placeholderImage = TokenInfoPlaceholder;
      break;
    case 'technical':
      placeholderImage = TechnicalAnalysisPlaceholder;
      break;

    case 'price-chart':
      placeholderImage = PriceChartPlaceholder;
      break;

    case 'twitter-sentiment':
      placeholderImage = TwitterSentimentsPlaceholder;
      break;

    default:
      break;
  }

  return (
    <Box
      width={'100%'}
      textAlign={'center'}
      height={height ? `${height}px` : '100%'}
      position={'relative'}
      overflow={'hidden'}
      sx={{
        '> img': {
          width: '100%',
          height: '100%',
          filter: `blur(${blurSize}px)`,
          position: 'absolute',
          objectFit: 'contain',
          left: 0,
          top: 0,
        },
      }}
    >
      {placeholderImage ? (
        <img
          style={{
            objectFit: 'fill',
          }}
          src={placeholderImage.src}
          alt=""
        />
      ) : null}
      <Stack
        position={'absolute'}
        justifyContent={'center'}
        alignItems={'center'}
        bottom={0}
        right={0}
        left={0}
        top={0}
        flex={1}
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      >
        {!customContent && (
          <>
            <Typography variant={'h6'} gutterBottom>
              Available for Premium Users
            </Typography>
            {children}
          </>
        )}
        {customContent}
      </Stack>
    </Box>
  );
};

export default BlurPlaceholder;
