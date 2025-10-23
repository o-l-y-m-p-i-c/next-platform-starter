import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { CircularProgress } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SxProps } from '@mui/system';

const newOptions: {
  name: string;
  supports: ('solana' | 'eip155-56' | 'eip155-1' | 'eip155-8453' | 'sui')[];
  createUrl: ({
    chainID,
    address,
    refCode,
  }: {
    chainID?: string;
    address: string;
    refCode?: string;
  }) => string;
}[] = [
  {
    name: 'BullX',
    supports: ['solana', 'eip155-56', 'eip155-1', 'sui'],
    createUrl: ({
      chainID = '1399811149',
      address,
      refCode = 'NLY4C1928YA',
    }) => {
      const formatedID = (id: string) => {
        switch (id) {
          case 'solana':
            return 1399811149;
          case 'eip155-1':
            return 1;
          case 'eip155-56':
            return 56;
          case 'sui':
            return 101;

          default:
            return 1399811149;
        }
      };

      // solana - 1399811149

      // eth - 1

      // bsc - 56

      // sui - 101
      return `https://bullx.io/terminal?chainId=${formatedID(chainID)}&address=${address}&r=${refCode}`;
    },
  },
  {
    name: 'BullX Neo',
    supports: ['solana', 'eip155-56', 'eip155-1', 'sui'],
    createUrl: ({
      chainID = '1399811149',
      address,
      refCode = 'NLY4C1928YA',
    }) => {
      const formatedID = (id: string) => {
        switch (id) {
          case 'solana':
            return 1399811149;
          case 'eip155-1':
            return 1;
          case 'eip155-56':
            return 56;
          case 'sui':
            return 101;

          default:
            return 1399811149;
        }
      };

      // solana - 1399811149

      // eth - 1

      // bsc - 56

      // sui - 101
      return `https://neo.bullx.io/terminal?chainId=${formatedID(chainID)}&address=${address}&r=${refCode}`;
    },
  },
  {
    name: 'DexScreener',
    supports: ['solana', 'eip155-56', 'eip155-1', 'sui', 'eip155-8453'],
    createUrl: ({ chainID = 'solana', address }) => {
      const formatedID = (id: string) => {
        switch (id) {
          case 'solana':
            return 'solana';
          case 'eip155-1':
            return 'ethereum';
          case 'eip155-56':
            return 'bsc';
          case 'sui':
            return 'sui';
          case 'eip155-8453':
            return 'base';

          default:
            return 'solana';
        }
      };
      // solana - solana

      // ethereum - ethereum

      // bsc - bsc

      // sui - sui

      // base - base
      return `https://dexscreener.com/${formatedID(chainID)}/${address}`;
    },
  },
  {
    name: 'GMGN',
    supports: ['solana', 'eip155-56', 'eip155-1', 'eip155-8453'],
    createUrl: ({ chainID = 'sol', address, refCode = 'nmeCiQDb' }) => {
      const formatedID = (id: string) => {
        switch (id) {
          case 'solana':
            return 'sol';
          case 'eip155-1':
            return 'eth';
          case 'eip155-56':
            return 'bsc';
          case 'eip155-8453':
            return 'base';

          default:
            return 'sol';
        }
      };
      // solana - sol

      // bnb - bsc

      // ethereum - eth

      // base - base

      return `https://gmgn.ai/${formatedID(chainID)}/token/${refCode}_${address}`;
    },
  },
  {
    name: 'Jupiter',
    supports: ['solana', 'eip155-56', 'eip155-1'],

    createUrl: ({
      chainID = 'So11111111111111111111111111111111111111112',
      address,
    }) => {
      const formatedID = (id: string) => {
        switch (id) {
          case 'solana':
            return 'So11111111111111111111111111111111111111112';
          case 'eip155-1':
            return 'ETH';
          case 'eip155-56':
            return 'BNB';
          default:
            return 'So11111111111111111111111111111111111111112';
        }
      };

      // solana - So11111111111111111111111111111111111111112

      // bsc - BNB

      // ethereum - ETH

      return `https://jup.ag/swap/${formatedID(chainID)}-${address}`;
    },
  },
  //   solana wallets:
  {
    name: 'Photon',
    supports: ['solana', 'eip155-1', 'eip155-8453'],
    createUrl: ({ address, chainID = '-sol', refCode = '@trenchspy' }) => {
      const formatedID = (id: string) => {
        switch (id) {
          case 'solana':
            return '-sol';
          case 'eip155-1':
            return '';
          case 'eip155-8453':
            return '-base';
          default:
            return '-sol';
        }
      };
      // @trenchspy

      // eth - "empty"

      // solana - -sol

      // base - -base

      return `https://photon${formatedID(chainID)}.tinyastro.io/en/r/${refCode}/${address}`;
    },
  },
  {
    name: 'Trojan Bot',
    supports: ['solana'],
    createUrl: ({ address, refCode = 'ref_trenchspy' }) =>
      // ?start=ref_trenchspy
      `https://t.me/solana_trojanbot?start=${refCode}-${address}`,
  },
  {
    name: 'Bloom Bot',
    supports: ['solana'],
    createUrl: ({ address, refCode = 'ref_trenchspy_ca' }) => {
      // ?start=ref_trenchspy_ca
      return `https://t.me/BloomSolana_bot?start=${refCode}_${address}`;
    },
  },
];

