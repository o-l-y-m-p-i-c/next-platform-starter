import { ToggleButton } from '@mui/material';
import { useAppGlobal } from '@/hooks';
import { Box, useMediaQuery } from '@mui/system';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export function AnimationSwitcher({
  size = 'small',
  isAdaptive = true,
}: {
  size?: 'small' | 'medium' | 'large';
  isAdaptive?: boolean;
}) {
  const { animations, setAnimations } = useAppGlobal();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const handleClick = () => {
    setAnimations(!animations);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <ToggleButton
        value="check"
        selected={animations}
        type="button"
        size={size}
        sx={{
          pb: 0.375,
          pt: 0.375,
          minWidth: isDesktop ? 107 : 0,
          position: 'relative',
          color: '#fff',
          gap: 1,
          background: 'rgba(0,0,0,0)',
          '&.Mui-selected': {
            background: '#FDD110',
            color: '#3C4040',
          },
          '&.Mui-selected:hover': {
            background: '#FDD110E8',
          },
        }}
        onChange={handleClick}
      >
        {isDesktop || !isAdaptive ? (
          animations ? (
            'Degen mode'
          ) : (
            'Boring mode'
          )
        ) : animations ? (
          <PauseIcon />
        ) : (
          <PlayArrowIcon />
        )}
        {/* {animations ? 'Degen mode' : 'Boring mode'} */}
      </ToggleButton>
    </Box>
  );
}
