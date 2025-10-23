import { ToggleButton } from '@mui/material';
import { useAppGlobal } from '@/hooks';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const ViewSwitcher = () => {
  const { isFullWidth, setViewType } = useAppGlobal();
  return (
    <ToggleButton
      value="check"
      //   selected={isFullWidth}
      sx={{
        height: 30.75,
        minWidth: 0,
        p: 1,
      }}
      onClick={() => {
        setViewType(!isFullWidth);
      }}
    >
      {isFullWidth ? <FitScreenIcon /> : <DashboardIcon />}
    </ToggleButton>
  );
};
