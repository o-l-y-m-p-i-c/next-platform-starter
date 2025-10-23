import { ReactElement, ReactNode } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { isProd } from './staking.constants';
import { Box } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import FeedIcon from '@mui/icons-material/Feed';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GroupIcon from '@mui/icons-material/Group';
import RadarIcon from '@mui/icons-material/Radar';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import StarsIcon from '@mui/icons-material/Stars';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TelegramIcon from '@mui/icons-material/Telegram';
import { LinkProps } from 'next/link';

const r = {
  root: '/',
  search: '/search',
  token: '/token',
  news: '/news',
  profile: '/profile',
  users: '/kols',
  userDetails: '/kol',
  projects: '/projects',
  projectDetails: '/project',
  tags: '/tags',
  hypechart: '/hypechart',
  hypedetector: '/hypedetector',
  featured: '/tags',
  recentlyBonded: '/recentlybonded',
  snipers: '/snipers',
  tweets: '/tweets',
  telegramCalls: '/tgcalls',
};

export const mobileMenuTopList: {
  key: string;
  props: LinkProps & {
    color?: string;
  };
  show: boolean;
  content: string | ReactNode;
  custom?: boolean;
  icon: ReactElement;
}[] = [
  {
    key: r.root,
    props: {
      href: r.root,
    },
    show: true,
    content: 'Home',
    icon: <HomeIcon />,
  },
  {
    key: r.hypedetector,
    props: {
      href: r.hypedetector,
    },
    show: true,
    content: 'Hype Detector',
    icon: <RadarIcon />,
  },
  {
    key: r.hypechart,
    props: {
      href: r.hypechart,
    },
    show: true,
    content: 'Hype Map',
    icon: <TravelExploreIcon />,
  },
  {
    key: r.featured,
    props: {
      href: r.featured,
    },
    show: true,
    content: 'Narratives',
    icon: <StarsIcon />,
  },
  {
    key: r.tweets,
    props: {
      href: r.tweets,
    },
    show: true,
    content: 'Latest Tweets',
    icon: <ConnectWithoutContactIcon />,
  },
  {
    key: r.tags,
    props: {
      href: r.tags,
    },
    show: false,
    content: 'Portfolios',
    icon: <LibraryBooksIcon />,
  },
  {
    key: r.telegramCalls,
    props: {
      href: r.telegramCalls,
    },
    show: true,
    icon: <TelegramIcon />,
    content: 'Telegram Calls',
  },
  {
    key: r.users,
    props: {
      href: r.users,
    },
    show: isProd ? false : true,
    content: 'KOLs',
    icon: <GroupIcon />,
  },

  {
    key: r.recentlyBonded,
    props: {
      href: r.recentlyBonded,
    },
    show: true,
    content: 'Recently Bonded',
    icon: <TipsAndUpdatesIcon />,
  },
  {
    key: r.snipers,
    props: {
      href: r.snipers,
    },
    show: true,
    content: 'Snipers',
    icon: <ModeStandbyIcon />,
  },

  {
    key: r.news,
    props: {
      href: r.news,
    },
    show: true,
    content: 'News',
    icon: <FeedIcon />,
  },
  {
    key: r.profile,
    props: {
      href: r.profile,
    },
    show: false,
    content: 'Profile',
    icon: <AccountCircleIcon />,
  },
];

export const mobileMenuBottomList: {
  key: string;
  props: LinkProps & {
    color?: string;
  };
  show: boolean;
  content: string | ReactNode;
  custom?: boolean;
}[] = [
  {
    key: r.profile,
    props: {
      href: r.profile,
    },
    show: true,
    custom: true,
    content: (
      <Box
        sx={{
          button: {
            fontSize: 16,
            fontWeight: '500!important',
          },
        }}
      >
        <AuthButton isToggleButton={true} isOnlyDesktopVersion={true} />
      </Box>
    ),
  },
];

export default r;
