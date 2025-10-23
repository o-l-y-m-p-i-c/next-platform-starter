import { styled } from '@mui/system';

export const Container = styled('div')({
  position: 'relative',
  padding: '8px',
  margin: '-8px',
  flex: 1,
});

export const Video = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 1,
});

export const MessagesContainer = styled('div')({
  position: 'absolute',
  scrollbarWidth: 'thin',
  scrollbarColor: '#e5e5ea #1e1e24',
  background: 'rgba(0, 0, 0, 0.6)',
  height: 'calc(100% - 48px)',
  width: 'calc(100% - 48px)',
  overflowX: 'hidden',
  textAlign: 'left',
  color: 'white',
  padding: '24px',
  left: '24px',
  top: '24px',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',

  '@media (max-width: 768px)': {
    padding: '12px',
    left: '12px',
    top: '12px',
    height: 'calc(100% - 24px)',
    width: 'calc(100% - 24px)',
  },
});

export const MessageListItem = styled('div')`
  animation: slide 0.3s ease-in-out forwards;

  @keyframes slide {
    0% {
      opacity: 0;
      transform: translateX(-200px);
    }
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
`;
