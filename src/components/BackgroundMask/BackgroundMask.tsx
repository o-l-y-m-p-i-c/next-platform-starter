import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export const BackgroundMask = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0, debug: false });

  useEffect(() => {
    let animation: gsap.core.Tween | null = null;

    const handleBodyMouseMove = (e: MouseEvent) => {
      if (animation) animation.kill();
      animation = gsap.to(coords, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        onUpdate: () => {
          setCoords((prev) => ({
            ...prev,
            x: coords.x,
            y: coords.y,
          }));
        },
        overwrite: 'auto',
      });
    };

    document.body.addEventListener('mousemove', handleBodyMouseMove);
    return () => {
      document.body.removeEventListener('mousemove', handleBodyMouseMove);
      if (animation) animation.kill();
    };
  }, []);
  return (
    <>
      {coords.debug && (
        <div
          className="mouse-coordinates"
          style={{
            position: 'fixed',
            top: 10,
            left: 10,
            background: '#222',
            color: '#fff',
            zIndex: 100000,
            padding: '5px 10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          X: {coords.x}, Y: {coords.y}
        </div>
      )}

      <div
        style={
          {
            display: 'flex',
            top: 0,
            left: 0,
            overflow: 'hidden',
            position: 'fixed',
            width: '100%',
            height: '100%',
            '--mask-position-x': coords.x + 'px',
            '--mask-position-y': coords.y + 'px',
            '--mask-radius': '75vh',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskImage:
              'radial-gradient(var(--mask-radius) at var(--mask-position-x) var(--mask-position-y),#000 0,transparent 100%)',
            maskImage:
              'radial-gradient(var(--mask-radius) at var(--mask-position-x) var(--mask-position-y),#000 0,transparent 100%)',
          } as React.CSSProperties & Record<string, unknown>
        }
      >
        <div
          style={
            {
              display: 'flex',
              pointerEvents: 'none',
              opacity: 0.5,
              position: 'absolute',
              width: '400%',
              height: '400%',
              '--gradient-position-x': '50%',
              '--gradient-position-y': '50%',
              '--gradient-width': '25%',
              '--gradient-height': '25%',
              '--gradient-tilt': '0deg',
              '--gradient-color-start': '#1DCED2',
              '--gradient-color-end': '#0000',
              background:
                'radial-gradient(ellipse var(--gradient-width) var(--gradient-height) at var(--gradient-position-x) var(--gradient-position-y),var(--gradient-color-start),var(--gradient-color-end))',
              transform: 'rotate(var(--gradient-tilt))',
              transformOrigin: 'center',
            } as React.CSSProperties & Record<string, unknown>
          }
        />
        <div
          style={
            {
              display: 'flex',
              pointerEvents: 'none',
              opacity: 0.2,
              position: 'absolute',
              width: '100%',
              height: '100%',
              '--dots-color': '#1DCED2',
              '--dots-size': '0.125rem',
              backgroundImage:
                'radial-gradient(var(--dots-color) 1px,#00000000 1px)',
              backgroundSize: 'var(--dots-size) var(--dots-size)',
            } as React.CSSProperties & Record<string, unknown>
          }
        />
      </div>
    </>
  );
};
