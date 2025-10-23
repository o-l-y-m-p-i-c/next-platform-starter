import { Collapse, List, ListItem, Toolbar } from '@mui/material';
import { Box, Stack, useMediaQuery } from '@mui/system';
import { ReactNode } from 'react';
import { Socials } from '../../Socials';
import {
  mobileMenuBottomList,
  mobileMenuTopList,
} from '../../../constants/routes.constants';
import NavLink from 'next/link';

type TSidebar = {
  open: boolean;
  header: HTMLElement;
  children?: ReactNode | string;
  setOpen: (value: boolean) => void;
};

export const Sidebar = ({ open, header, children, setOpen }: TSidebar) => {
  const height = header.getBoundingClientRect().height;
  const isDesktop = useMediaQuery('(min-width:600px)');

  return (
    <>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Toolbar
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          }}
        >
          <Stack
            sx={{
              gridColumn: '3 span',
              width: '100%',
              margin: '0 auto',
              pt: 1,
              pb: 1,
              height: isDesktop ? 'auto' : `calc(100svh - ${height}px)`,
            }}
          >
            <Stack flex={1} position={'relative'} mb={1} mt={1}>
              <Stack
                sx={{
                  position: isDesktop ? 'static' : 'absolute',
                  width: '100%',
                  height: '100%',
                  maxHeight: isDesktop ? 300 : '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  top: 0,
                  left: 0,
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                }}
              >
                <Stack
                  pt={1}
                  pb={1}
                  gap={1}
                  flex={1}
                  // alignItems={'center'}
                  // justifyContent={'center'}
                >
                  <List>
                    {mobileMenuTopList
                      .filter((menuItem) => menuItem.show)
                      .map((menuItem) => (
                        <ListItem disablePadding key={menuItem.key}>
                          {menuItem?.custom ? (
                            menuItem.content
                          ) : (
                            <NavLink
                              {...menuItem.props}
                              onClick={() => setOpen(!open)}
                              style={{
                                flex: 1,
                                color: 'white',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                padding: '8px',
                                display: 'block',
                              }}
                            >
                              <Stack
                                direction={'row'}
                                alignItems={'center'}
                                gap={2}
                              >
                                {menuItem.icon}
                                {menuItem.content}
                              </Stack>
                            </NavLink>
                          )}
                        </ListItem>
                      ))}
                  </List>
                  {!isDesktop && children}
                  {!isDesktop && (
                    <List
                      sx={{
                        width: '100%',
                        '&:has(button)': {
                          mt: -1,
                        },
                      }}
                    >
                      {mobileMenuBottomList
                        .filter((menuItem) => menuItem.show)
                        .map((menuItem, index) => (
                          <ListItem
                            disablePadding
                            key={`${menuItem.key}-${index}`}
                            sx={{
                              width: '100%',
                              justifyContent: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              // textAlign: 'center',
                              '*': {
                                flex: 1,
                                textAlign: 'center',
                                justifyContent: 'center!important',
                                fontWeight: 'bold!important',
                              },
                              '& li': {
                                mt: 1,
                                p: 0,
                                textTransform: 'uppercase',
                              },
                              button: {
                                height: 44,
                                width: '100%',
                              },
                              '&:has(button)': {
                                p: 0,
                              },
                              'div:has(button)': {
                                width: '100%',
                              },
                            }}
                          >
                            {menuItem?.custom ? (
                              menuItem.content
                            ) : (
                              <NavLink
                                {...menuItem.props}
                                onClick={() => setOpen(!open)}
                                style={{
                                  color: 'white',
                                  textDecoration: 'none',
                                  textTransform: 'uppercase',
                                  fontWeight: 'bold',
                                  display: 'block',
                                }}
                              >
                                {menuItem.content}
                              </NavLink>
                            )}
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Stack>
              </Stack>
            </Stack>
            <Stack
              mt={'auto'}
              sx={{
                borderTop: '1px solid rgba(255, 255, 255, 0.16)',
              }}
              p={1}
              pb={0}
              // m={-2}
              mb={0}
              gap={1}
              alignItems={'center'}
            >
              <Stack
                sx={{
                  svg: {
                    height: 20,
                    width: 20,
                  },
                  button: {
                    p: 0.5,
                  },
                }}
              >
                <Socials />
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </Collapse>
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            cursor: 'pointer',
            top: '100%',
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        ></Box>
      )}
    </>
  );
};
