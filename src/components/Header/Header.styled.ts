import { styled, alpha } from '@mui/material/styles';
import ToolbarComponent from '@mui/material/Toolbar';

export const Brand = styled('div')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

export const Toolbar = styled(ToolbarComponent)(({ theme }) => ({
  columnGap: 20,
  position: 'fixed',
  width: '100%',
  top: 0,
  justifyContent: 'space-between',
  zIndex: 10,
  background: theme.palette.background.default,
}));

export const Search = styled('div')(({ theme }) => ({
  width: '150px',
  display: 'none',
  gap: 5,
  borderRadius: 100,
  color: theme.palette.text.secondary,
  // backgroundColor: '#272B31',
  cursor: 'pointer',
  alignItems: 'center',
  padding: '5px 10px',
  borderWidth: 1,
  height: 30.75,
  borderColor: alpha(theme.palette.common.white, 0.16),
  borderStyle: 'solid',

  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
