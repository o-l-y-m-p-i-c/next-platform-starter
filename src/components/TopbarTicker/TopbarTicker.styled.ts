import { styled } from '@mui/system';

export const TickerItem = styled('a')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  gap: 16px;
  background-color: ${theme.palette.background.paper};
  border-radius: 4px;
  width: 350px;
  color: white;
  cursor: pointer;
  box-shadow: none;

  &:hover {
    color: ${theme.palette.primary.main};
    box-shadow: inset 0 0 0 1px ${theme.palette.primary.main};
  }
`,
);

export const Footer = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  align-items: center;
  color: gray;
  white-space: nowrap;
`;

export const Source = styled('div')`
  display: flex;
  gap: 8px;
  flex: 1;
  overflow: hidden;
  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const RightSide = styled('div')`
  display: flex;
  gap: 4px;
  flex-direction: column;
  min-width: 0;
`;

export const LeftSide = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-direction: column;
`;

export const MarqueeContainer = styled('div')({
  display: 'flex',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  position: 'relative',
  '&:hover .marquee': {
    animationPlayState: 'paused',
  },
});

export const Marquee = styled('div')({
  display: 'flex',
  gap: '10px',
  width: 'max-content',
  animation: 'scroll 100s 2s linear infinite',
  '@keyframes scroll': {
    '0%': {
      transform: 'translateX(0%)',
    },
    '100%': {
      transform: 'translateX(-100%)',
    },
  },
});
