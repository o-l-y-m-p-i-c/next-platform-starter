import { styled } from '@mui/system';

export const Container = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: fixed;
  align-items: flex-start;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
`;

export const RelativeContainer = styled('div')`
  position: relative;
  width: 400px;
  height: 100%;
  // transform: translate(100px, 200px);
  // @media (max-width: 410px) {
  // transform: translate(50px, 200px);
  // }
`;

export const Shit = styled('div')`
  .animated-image {
    position: absolute;
    bottom: 15%; // finish
    bottom: 30%;
    left: 13.5vh;
    z-index: 3;
    width: 8vh;
    height: 8vh;
    // width: 100px;
    // height: 100px;
    animation:
      shit-bounce-grow 6s ease-in-out forwards,
      fadeout 6s ease-in-out forwards;
    transition: 0.35s cubic-bezier(0.25, 0.1, 0, 2.05);

    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
      width: 3.3vh;
      height: 3.3vh;
      border-radius: 50%;
      border: 2px solid white;
    }
  }

  @keyframes shit-bounce-grow {
    0% {
      bottom: 100%;
    }
    20% {
      bottom: 80%;
    }
    50% {
      bottom: 30%;
    }
    60% {
      bottom: 35%;
    }
    100% {
      bottom: 15%;
    }
  }

  @keyframes fadeout {
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const Toilet = styled('div')`
  .animated-image {
    position: absolute;
    bottom: 0px; /* Initial position */
    // top: 50%;
    // left: -50px;
    left: 0px;
    z-index: 2;
    width: 32vh;
    height: 32vh;
    animation:
      bounce-grow 1s ease-out forwards,
      move-up 1s ease-out forwards,
      rotation 1s ease-in forwards,
      fadeout 6.5s ease-in-out forwards;
    transition: 0.35s cubic-bezier(0.25, 0.1, 0, 2.05);
  }

  .animated-light {
    position: absolute;
    bottom: 7vh; /* Initial position */
    // top: 52%;
    left: 8vh;
    z-index: 1;
    width: 20vh;
    height: 20vh;
    animation:
      light-rotation 3s ease-out forwards infinite,
      light-show 2s ease-out forwards,
      fadeout 5s ease-in-out forwards;
    animation-iteration-count: linear;
  }

  @keyframes light-rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes light-show {
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

  @keyframes bounce-grow {
    0% {
      width: 0vh;
      height: 0vh;
      transform: scale(0);
    }
    30% {
      width: 20vh; /* Slight overshoot for bounce effect */
      height: 20vh;
      transform: scale(1);
    }
    60% {
      width: 10vh; /* Shrinking a bit */
      height: 10vh;
      transform: scale(0.8);
    }
    100% {
      width: 32vh; /* Final size */
      height: 32vh;
      transform: scale(1);
    }
  }

  @keyframes rotation {
    0% {
      transform: rotate(-180deg);
    }
    95% {
      transform: rotate(1070deg);
    }
    97% {
      transform: rotate(1050deg);
    }
    100% {
      transform: rotate(1070deg);
    }
  }

  @keyframes fadeout {
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes move-up {
    0% {
      bottom: 100px;
    }
    100% {
      bottom: 1000px;
    }
  }

  @keyframes move-up {
    0% {
      bottom: -100px;
    }
    100% {
      bottom: 20px;
    }
  }
`;
