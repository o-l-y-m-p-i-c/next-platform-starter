'use client';

import { useMediaQuery } from '@mui/system';
import { FooterBottom } from './FooterBottom';
import { StickyFooter } from './StickyFooter';
import { MobileFixedFooter } from './MobileFixedFooter';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const isDesktop = useMediaQuery('(min-width:900px)');
  const pathname = usePathname();
  return (
    <>
      {isDesktop ? <StickyFooter /> : <MobileFixedFooter />}
      {!pathname.includes('/news') && <FooterBottom />}
    </>
  );
};
export { Footer };
