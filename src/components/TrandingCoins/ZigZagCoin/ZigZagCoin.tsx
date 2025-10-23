import { Button, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TToken } from '@/types/responces/Token';
import * as styled from './ZigZagCoin.styled';
import { ImageWithFallback } from '../../ImageWithFallback/ImageWithFallback';
import r from '../../../constants/routes.constants';
import { Box } from '@mui/system';

interface IZigZagCoin extends TToken {
  lowerBound: number;
}

const lineHeight = 20;

export const ZigZagCoin = ({ coins }: { coins: TToken[] }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [zigZags, setZigZags] = useState<IZigZagCoin[]>([]);

  useEffect(() => {
    const checkWindowWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', checkWindowWidth);
    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  const getZigZagYX = (coin: IZigZagCoin) => {
    if (!width) {
      return { x: [], y: [] };
    }
    const x = [];
    const y = [];
    let current = 0;

    const lowerBound = coin.lowerBound;
    const upperBound = lowerBound + 50;

    for (let i = 0; current + 200 < width; i++) {
      x.push(current);
      y.push(i % 2 === 0 ? lowerBound : upperBound);
      current += 100;
    }

    return { x, y };
  };

  useEffect(() => {
    if (coins.length > 0) {
      setZigZags((rest) => [
        ...rest,
        { ...coins[0], lowerBound: Math.random() * 1000 },
      ]);
    }
  }, [coins]);

  return (
    <styled.Container>
      {coins.length > 0 &&
        zigZags.map((coin, index) => {
          const { x, y } = getZigZagYX(coin);
          const animation = styled.zigZagAnimation(x, y);

          return (
            <styled.ZigZagItem
              key={index}
              animation={animation}
              onAnimationEnd={() =>
                setZigZags((rest) =>
                  rest.filter((zz) => zz.symbol !== coin.symbol),
                )
              }
            >
              <Box style={{ pointerEvents: 'all' }}>
                <Paper>
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                    }}
                    startIcon={
                      <ImageWithFallback
                        src={coin?.imageURL}
                        style={{
                          width: `${lineHeight}px`,
                          height: `${lineHeight}px`,
                        }}
                        alt={coin?.name}
                        containerstyleprops={{
                          width: `${lineHeight}px`,
                          height: `${lineHeight}px`,
                        }}
                      />
                    }
                    component={Link}
                    href={`${r.token}/${coin?.slug}`}
                  >
                    {coin?.name}
                  </Button>
                </Paper>
              </Box>
            </styled.ZigZagItem>
          );
        })}
    </styled.Container>
  );
};
