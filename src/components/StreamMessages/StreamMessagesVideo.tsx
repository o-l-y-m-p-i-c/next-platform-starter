import { FC, useEffect, useRef } from 'react';

import * as styled from './StreamMessages.styled';

const StreamMessagesVideo: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Auto-play was prevented:', error);
          video.muted = true;
          video.play();
        });
      }
    }
  }, []);

  return (
    <styled.Video ref={videoRef} autoPlay loop muted playsInline>
      <source src="/video/cs_vid.webm" type="video/webm" />
      Your browser does not support the video tag.
    </styled.Video>
  );
};

export default StreamMessagesVideo;
