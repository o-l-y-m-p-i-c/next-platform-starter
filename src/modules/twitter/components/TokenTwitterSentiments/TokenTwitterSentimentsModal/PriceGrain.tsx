import { FC, ReactNode, useState } from 'react';
import { ClickAwayListener, Tooltip, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { formatNumber } from '../../../../../helpers/formatNumber';

interface PriceGrainProp {
  isAbsolute?: boolean;
  priceGain: number | undefined | null;
  children: ReactNode;
}

const PriceGrain: FC<PriceGrainProp> = ({
  isAbsolute = true,
  priceGain,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!priceGain) return <></>;

  if (priceGain < -99 && priceGain < 500000) return <></>;

  return priceGain && !isNaN(priceGain) ? (
    <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
      <Tooltip
        arrow
        open={showTooltip}
        title={
          <Stack>
            <Typography variant={'caption'}>
              Price change since the tweet was published
            </Typography>{' '}
            {children}
          </Stack>
        }
      >
        <Box
          onClick={() => setShowTooltip((prev) => !prev)}
          position={isAbsolute ? 'absolute' : 'static'}
          className={'price-grain'}
          borderRadius={{ xs: 1, md: 2 }}
          fontSize={{ xs: 10, md: 14 }}
          px={{ xs: 0.4, md: 0.6 }}
          top={{ xs: 14, md: 10 }}
          whiteSpace={'nowrap'}
          fontWeight={600}
          zIndex={2}
          right={18}
          py={0.5}
          sx={{
            backgroundColor: priceGain > 0 ? 'green' : 'red',
            userSelect: 'none',
          }}
        >
          {`${priceGain > 0 ? '▲' : '▼'} ${formatNumber(priceGain)}%`}
          <br />
        </Box>
      </Tooltip>
    </ClickAwayListener>
  ) : null;
};

export default PriceGrain;
