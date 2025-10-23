import { useContext } from 'react';
import { AppGlobalContext } from '../context';
import { TAppGlobalContext } from '@/types/AppGlobalContext';

const useAppGlobal = () => {
  return useContext(AppGlobalContext) as TAppGlobalContext;
};

export { useAppGlobal };
