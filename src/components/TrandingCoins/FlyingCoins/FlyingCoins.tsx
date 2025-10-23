import Link from 'next/link';
import LightImage from '../../../assets/flyingTokens/wings-star.png';
import WingsImage from '../../../assets/flyingTokens/wings.gif';
import { ImageWithFallback } from '../../ImageWithFallback';
import { IFlyingCoin } from '../TrandingCoins';
import * as styled from './FlyingCoins.styled';

export const FlyingCoins = ({
  flyingCoins,
}: {
  flyingCoins: IFlyingCoin[];
}) => {
  return flyingCoins.map((coin) => (
    <styled.Container key={coin.keyRow}>
      <styled.RelativeContainer style={{ marginLeft: coin.left }}>
        <Link
          href={`/token/${coin.slug}`}
          style={{
            pointerEvents: 'all',
          }}
        >
          <styled.FlyingCoin>
            <div className="animated-image">
              <ImageWithFallback
                width={50}
                height={50}
                src={coin.imageURL}
                alt={coin.name}
                style={{ borderRadius: '50%', border: '2px solid white' }}
                containerstyleprops={{ zIndex: 5 }}
              />
              <img
                src={WingsImage.src}
                className="animated-wings"
                alt="Bouncing Image"
              />
              <img
                src={LightImage.src}
                className="animated-light"
                alt="Bouncing Image"
              />
            </div>
          </styled.FlyingCoin>
        </Link>
      </styled.RelativeContainer>
    </styled.Container>
  ));
};
