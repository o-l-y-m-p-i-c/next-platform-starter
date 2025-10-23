import { Avatar, Box, Button, Menu, MenuItem, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shortenAddress } from '../../utils/shortenAddress';
import { useAuth } from '@/hooks/useAuth';
import { useAccount } from 'wagmi';
import r from '@/constants/routes.constants';
import { useAppGlobal } from '@/hooks';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

const ProfileMenuSelect = ({
  listItems,
  showShortVariant = false,
  isToggleButton = false,
}: {
  showShortVariant?: boolean;
  listItems?: React.ReactNode[];
  isToggleButton?: boolean;
}) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const { isMenuOpen, setMenuOpen } = useAppGlobal();

  const { isConnected, address } = useAccount();

  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [isConnected, user]);

  const theme = useTheme();

  return (
    <>
      {isToggleButton && isConnected && user && (
        <>
          <Link href={r.profile} onClick={() => setMenuOpen(!isMenuOpen)}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              }}
            >
              {user && (
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: theme.palette.primary.dark,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {address?.toString()[0].toUpperCase()}
                </Avatar>
              )}
              {!showShortVariant && isConnected && address && (
                <Box
                  sx={{
                    display: {
                      xs: 'block',
                      sm: 'block',
                    },
                    color: '#fff',
                  }}
                >
                  {shortenAddress(address.toString())}
                </Box>
              )}

              {!isConnected && !user && 'Menu'}
            </Box>
          </Link>
          {listItems}
        </>
      )}
      {!isToggleButton && isConnected && user && (
        <>
          <Button
            fullWidth
            id="basic-button"
            sx={{
              textTransform: 'none',
              minWidth: 0,
              borderRadius: 100,
            }}
            aria-controls={isOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isOpen ? 'true' : undefined}
            onClick={handleClick}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flex: 1,
                alignItems: 'center',
              }}
            >
              {user && (
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: theme.palette.primary.dark,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {address?.toString()[0].toUpperCase()}
                </Avatar>
              )}
              {isConnected && !showShortVariant && address && (
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      sm: 'block',
                    },
                  }}
                >
                  {shortenAddress(address.toString(), 6)}
                </Box>
              )}

              {!isConnected && !user && 'Menu'}
            </Box>
            {/* <KeyboardArrowDownIcon
              sx={{
                scale: isOpen ? -1 : 1,
                mr: -1,
                ml: 0.5,
                transition: 'all 0.2s ease-out',
              }}
            /> */}
            {/* {!showShortVariant && (
              <MoreVertIcon
                sx={{
                  mr: -1,
                  ml: 0.5,
                  transition: 'all 0.2s ease-out',
                }}
              />
            )} */}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isOpen}
            onClose={handleClose}
            // MenuListProps={{
            //   'aria-labelledby': 'basic-button',
            // }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                router.push(r.profile);
              }}
            >
              Profile
            </MenuItem>
            {listItems && listItems.map((item: React.ReactNode) => item)}
          </Menu>
        </>
      )}
    </>
  );
};

export { ProfileMenuSelect };
