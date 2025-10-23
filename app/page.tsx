'use client';

import { MainLayoutWrapper } from './components/MainLayoutWrapper';
import { HomePage } from '../src/page-components';

export default function Home() {
  return (
    <MainLayoutWrapper>
      <HomePage />
    </MainLayoutWrapper>
  );
}
