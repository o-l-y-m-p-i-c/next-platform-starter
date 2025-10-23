import { Tab, Tabs, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import { Box, Stack } from '@mui/system';
import BlurPlaceholder from '../BlurPlaceholder';
import { LatestTweets } from './LatestTweets';
import { OldTweets } from './OldTweets';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    value === index && (
      <Stack flex={1} sx={{ p: 0 }}>
        {children}
      </Stack>
    )
  );
}

export const TopTokenTweets: FC<{
  tokenSlug: string | undefined;
  mintedAt: string | undefined;
  tokenPrice: number | undefined;
}> = ({ tokenSlug = '', mintedAt, tokenPrice }) => {
  if (!mintedAt) {
    return (
      <Box m={-1} flex={1}>
        <BlurPlaceholder
          block={'price-chart'}
          customContent={
            <Stack>
              <Typography variant={'h6'} gutterBottom>
                No tweets found
              </Typography>
            </Stack>
          }
        />
      </Box>
    );
  }

  const limit = 6;

  const minFollowers = 100000;

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Stack m={-1}>
        <Tabs
          value={value}
          variant={'fullWidth'}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Latest tweets" {...a11yProps(0)} />
          <Tab label="Earliest tweets" {...a11yProps(1)} />
        </Tabs>
        <Stack flex={1}>
          <CustomTabPanel value={value} index={0}>
            <LatestTweets
              tokenPrice={tokenPrice}
              minFollowers={minFollowers}
              tokenSlug={tokenSlug}
              limit={limit}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <OldTweets
              tokenPrice={tokenPrice}
              minFollowers={minFollowers}
              tokenSlug={tokenSlug}
              limit={limit}
              mintedAt={mintedAt}
            />
          </CustomTabPanel>
        </Stack>
      </Stack>
    </>
  );
};
