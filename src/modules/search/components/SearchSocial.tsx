import { FC } from 'react';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import IconButton from '@mui/material/IconButton';
import XIcon from '@mui/icons-material/X';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { TTokenSocial } from '../../../types/responces/Token';

interface SearchSocialProp {
  socials: TTokenSocial[];
}

const SearchSocial: FC<SearchSocialProp> = ({ socials }) => {
  if (!socials.length) {
    return null;
  }

  const renderSocialButton = ({ type, link }: TTokenSocial) => {
    switch (type) {
      case 'website':
        return (
          <IconButton
            rel={'noopener'}
            sx={{ p: 0.5, fontSize: 17, zIndex: 2, position: 'relative' }}
            LinkComponent={Link}
            target={'_blank'}
            href={link}
            key={type}
          >
            <LanguageIcon fontSize={'inherit'} />
          </IconButton>
        );

      case 'telegram':
        return (
          <IconButton
            rel={'noopener'}
            sx={{ p: 0.5, fontSize: 17, zIndex: 2, position: 'relative' }}
            LinkComponent={Link}
            target={'_blank'}
            href={link}
            key={type}
          >
            <TelegramIcon fontSize={'inherit'} />
          </IconButton>
        );

      case 'twitter':
        return (
          <IconButton
            rel={'noopener'}
            sx={{ p: 0.5, fontSize: 17, zIndex: 2, position: 'relative' }}
            LinkComponent={Link}
            target={'_blank'}
            href={link}
            key={type}
          >
            <XIcon fontSize={'inherit'} />
          </IconButton>
        );

      default:
        return null;
    }
  };

  return (
    <Stack direction={'row'}>
      {socials.map((social) => renderSocialButton(social))}
    </Stack>
  );
};

export default SearchSocial;
