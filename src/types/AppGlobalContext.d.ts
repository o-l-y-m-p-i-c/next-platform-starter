export type TAppGlobalContext = {
  setAnimations: (animations: boolean) => void;
  animations: boolean;
  theme?: string;
  setTheme: (theme?: string) => void;
  isMenuOpen: boolean;
  setMenuOpen: (isMenuOpen: boolean) => void;
  isFullWidth: boolean;
  setViewType: (isFullWidth: boolean) => void;
  referralCode: string | null;
  setReferralCode: (referralCode: string | null) => void;
  isSearchOpen: boolean;
  setSearchOpen: (isSearchOpen: boolean) => void;
  showLegalDisclaimer: boolean;
  setShowLegalDisclaimer: (isFullWidth: boolean) => void;
};
