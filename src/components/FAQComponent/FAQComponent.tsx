import {
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { DrawerComponent } from '../DrawerComponent';
import { useState } from 'react';
import { Box, Stack } from '@mui/system';
import { Accordion } from '../Accordion';

import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';

export const FAQComponent = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        sx={{
          border: 1,
          opacity: 0.5,
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={handleClick}
      >
        <QuestionMarkOutlinedIcon />
      </IconButton>
      <DrawerComponent
        drawerProps={{
          open,
          maxWidth: 'md',
        }}
        handleClose={handleClose}
        headerComponent={<Typography variant={'h1'}>FAQ</Typography>}
      >
        <Stack gap={3}>
          <Accordion
            {...{
              title: 'What is TrenchSpy.ai?',
              content: `TrenchSpy.ai is a next-generation deep research AI agent that
                helps you DYOR on any token by simply entering its contract
                address. Once you provide a contract address, our AI agent
                scours Crypto Twitter and thousands of Telegram groups to
                collect all mentions of that specific token. It then measures
                social sentiment and categorizes the most important comments —
                such as scam warnings, rugpull alerts, bundling alerts, or
                alpha. Finally, it condenses everything people are saying into
                one easy-to-read summary, giving you all the key details at a
                glance.`,
            }}
          />
          <Accordion
            {...{
              title: 'How does TrenchSpy.ai work?',
              isCustomContent: true,
              content: (
                <>
                  <Typography>
                    <b>Enter Contract Address:</b> You input the token’s
                    contract address into the search bar and select your coin.
                  </Typography>
                  <br />
                  <Typography>
                    <b>AI Agent Analysis:</b> Our AI agent scans across Twitter
                    and thousands of Telegram groups, gathering mentions of that
                    token.
                  </Typography>
                  <br />
                  <Typography>
                    <b> Categorizing & Summarizing:</b> The agent classifies
                    important discussions (e.g., scam warnings, rugpull alerts,
                    bundle alerts, or alpha calls) and summarize all the
                    chatter.
                  </Typography>
                  <br />
                  <Typography>
                    <b>Result:</b> You get a quick, condensed view of how people
                    feel about the token and what they’re saying.
                  </Typography>
                </>
              ),
            }}
          />
          <Accordion
            title={'What does "DYOR" mean?'}
            content={
              '"DYOR" stands for "Do Your Own Research." It’s a common phrase in crypto communities reminding to look beyond hype and marketing. TrenchSpy helps you gather the facts and sentiment data you need to make better-informed decisions.'
            }
          />
          <Accordion
            title={'Why should I use TrenchSpy.ai?'}
            content={
              <>
                <Typography>
                  <b>Time Saver:</b> Instead of manually searching Twitter or
                  Telegram, our AI agent does the heavy lifting for you.
                </Typography>
                <br />
                <Typography>
                  <b>Real-Time Insights:</b> We monitor conversations 24/7.
                </Typography>
                <br />
                <Typography>
                  <b>Detailed Sentiment:</b> We break down whether the coin is
                  likely a scam or not.
                </Typography>
                <br />
                <Typography>
                  <b> Important Flagging:</b> We categorize major warnings (like
                  scams or rug pulls) so you can spot red flags quickly.
                </Typography>
              </>
            }
            isCustomContent={true}
          />
          <Accordion
            title={'How do I research a token with TrenchSpy.ai?'}
            content={
              <>
                <List>
                  <ListItem
                    sx={{
                      p: 0,
                    }}
                  >
                    <Box p={2} mr={1}>
                      1
                    </Box>
                    <ListItemText>
                      Enter a contract address in the search bar and select your
                      coin
                    </ListItemText>
                  </ListItem>

                  <ListItem
                    sx={{
                      p: 0,
                    }}
                  >
                    <Box p={2} mr={1}>
                      2
                    </Box>
                    <ListItemText>
                      Wait for the AI agent to fetch and process data.
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    sx={{
                      p: 0,
                    }}
                  >
                    <Box p={2} mr={1}>
                      3
                    </Box>
                    <ListItemText>
                      See what the crypto community is saying about the token.
                    </ListItemText>
                  </ListItem>
                </List>
              </>
            }
            isCustomContent={true}
          />
          <Accordion
            title={'Is the data reliable?'}
            content={
              'Our AI agent scans publicly available sources across social media and categorizes mentions in real time. While we strive for high accuracy, all data is community-driven and can reflect biases or opinions. Always cross-check important info and remember that nobody can predict market movements with 100% certainty'
            }
          />
          <Accordion
            title={'Does TrenchSpy.ai provide financial advice?'}
            content={
              'No. TrenchSpy.ai is a research tool that aggregates and summarizes social chatter. We do not offer financial or investment advice. All decisions based on our data are entirely your own responsibility.'
            }
          />
          <Accordion
            title={'Is TrenchSpy.ai only for crypto?'}
            content={
              'Right now, TrenchSpy is focused on crypto tokens. However, our technology is designed to be very flexible. In the future, it could be applied to other industries—wherever you need deep social research at scale.'
            }
          />
          <Accordion
            title={'Do I need an account or KYC (Know Your Customer)?'}
            content={
              'No personal information is required. TrenchSpy.ai is fully Web3-enabled. You can simply connect your crypto wallet (e.g., MetaMask, Phantom) to access our services. There’s no need for an email or password.'
            }
          />
          <Accordion
            title={'How do I pay for TrenchSpy.ai?'}
            content={
              'We accept crypto payments in tokens like SOL (for Solana) or ETH (for Ethereum). You pay the subscription cost directly from your wallet, and once it’s confirmed on-chain, you have instant access to our services.'
            }
          />
          <Accordion
            title={'Can TrenchSpy handle large amounts of data?'}
            content={
              'Yes! Our AI agent is extremely scalable. It can process unlimited data, covering countless tokens and millions of social media posts without slowing down.'
            }
          />
          <Accordion
            title={'What if I encounter problems or have more questions?'}
            isCustomContent={true}
            content={
              <Typography>
                Our team is always ready to help. If you need assistance, you
                can reach us via our official X account (
                <Link target={'_blank'} href={'https://x.com/trenchspy'}>
                  https://x.com/trenchspy
                </Link>
                ).
              </Typography>
            }
          />
        </Stack>
      </DrawerComponent>
    </>
  );
};
