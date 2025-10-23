/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { stakingABI, tokenABI } from '../abi';
import { getContract, Hash, parseUnits, WalletClient } from 'viem';
import { Config, getBalance, waitForTransactionReceipt } from '@wagmi/core';
import {
  CurrentStakingId,
  MockTokenAddress,
  StakingAddress,
} from '../constants/staking.constants';

export const getUserStakingIds = async (
  address: readonly string[],
  walletClient: WalletClient,
): Promise<{ ids: number[] | null }> => {
  try {
    if (!walletClient) throw new Error('walletClient is not available');
    const contract = getContract({
      address: StakingAddress,
      abi: stakingABI,
      client: walletClient,
    });
    const ids: any = await contract.read.getUserStakingIds(address);
    return { ids: ids || [] };
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    return { ids: null };
  }
};

export const extendStakingPeriodAPI = async ({
  id,
  stakingPeriod,
  walletClient,
  callback,
  resetCallback,
  config,
}: {
  id: number;
  stakingPeriod: string;
  walletClient: WalletClient;
  callback?: () => void;
  resetCallback?: () => void;
  config: Config;
}): Promise<string | undefined> => {
  try {
    const contract = getContract({
      address: StakingAddress,
      abi: stakingABI,
      client: walletClient,
    });

    await contract.read.extendStakingPeriod([id, stakingPeriod]);
    const txHash = await contract.write.extendStakingPeriod([
      id,
      stakingPeriod,
    ]);

    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash,
    });

    if (transactionReceipt.status === 'success') {
      // update table
      if (callback) {
        callback();
      }
      if (resetCallback) {
        resetCallback();
      }

      toast('Transaction successful!');
    } else {
      console.error('Transaction failed:', transactionReceipt);
      if (callback) {
        callback();
      }
      if (resetCallback) {
        resetCallback();
      }

      toast('Transaction failed!');
    }
    return txHash;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    if (resetCallback) {
      resetCallback();
    }
  }
};

export const withdrawAllAPI = async ({
  id,
  walletClient,
  callback,
  resetCallback,
  config,
}: {
  id: number;
  walletClient: WalletClient;
  callback?: () => void;
  resetCallback?: () => void;
  config: Config;
}): Promise<string | undefined> => {
  try {
    const contract = getContract({
      address: StakingAddress,
      abi: stakingABI,
      client: walletClient,
    });

    await contract.read.withdrawAll([id]);
    const txHash = await contract.write.withdrawAll([id]);

    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash,
    });

    if (transactionReceipt.status === 'success') {
      // update table
      if (callback) {
        callback();
      }
      if (resetCallback) {
        resetCallback();
      }

      toast('Transaction successful!');
    } else {
      console.error('Transaction failed:', transactionReceipt);
      if (callback) {
        callback();
      }
      if (resetCallback) {
        resetCallback();
      }

      toast('Transaction failed!');
    }
    return txHash;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    if (resetCallback) {
      resetCallback();
    }
  }
};

export const getUserStakingInfo = async ({
  address,
  id,
  walletClient,
}: {
  address: string;
  id: number;
  walletClient: WalletClient;
}) => {
  try {
    if (!walletClient) throw new Error('walletClient is not available');
    const contract = getContract({
      address: StakingAddress,
      abi: stakingABI,
      client: walletClient,
    });
    const stakingInfo = await contract.read.getUserStakingInfo([address, id]);
    return stakingInfo;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
  }
};

export const getStakingPeriodInfo = async ({
  id,
  walletClient,
}: {
  id: number;
  walletClient: WalletClient;
}) => {
  try {
    if (!walletClient) throw new Error('walletClient is not available');
    const contract = getContract({
      address: StakingAddress,
      abi: stakingABI,
      client: walletClient,
    });
    const stakingInfo = await contract.read.getStakingPeriodInfo([id]);
    return stakingInfo;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    return { id: null };
  }
};

export const getDecimalsTokenEvm = async (
  tokenAddress: Hash,
  walletClient: WalletClient,
) => {
  try {
    if (!walletClient) throw new Error(`Wallet client is null`);
    const getDecimalsTokenEvm = getContract({
      address: tokenAddress,
      abi: tokenABI,
      client: walletClient,
    });

    const decimals: any = await getDecimalsTokenEvm.read.decimals();

    return decimals as number;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    return null;
  }
};

export const getStakeDataFlow = async ({
  chainId,
  address,
  walletClient,
}: {
  chainId: number | undefined;
  address: string | undefined;
  walletClient: WalletClient | undefined;
}): Promise<
  | {
      amount: number;
      startTime: number;
      period: string;
      dateOfUnlock: string;
      id: number;
      decimals: number;
    }[]
  | undefined
