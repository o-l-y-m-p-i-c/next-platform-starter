import { styled } from '@mui/system';

export const Container = styled('div')`
  display: flex;
  /*justify-content: center;*/
  position: fixed;
  align-items: center;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
`;

export const RelativeContainer = styled('div')`
  position: relative;
  width: 200px;
  height: 100%;
`;

export const FlyingCoin = styled('div')`
  .animated-image {
    position: absolute;
    bottom: 0%;
    left: 50%;
    z-index: 3;
    width: 150px;
    height: 150px;
    animation:
      fly-bounce-grow 6s ease-in-out forwards,
      fly-fadeout 6s ease-in-out forwards;
    transition: 0.35s cubic-bezier(0.25, 0.1, 0, 2.05);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .animated-wings {
    position: absolute;
    bottom: 100px; /* Initial position */
    top: 0;
    left: -20px;
    z-index: 1;
    width: 200px;
    height: 130px;
    animation: fly-light-show 2s ease-out forwards;
  }

  .animated-light {
    position: absolute;
    bottom: 100px; /* Initial position */
    top: 0px;
    left: 0px;
    z-index: 1;
    width: 150px;
    height: 150px;
    animation:
      fly-light-rotation 3s ease-out forwards infinite,
      fly-light-show 2s ease-out forwards;
  }

  @keyframes fly-light-rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fly-light-show {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fly-fadeout {
    80% {
      opacity: 1;
      pointer-events: all;
    }
    100% {
      opacity: 0;
      pointer-events: none;
    }
  }

  @keyframes fly-bounce-grow {
    0% {
      bottom: -30%;
    }
    20% {
      bottom: -20%;
    }
    50% {
      bottom: 40%;
    }
    60% {
      bottom: 40%;
    }
    100% {
      bottom: 60%;
    }
  }
`;
