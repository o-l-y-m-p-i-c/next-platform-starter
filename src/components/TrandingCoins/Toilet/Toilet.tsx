import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import LightImage from '../../../assets/toilet/light.png';
import ShitImage from '../../../assets/toilet/shit.png';
import ToiletFrontImage from '../../../assets/toilet/toilet-front.png';
import ToiletImage from '../../../assets/toilet/toilet.png';
import { SocketContext } from '../../../context/Socket';
import { TToken } from '@/types/responces/Token';
import * as styled from './Toilet.styled';
import Link from 'next/link';

export const Toilet = () => {
  const socket = useContext(SocketContext);

  const [coins, setCoins] = useState<TToken[]>([]);
  const [shitCoin, setShitCoin] = useState<TToken | null>(null);
  const coinsRef = useRef<TToken[]>(coins);
  const shitCoinRef = useRef<TToken | null>(shitCoin);

  useEffect(() => {
    coinsRef.current = coins; // Update the ref to hold the latest value
    shitCoinRef.current = shitCoin;
  }, [coins, shitCoin]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('feed:demoTrandingCoins2', (data) => {
      setCoins(data);
    });
    socket.emit('subscribe', 'feed:demoTrandingCoins2');

    return () => {
      socket.off('feed:demoTrandingCoins2');
      socket.emit('unsubscribe', 'feed:demoTrandingCoins2');
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (coinsRef.current.length > 0) {
        setShitCoin(coinsRef.current[coinsRef.current.length - 1]);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const ToiletAnimation = useMemo(
    () =>
      shitCoin && (
        <styled.Container key={shitCoin.slug}>
          <styled.RelativeContainer>
            <styled.Shit>
              <Link
                href={`/token/${shitCoin.slug}`}
                style={{
                  pointerEvents: 'all',
                }}
              >
                <div
                  className="animated-image"
                  style={{
                    backgroundImage: `url(${ShitImage})`,
                    backgroundSize: 'cover',
                  }}
                >
                  <img
                    style={{ zIndex: 5 }}
                    className="logo"
                    src={shitCoin.imageURL}
                  ></img>
                </div>
              </Link>
            </styled.Shit>
            {/*<FlyingSquares />*/}
            <styled.Toilet>
              <img
                style={{ zIndex: 4 }}
                src={ToiletFrontImage.src}
                className="animated-image"
                alt="Bouncing Image"
              />
              <img
                src={ToiletImage.src}
                className="animated-image"
                alt="Bouncing Image"
              />
              <img
                src={LightImage.src}
                className="animated-light"
                alt="Bouncing Image"
              />
            </styled.Toilet>
          </styled.RelativeContainer>
        </styled.Container>
      ),
    [shitCoin],
  );

  return ToiletAnimation;
};
