import { bsc, bscTestnet } from 'viem/chains';

const stakingPeriods = [
  {
    name: '3 months (max APY 10%)',
  },
  {
    name: '6 months (max APY 20%)',
  },
  {
    name: '12 months (max APY 50%)',
  },
];

const isProd = process.env.NEXT_PUBLIC_IS_PROD === 'true' ? true : false;

const CurrentStakingId = isProd ? bsc.id : bscTestnet.id;

const StakingAddress = (
  isProd
    ? process.env.NEXT_PUBLIC_BSC_STAKING
    : process.env.NEXT_PUBLIC_BSCTN_STAKING
) as `0x${string}`;

const MockTokenAddress = (
  isProd
    ? process.env.NEXT_PUBLIC_BSC_MOCK_TOKEN
    : process.env.NEXT_PUBLIC_BSCTN_MOCK_TOKEN
) as `0x${string}`;

export {
  isProd,
  stakingPeriods,
  CurrentStakingId,
  StakingAddress,
  MockTokenAddress,
};
