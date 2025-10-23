import { Button, Menu } from '@mui/material';
import { FilterList } from './FilterList';
import { useState } from 'react';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const TokenTwitterFilterMenu = ({
  hideSmallAcc = false,
  hideSmallAccFn,
}: {
  hideSmallAcc: boolean;
  hideSmallAccFn: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHideSmallAcc = () => {
    setAnchorEl(null);
    hideSmallAccFn();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        id="lock-button"
        aria-haspopup="listbox"
        aria-controls="lock-menu"
        aria-label="when device is locked"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickListItem}
        variant={'outlined'}
        sx={{
          borderRadius: 100,
          minWidth: 40,
          minHeight: 40,
          pl: 1,
          pr: 1,
        }}
      >
        <SettingsRoundedIcon color={'inherit'} />
      </Button>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        <FilterList
          handleHideSmallAcc={handleHideSmallAcc}
          hideSmallAcc={hideSmallAcc}
        />
      </Menu>
    </>
  );
};

export { TokenTwitterFilterMenu };
