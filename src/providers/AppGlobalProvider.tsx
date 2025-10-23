'use client';

import { useState, useCallback, useEffect } from 'react';

import { AppGlobalContext } from '../context';

const localStorageAnimationKey = 'animation';
const localStorageFullWidthKey = 'view_is_full';
const localStorageReferralCodeKey = 'referralCode';
const localStorageLegalCheckKey = 'legal_check';

const AppGlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [animationFlag, setAnimations] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isFullWidth, setFullWidth] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [showLegalDisclaimer, setShowLegalDisclaimer] =
    useState<boolean>(false);

  const setAllLocalStorageData = () => {
    const storedAnimation = localStorage.getItem(localStorageAnimationKey);
    const storedFullWidth = localStorage.getItem(localStorageFullWidthKey);
    const storedReferralCode = localStorage.getItem(
      localStorageReferralCodeKey,
    );

    const isLegalDisclaimerChecked = localStorage.getItem(
      localStorageLegalCheckKey,
    );

    if (!isLegalDisclaimerChecked) {
      setShowLegalDisclaimer(true);
    }

    if (storedAnimation !== null) {
      setAnimations(JSON.parse(storedAnimation));
    }
    if (storedFullWidth !== null) {
      setFullWidth(JSON.parse(storedFullWidth));
    }
    if (storedReferralCode !== null) {
      setReferralCode(storedReferralCode);
    }
  };

  useEffect(() => {
    setAllLocalStorageData();
  }, []);

  const setAnimationFn = useCallback(async (animationFlag?: boolean) => {
    localStorage.setItem(
      localStorageAnimationKey,
      JSON.stringify(animationFlag),
    );

    setAnimations(animationFlag || false);
  }, []);

  const setViewFn = useCallback(async (flag?: boolean) => {
    localStorage.setItem(localStorageFullWidthKey, JSON.stringify(flag));

    setFullWidth(flag || false);
  }, []);

  const setReferralCodeFn = useCallback(async (code?: string | null) => {
    if (!code) {
      localStorage.removeItem(localStorageReferralCodeKey);
    } else {
      localStorage.setItem(localStorageReferralCodeKey, code);
    }

    setReferralCode(code || null);
  }, []);

  const setShowLegalDisclaimerFn = useCallback(async (flag: boolean) => {
    if (!flag) {
      localStorage.removeItem(localStorageLegalCheckKey);
    } else {
      localStorage.setItem(localStorageLegalCheckKey, flag.toString());
    }

    setShowLegalDisclaimer(!flag || false);
  }, []);

  useEffect(() => {
    if (animationFlag) {
      document.querySelector('#root')?.classList.remove('default');
    } else {
      document.querySelector('#root')?.classList.add('default');
    }
  }, [animationFlag]);

  const setSearchOpenFn = (arg: boolean) => {
    setSearchOpen(arg);
  };

  return (
    <AppGlobalContext.Provider
      value={{
        setAnimations: setAnimationFn,
        animations: animationFlag,
        theme: theme,
        setTheme: setTheme,
        isMenuOpen,
        setMenuOpen,
        isFullWidth,
        setViewType: setViewFn,
        referralCode: referralCode,
        setReferralCode: setReferralCodeFn,
        isSearchOpen,
        setSearchOpen: setSearchOpenFn,
        showLegalDisclaimer,
        setShowLegalDisclaimer: setShowLegalDisclaimerFn,
      }}
    >
      {children}
    </AppGlobalContext.Provider>
  );
};

export { AppGlobalProvider };