const localQuickBuyParam = 'LocalQuickBuyParam';

export function QuickBuyButton({
  sx,
  address,
  chainID,
}: {
  sx?: SxProps;
  address: string;
  chainID: string;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(1);

  const [isLoading, setLoading] = useState(true);

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(localQuickBuyParam, JSON.stringify(index));
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const validClosestsIndex = useMemo(() => {
    return newOptions.findIndex((option) =>
      option.supports.includes(
        chainID as 'solana' | 'eip155-56' | 'eip155-1' | 'eip155-8453' | 'sui',
      ),
    );
  }, [chainID]);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      setSelectedIndex(validClosestsIndex);
      setLoading(false);
      return;
    }

    const storedIndex = localStorage.getItem(localQuickBuyParam);
    if (storedIndex) {
      const isValid = !!(
        Number(JSON.parse(storedIndex)) &&
        Number(JSON.parse(storedIndex)) < newOptions.length &&
        newOptions[Number(JSON.parse(storedIndex))].supports.includes(
          chainID as
            | 'solana'
            | 'eip155-56'
            | 'eip155-1'
            | 'eip155-8453'
            | 'sui',
        )
      );

      setSelectedIndex(
        isValid ? Number(JSON.parse(storedIndex)) : validClosestsIndex,
      );
      setLoading(false);
    } else {
      setSelectedIndex(validClosestsIndex);
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [chainID, validClosestsIndex]);

  if (validClosestsIndex !== 0 && !validClosestsIndex) {
    return <></>;
  }

  return (
    <>
      <ButtonGroup
        sx={sx}
        fullWidth
        variant="outlined"
        disabled={isLoading}
        aria-label="Button group with a nested menu"
      >
        <Button
          href={newOptions[selectedIndex].createUrl({
            address,
            // chainID,
          })}
          sx={{
            '&:hover': {
              color: 'var(--variant-outlinedColor)',
            },
            whiteSpace: 'nowrap',
          }}
          target={'_blank'}
        >
          {!isLoading ? (
            `Buy on ${newOptions[selectedIndex].name}`
          ) : (
            <CircularProgress size={15} />
          )}
        </Button>
        <Button
          size="small"
          ref={anchorRef}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          sx={{
            width: 'auto',
          }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {newOptions
                    .filter((filter_option) =>
                      filter_option.supports.includes(
                        chainID as
                          | 'solana'
                          | 'eip155-56'
                          | 'eip155-1'
                          | 'eip155-8453'
                          | 'sui',
                      ),
                    )
                    .map((option, index) => (
                      <MenuItem
                        key={option.name}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
