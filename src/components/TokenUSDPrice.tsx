import Typography from '@mui/material/Typography';
import { FC } from 'react';

interface TokenUSDPriceProp {
  price: number;
  showUSD?: boolean;
}

const sliceAfter = (value: number, afterValue: number = 6) => {
  const stringValue = value.toString();

  if (stringValue.includes('.')) {
    const [integerPart, decimalPart] = stringValue.split('.');
    const slicedDecimal = decimalPart.slice(0, afterValue);
    return `${integerPart}.${slicedDecimal}`;
  } else {
    return stringValue;
  }
};

const countTrailingZeros = (value: number) => {
  const valueStr = value.toString();

  const decimalIndex = valueStr.indexOf('.');

  if (decimalIndex === -1) return 0;

  let zeroCount = 0;

  for (let i = decimalIndex + 1; i < valueStr.length; i++) {
    if (valueStr[i] === '0') {
      zeroCount++;
    } else {
      break;
    }
  }

  return zeroCount;
};

const TokenUSDPrice: FC<TokenUSDPriceProp> = ({ price, showUSD = true }) => {
  if (!price) return 0;
  if (price > 10) return sliceAfter(price);

  const zerosAfterPoint = countTrailingZeros(price);
  const stringValue = price.toString();
  const [integerPart, decimalPart] = stringValue.split('.');
  const valuesAfterZero = decimalPart.slice(zerosAfterPoint);
  const newValue = (
    <>
      {integerPart}.
      {zerosAfterPoint > 0 && (
        <>
          0
          {zerosAfterPoint > 1 && (
            <sub style={{ fontSize: '0.6em' }}>{zerosAfterPoint}</sub>
          )}
        </>
      )}
      {valuesAfterZero.slice(0, 4)}
    </>
  );

  return (
    <>
      <Typography
        component={'span'}
        title={`$${price}`}
        variant="caption"
        fontSize={'1em'}
      >
        {newValue}
      </Typography>
      {showUSD && (
        <Typography component={'span'} variant="caption" fontSize={'0.45em'}>
          USD
        </Typography>
      )}
    </>
  );
};

export default TokenUSDPrice;
