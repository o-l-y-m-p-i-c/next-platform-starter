import { keyframes, styled } from '@mui/system';

export const Container = styled('div')`
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100svh - 64px);
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
`;

export const zigZagAnimation = (x: number[], y: number[]) => keyframes`
  ${x
    .map(
      (val, i) => `
      ${((i / x.length) * 100).toFixed(2)}% {
        transform: translate(${val}px, ${y[i]}px);
        opacity: ${1 - i / x.length};
      }
    `,
    )
    .join('')}
  100% {
    transform: translate(100vw, ${y[y.length - 1]}px);
    opacity: 0;
    pointerEvents: 'none';
  }
`;

export const ZigZagItem = styled('div')<{ animation: string }>`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${(props) => props.animation} 10s ease-in-out forwards;
`;
