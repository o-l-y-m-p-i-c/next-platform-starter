import { IconButton, List, ListItem } from '@mui/material';
import { socials } from '../../constants/socials.contsnts';
import Link from 'next/link';

const Socials = () => {
  return (
    <List
      sx={{
        display: 'flex',
        gap: 1.5,
        rowGap: 1.5,
        flexWrap: 'wrap',
        justifyContent: {
          xs: 'center',
          md: 'flex-start',
        },
      }}
    >
      {socials
        .filter((social) => social.show)
        .map((social) => {
          return (
            <ListItem
              key={social.name}
              sx={{
                flex: 0,
                display: 'flex',
                p: 0,
              }}
            >
              <Link {...social.props}>
                <IconButton
                  color={'primary'}
                  sx={{
                    p: 0.75,
                    border: '1px solid',
                  }}
                >
                  {social.icon || social.name}
                </IconButton>
              </Link>
            </ListItem>
          );
        })}
    </List>
  );
};

export { Socials };
