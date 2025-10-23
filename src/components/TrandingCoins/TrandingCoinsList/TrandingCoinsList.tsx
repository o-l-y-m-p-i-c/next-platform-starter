import { Button } from '@mui/material';
import Link from 'next/link';
import type { TToken } from '@/types/responces/Token';
import { ImageWithFallback } from '../../ImageWithFallback';
import r from '../../../constants/routes.constants';
import { useAppGlobal } from '@/hooks';
import { useEffect, useState } from 'react';

export const TrandingCoinsList = ({
  list,
  windowSize = 15,
  animated = false,
}: {
  list: TToken[];
  windowSize?: number;
  animated?: boolean;
}) => {
  const [fullArray, setFullArray] = useState(list);
  const [coins, setCoins] = useState([...list]);
  const { animations } = useAppGlobal();
  const lineHeight = 40;

  useEffect(() => {
    if (animated) {
      const intervalId = setInterval(() => {
        setFullArray((current) => {
          if (current.length) {
            const lastItem = current[current.length - 1];
            const restItems = current.slice(0, -1);
            return [lastItem, ...restItems];
          } else {
            return [];
          }
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [animated]);

  useEffect(() => {
    if (animated) {
      setCoins(fullArray.slice(0, windowSize));
    }
  }, [fullArray, windowSize, animated]);

  useEffect(() => {
    if (!animated) {
      setCoins(list);
    } else {
      setFullArray(list);
    }
  }, [list]);

  return (
    <>
      {coins?.map((item, index) => (
        <div
          key={item.slug}
          style={{
            width: '100%',
            position: 'absolute',
            transform: `translateY(${index * lineHeight}px)`,
            opacity: 1,
            animation: 'slide 0.2s ease-in-out',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              key={item.slug}
              style={{
                position: 'relative',
                animation:
                  index === 0 && animations
                    ? 'shake 0.35s ease-in-out'
                    : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Button
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                }}
                title={item.name}
                startIcon={
                  <ImageWithFallback
                    src={item.imageURL}
                    style={{
                      width: `${lineHeight - 10}px`,
                      height: `${lineHeight - 10}px`,
                    }}
                    alt={item.name}
                    containerstyleprops={{
                      width: `${lineHeight - 10}px`,
                      height: `${lineHeight - 10}px`,
                    }}
                  />
                }
                style={{ padding: '10px 20px' }}
                component={Link}
                href={`${r.token}/${item.slug}`}
              >
                <span
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    textAlign: 'left',
                  }}
                >
                  {item.name}
                </span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