> => {
  try {
    if (!walletClient) throw new Error(`Client wallet is not available`);
    if (chainId !== CurrentStakingId)
      throw new Error(
        `Choose BNB Chain. Your current chain is ${chainId}: ${address}`,
      );
    if (address) {
      const { ids } = await getUserStakingIds([address], walletClient);
      if (ids) {
        const activeStakes: any[] = await Promise.all(
          ids?.map(
            async (id: number) =>
              await getUserStakingInfo({ address, id, walletClient }),
          ),
        );

        const stackingPeriod: any[] = await Promise.all(
          [0, 1, 2].map(
            async (id: number) =>
              await getStakingPeriodInfo({ id, walletClient }),
          ),
        );

        const decimals = await getDecimalsTokenEvm(
          MockTokenAddress,
          walletClient,
        );

        if (!decimals) throw new Error('decimals are null');

        const transformedActiveStakes = activeStakes.map(
          (
            stake,
            index,
          ): {
            amount: number;
            startTime: number;
            period: string;
            dateOfUnlock: string;
            id: number;
            decimals: number;
          } => {
            const id = ids[index];

            const amount = Number(
              (
                BigInt(stake.stakedAmount.toString()) / BigInt(10 ** decimals)
              ).toString(),
            );

            const period = BigInt(stake.stakingPeriod.toString()).toString();

            const stakingTime =
              stackingPeriod[Number(stake.stakingPeriod)].lockTime.toString();

            const dateOfUnlock = BigInt(
              Number(stake.startTime) + Number(stakingTime),
            ).toString();

            return {
              amount,
              startTime: Number(stake.startTime),
              period,
              dateOfUnlock,
              id,
              decimals,
            };
          },
        );

        return transformedActiveStakes;
      }
    }
  } catch (err) {
    const typedError = err as Error;
    toast(typedError.message);
    return [];
  }
};

export const finishTransaction = async ({
  config,
  txHash,
  callback,
  resetCallback,
}: {
  config: Config;
  txHash: `0x${string}`;
  callback?: () => void;
  resetCallback?: () => void;
}) => {
  const transactionReceipt = await waitForTransactionReceipt(config, {
    confirmations: 12,
    hash: txHash,
  });

  if (transactionReceipt.status === 'success') {
    if (callback) {
      await callback();
    }
    if (resetCallback) {
      await resetCallback();
    }

    toast('Transaction successful!');
  } else {
    console.error('Transaction failed:', transactionReceipt);
    if (callback) {
      await callback();
    }
    if (resetCallback) {
      await resetCallback();
    }

    toast('Transaction failed!');
  }
};

export const onStakeConfrim = async ({
  walletClient,
  inuptAmount,
  address,
}: {
  walletClient: WalletClient | undefined;
  inuptAmount: string;
  address: `0x${string}` | undefined;
}): Promise<string | null> => {
  try {
    if (!walletClient) {
      throw new Error('Client wallet not available');
    }
    if (!address) {
      throw new Error('Address not available');
    }

    const decimals: number | null = await getDecimalsTokenEvm(
      MockTokenAddress,
      walletClient,
    );

    if (!decimals) {
      throw new Error('Decimals not found');
    }

    const amount = await parseUnits(inuptAmount, decimals).toString();

    return amount;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    return null;
  }
};

export const fetchBalance = async ({
  config,
  address,
}: {
  config: Config;
  address: Hash;
}) => {
  try {
    const balanceResult = await getBalance(config, {
      address,
      token: MockTokenAddress,
    });
    return balanceResult.formatted;
  } catch (error) {
    console.error('Error fetching balance:', error);

    return null;
  }
};

export const approveTokenEvm = async ({
  amount,
  walletClient,
}: {
  amount: string;
  walletClient: WalletClient | undefined;
}): Promise<number | null> => {
  try {
    if (!walletClient) throw new Error('wallet client is not available');

    const contract = getContract({
      address: MockTokenAddress,
      abi: tokenABI,
      client: walletClient,
    });

    const decimals: any = await contract.read.decimals();

    if (!decimals) throw new Error(`Invalid decimals ${decimals}`);

    const AMOUNT = Number(amount) * 10 ** decimals;

    return AMOUNT;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    return null;
  }
};

export const getAllowanceTokenEvm = async (
  addressSpender: Hash,
  tokenAddress: Hash,
  walletClient: WalletClient,
  address: Hash,
) => {
  try {
    if (!walletClient) throw new Error('Client wallet is null ');

    const contract = getContract({
      address: tokenAddress,
      abi: tokenABI,
      client: walletClient,
    });

    if (!contract) throw new Error('Contract was not created');

    const _allowance: any = await contract.read.allowance([
      address,
      addressSpender,
    ]);

    const _decimals: any = await contract.read.decimals();

    const amount: string = (
      BigInt(_allowance.toString()) / BigInt(10 ** _decimals)
    ).toString();

    return amount;
  } catch (error) {
    const typedError = error as Error;
    toast(typedError.message);
    return null;
  }
};
