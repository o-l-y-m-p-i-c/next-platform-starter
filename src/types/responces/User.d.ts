type TBlockchain = {
  address: string;
  network: string;
};

export type TUser = {
  user: {
    username: string;
    blockchains: TBlockchain[];
    whiteListNumber: number;
    createdAt: string;
    referralCode: string;
  };
  token: {
    token: string;
    valid: string;
  };
};
