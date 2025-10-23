import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Check from '@mui/icons-material/Check';
const FilterList = ({
  handleHideSmallAcc,
  hideSmallAcc,
}: {
  handleHideSmallAcc: () => void;
  hideSmallAcc: boolean;
}) => {
  return (
    <>
      <MenuItem
        id="lock-button"
        aria-haspopup="listbox"
        aria-controls="lock-menu"
        aria-label="when device is locked"
        aria-expanded={hideSmallAcc ? 'true' : undefined}
        onClick={handleHideSmallAcc}
      >
        {hideSmallAcc && (
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        )}
        Hide small accounts
      </MenuItem>
    </>
  );
};

export { FilterList };
