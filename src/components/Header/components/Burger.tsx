import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ToggleButton } from '@mui/material';

type TBurger = {
  open: boolean;
  setOpen?: (value: boolean) => void;
};
export const Burger = ({ open, setOpen }: TBurger) => {
  const handleClick = () => {
    if (setOpen) {
      setOpen(!open);
    }
  };

  return (
    <ToggleButton
      value={open}
      sx={{ p: 0.5, border: 'none' }}
      onClick={handleClick}
    >
      {!open ? <MenuIcon /> : <CloseIcon />}
    </ToggleButton>
  );
};
