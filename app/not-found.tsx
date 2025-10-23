'use client';

import { MainLayoutWrapper } from './components/MainLayoutWrapper';
import { PageNotFound } from '../src/page-components';

export default function NotFound() {
  return (
    <MainLayoutWrapper>
      <PageNotFound />
    </MainLayoutWrapper>
  );
}
