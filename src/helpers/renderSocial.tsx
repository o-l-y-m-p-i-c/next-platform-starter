import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import { ReactNode } from 'react';

export const renderSocial = (type: string): ReactNode | null => {
  switch (type) {
    case 'facebook':
      return <FacebookOutlinedIcon fontSize="small" />;
    case 'twitter':
      return <XIcon fontSize="small" />;
    case 'telegram':
      return <TelegramIcon fontSize="small" />;
    case 'website':
      return <LanguageIcon fontSize="small" />;
    default:
      return null;
  }
};
