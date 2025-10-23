'use client';

import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { styled } from '@mui/system';
import type { TToken } from '@/types/responces/Token';
import { removeDuplicatesByKey } from '../../utils/removeDuplicatesByKey';
import { useSocket } from '../../hooks/useSocket';
import { TokenInfoCard } from '../TokenInfoCard';

const ScrollableCol = styled('div')`
  overflow: visible;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ScrollableRow = styled('div')`
  position: relative;
  flex: 1;
`;

const lineHeight = 89;

const RecentlyMintedCoins = () => {
  const socket = useSocket();
  const [recentlyTokens, setRecentlyTokens] = useState<TToken[]>([]);
  const count = 7;

  useEffect(() => {
    if (!socket) {
      return;
    }
    const event = 'feed:recentlyMinted';

    const handleNewTokens = (tokens: TToken[]) => {
      setRecentlyTokens((prev) =>
        removeDuplicatesByKey<TToken>([tokens, prev], 'slug').slice(0, count),
      );
    };

    socket.on(event, handleNewTokens);
    socket.emit('subscribe', event);

    return () => {
      socket.off(event, handleNewTokens);
      socket.emit('unsubscribe', event);
    };
  }, [socket]);

  return (
    <Stack minHeight={lineHeight * count + 12 * count + 40}>
      <ScrollableRow>
        <ScrollableCol>
          <Stack flex={1}>
            {recentlyTokens?.map((item, index) => (
              <TokenInfoCard
                key={`${item.name}-${item.slug}`}
                isAnimated={true}
                data={{ ...item }}
                index={index}
              />
            ))}
          </Stack>
        </ScrollableCol>
      </ScrollableRow>
    </Stack>
  );
};
export { RecentlyMintedCoins };
