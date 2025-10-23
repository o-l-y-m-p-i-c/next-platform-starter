// import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import TelegramIcon from '@mui/icons-material/Telegram';
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import { DiscordIcon } from '../assets/socials/DIscordIcon';
// import { MediumIcon } from '../assets/socials/MediumIcon';
// import { TelegramIcon2 } from '../assets/socials/TelegramIcon2';
// import { GitLabIcon } from '../assets/socials/GitlabIcon';
// import LanguageIcon from '@mui/icons-material/Language';

export const socials: {
  name: string;
  props: {
    href: string;
    target: '_blank' | '_self';
  };
  icon?: React.ReactNode;
  show: boolean;
}[] = [
  {
    name: 'Twitter',
    props: {
      href: 'https://x.com/trenchspy/status/1977546383528763722',
      target: '_blank',
    },
    icon: <XIcon />,
    show: true,
  },
];
