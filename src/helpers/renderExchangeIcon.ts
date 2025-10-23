import raydium from '../assets/exchangeIcons/raydium.png';
import intro from '../assets/exchangeIcons/1intro.png';
import dexlab from '../assets/exchangeIcons/dexlab.png';
import fluxbeam from '../assets/exchangeIcons/fluxbeam.png';
import meteora from '../assets/exchangeIcons/meteora.png';
import orca from '../assets/exchangeIcons/orca.png';
import pancakeswap from '../assets/exchangeIcons/pancakeswap.png';
import sushiswap from '../assets/exchangeIcons/sushiswap.png';
import uniswap from '../assets/exchangeIcons/uniswap.png';
import bnbLogo from '../assets/networks/bnb.svg';

export const renderExchangeIcon = ({ type }: { type: string }) => {
  let icon = null;

  switch (type) {
    case 'bsc':
      icon = bnbLogo.src;
      break;
    case 'raydium':
      icon = raydium.src;
      break;
    case '1intro':
      icon = intro.src;
      break;
    case 'dexlab':
      icon = dexlab.src;
      break;
    case 'fluxbeam':
      icon = fluxbeam.src;
      break;
    case 'meteora':
      icon = meteora.src;
      break;
    case 'orca':
      icon = orca.src;
      break;
    case 'pancakeswap':
      icon = pancakeswap.src;
      break;
    case 'sushiswap':
      icon = sushiswap.src;
      break;
    case 'uniswap':
      icon = uniswap.src;
      break;

    default:
      break;
  }

  return icon;
};
