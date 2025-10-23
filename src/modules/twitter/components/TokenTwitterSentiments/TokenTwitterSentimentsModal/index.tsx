import { FC, Fragment, Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  QuotedTweet,
  Tweet,
  TweetActions,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInfo,
  TweetInReplyTo,
} from 'react-tweet';
import { useNetwork } from '@mantine/hooks';
import { useTheme } from '@mui/material/styles';
import { ITwitterTweet } from '../../../twitter.interfaces';
import { mappingEnrichedTweet } from '../../../twitter.utils';
// import PriceGrain from './PriceGrain';
import { ImageWithFallback } from '../../../../../components/ImageWithFallback';
import { Stack } from '@mui/system';
import PriceGrain from './PriceGrain';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppGlobal } from '../../../../../hooks';

interface TokenTwitterSentimentsModalProp {
  tweets: ITwitterTweet[];
  tokenPrice?: number | null | undefined;
  opened: boolean;
}

// Internal component that uses useSearchParams
const TweetExplanationContent = ({
  tokens,
  hideCustomMargin = false,
}: {
  tokens: { token: string; sentiment: string; explanation?: string }[];
  hideCustomMargin?: boolean;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const explanations = tokens.filter((token) => token.explanation);

  const { setSearchOpen } = useAppGlobal();

  const handleChipClick = ({ tokenName }: { tokenName: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', tokenName);
    router.replace(`?${params.toString()}`);
    setSearchOpen(true);
  };

  if (explanations.length > 0) {
    return (
      <>
        <Accordion
          sx={{
            border: '1px solid #455362',
            background: 'rgb(21, 32, 43)',
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 12,
            overflow: 'hidden',
            ...(hideCustomMargin && { mt: '-33px!important' }),
            ...(!hideCustomMargin && { mt: '-10px!important' }),
            zIndex: 1,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction={'row'} alignItems={'center'} gap={1}>
              <Typography whiteSpace={'nowrap'} component="span">
                AI Reasoning
              </Typography>
              <Stack
                direction={'row'}
                flexWrap={'wrap'}
                alignItems={'center'}
                gap={0.75}
              >
                {explanations.slice(0, 4).map((explanation) => {
                  const tokenName = `${explanation.token}`;
                  return (
                    <Chip
                      key={`${explanation.token}-AccordionSummary`}
                      sx={{
                        fontWeight: 'bold',
                      }}
                      onClick={() =>
                        handleChipClick({ tokenName: explanation.token })
                      }
                      title={tokenName}
                      size="small"
                      label={
                        tokenName.length > 20
                          ? `${tokenName.slice(20)}...`
                          : tokenName
                      }
                      variant={'filled'}
                      color={
                        explanation.sentiment === 'positive'
                          ? 'success'
                          : explanation.sentiment === 'negative'
                            ? 'error'
                            : 'default'
                      }
                    />
                  );
                })}
                {explanations.length > 4 && (
                  <Typography component="span">...</Typography>
                )}
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {explanations.map((explanation) => {
              const tokenName = `${explanation.token}`;
              return (
                <Box
                  key={`${explanation.token}-AccordionDetails`}
                  sx={{
                    mb: 1,
                  }}
                >
                  <Chip
                    size={'small'}
                    onClick={() =>
                      handleChipClick({ tokenName: explanation.token })
                    }
                    title={tokenName}
                    color={
                      explanation.sentiment === 'positive'
                        ? 'success'
                        : explanation.sentiment === 'negative'
                          ? 'error'
                          : 'default'
                    }
                    sx={{
                      fontWeight: 'bold',
                    }}
                    label={
                      tokenName.length > 20
                        ? `${tokenName.slice(20)}...`
                        : tokenName
                    }
                  />{' '}
                  <Typography
                    sx={{
                      display: 'inline',
                      fontSize: 15,
                      color:
                        explanation.sentiment === 'positive'
                          ? '#2DEA69'
                          : explanation.sentiment === 'negative'
                            ? '#F83C3C'
                            : 'default',
                    }}
                  >
                    {explanation.explanation}
                  </Typography>
                </Box>
              );
            })}
          </AccordionDetails>
        </Accordion>
        <Stack
          sx={{
            display: 'none',
            p: 1,
            borderRadius: 3,
            border: '1px solid #455362',
          }}
        >
          <Stack gap={0.5} p={1}>
            <Typography
              variant={'h6'}
              textAlign={'center'}
              fontSize={15}
              fontWeight={500}
            >
              AI Reasoning
            </Typography>
            <Stack>
              {explanations.map((explanation) => {
                return (
                  <Box
                    key={`${explanation.token}-explanation`}
                    sx={{
                      color:
                        explanation.sentiment === 'positive'
                          ? '#7CFF54'
                          : explanation.sentiment === 'negative'
                            ? '#FF5454'
                            : 'white',
                    }}
                  >
                    {' '}
                    <Typography
                      sx={{
                        display: 'inline',
                        fontSize: 15,
                      }}
                    >
                      ${explanation.token}:
                    </Typography>{' '}
                    <Typography
                      sx={{
                        display: 'inline',
                        fontSize: 15,
                      }}
                    >
                      {explanation.explanation}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  }

  return (
    <Box
      className="hide-tweet-info"
      sx={{
        position: 'absolute',
        right: 11,
        bottom: 92,
        width: 36,
        height: 36,
        background: 'rgb(21, 32, 43)',
        transition: 'all 0.2s ease',
        pointerEvents: 'none',
      }}
    ></Box>
  );
};

// Wrapper component with Suspense boundary
export const TweetExplanation = (props: {
  tokens: { token: string; sentiment: string; explanation?: string }[];
  hideCustomMargin?: boolean;
}) => {
  return (
    <Suspense fallback={null}>
      <TweetExplanationContent {...props} />
    </Suspense>
  );
};

const TokenTwitterSentimentsModal: FC<TokenTwitterSentimentsModalProp> = ({
  tokenPrice,
  tweets,
}) => {
  const theme = useTheme();
  const { online } = useNetwork();

  const mappingTweets = tweets.map((tweet) => ({
    enriched: mappingEnrichedTweet(tweet),
    tweet,
  }));

  return (
    <>
      <Box
        sx={{
          m: 0,
          mt: 0,
          pt: 0,
        }}
      >
        <Box
          data-theme="dark"
          sx={{
            '& div:first-of-type div:has(article)': {
              mt: 0,
            },
            '& div:last-child div:has(article)': {
              mb: 0,
            },
          }}
        >
          {mappingTweets.map((tweetObj, index) => (
            <Box
              key={`${tweetObj.tweet.message.messageId}-${index}`}
              position={'relative'}
              sx={{
                '&:hover .hide-tweet-info': {
                  background: 'rgb(30, 39, 50)',
                },
                mb: 2,
              }}
            >
              <Box
                sx={{
                  ...{
                    '*': {
                      '--tweet-bg-color': theme.palette.background.paper,
                      '--tweet-bg-color-hover': theme.palette.background.paper,
                    },
                  },
                }}
                data-set={index}
              >
                <Tweet
                  id={tweetObj.tweet.message.messageId}
                  components={{
                    TweetNotFound: () => (
                      <Box
                        sx={{
                          '& ~ .price-grain': { top: { xs: 58, md: 54 } },
                          '& ~ .followers-count': { bottom: 59 },
                        }}
                      >
                        <TweetContainer className="not-found">
                          <Stack
                            direction={'row'}
                            sx={{
                              display: online ? 'flex' : 'none',
                            }}
                          >
                            <Stack
                              p={1}
                              sx={{
                                ml: 'auto',
                                borderRadius: 2,
                                backgroundColor: theme.palette.warning.main,
                                backgroundImage:
                                  'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                                backgroundSize: '1rem 1rem',
                                // background: theme.palette.warning.main,
                              }}
                              component={'span'}
                            >
                              <Typography
                                variant={'subtitle2'}
                                fontWeight={'bold'}
                              >
                                Deleted Post!
                              </Typography>
                            </Stack>
                          </Stack>
                          {/* <Typography
                            sx={{
                              position: 'relative',
                              display: online ? 'block' : 'none',
                              textTransform: 'uppercase',
                              backgroundColor: theme.palette.warning.main,
                              backgroundImage:
                                'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                              backgroundSize: '1rem 1rem',
                              color: theme.palette.grey[800],
                              whiteSpace: 'nowrap',
                              fontWeight: 'bolder',
                              overflow: 'hidden',
                              mt: '-0.75rem',
                              mb: '0.75rem',
                              mx: '-1rem',
                              height: 44,
                              py: 1,
                            }}
                          >
                            <Box
                              component="div"
                              sx={{
                                whiteSpace: 'nowrap',
                                position: 'absolute',
                                width: '112%',
                                animation: 'marquee 20s linear infinite',
                                '@keyframes marquee': {
                                  '0%': { transform: 'translateX(0%)' },
                                  '100%': { transform: 'translateX(-100%)' },
                                },
                              }}
                            >
                              <Box component="span">Deleted Post</Box>
                              <Box component="span" px={1}>
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box component="span" px={1}>
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box component="span" px={1}>
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box
                                component="span"
                                px={1}
                                display={'inline-block'}
                              >
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box component="span" px={1}>
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box component="span" px={1}>
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box component="span" px={1}>
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                              <Box component="span">Deleted Post</Box>
                              <Box
                                component="span"
                                px={1}
                                display={'inline-block'}
                              >
                                <EmergencyIcon
                                  style={{ transform: 'translateY(2px)' }}
                                />
                              </Box>
                            </Box>
                          </Typography> */}
                          <TweetHeader tweet={tweetObj.enriched} />
                          {tweetObj.enriched.in_reply_to_status_id_str && (
                            <TweetInReplyTo tweet={tweetObj.enriched} />
                          )}
                          <TweetBody tweet={tweetObj.enriched} />
                          {tweetObj.tweet?.message.imageURLs &&
                            tweetObj.tweet?.message.imageURLs.map(
                              (media_url) => (
                                <Fragment key={`tweetObj.tweet-${media_url}`}>
                                  <Box
                                    sx={{
                                      mt: '0.75rem',
                                      position: 'relative',
                                      width: '100%',
                                      paddingTop: '109.091%',
                                      border: '1px solid var(--tweet-border)',
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      '&:empty': {
                                        display: 'none',
                                      },
                                    }}
                                  >
                                    <ImageWithFallback
                                      alt="Image"
                                      src={media_url}
                                      hideIfHasError={true}
                                      containerstyleprops={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        '&:empty': {
                                          display: 'none',
                                        },
                                      }}
                                      style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                      }}
                                    />
                                  </Box>
                                </Fragment>
                              ),
                            )}

                          {tweetObj.tweet?.message.videoURLs &&
                            tweetObj.tweet?.message.videoURLs.map((video) => (
                              <Box
                                key={`${video}-video`}
                                sx={{
                                  mt: '0.75rem',
                                  position: 'relative',
                                  width: '100%',
                                  paddingTop: '109.091%',
                                  border: '1px solid var(--tweet-border)',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  '&:empty': {
                                    display: 'none',
                                  },
                                }}
                              >
                                <video
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                  }}
                                  src={video}
                                />
                              </Box>
                            ))}
                          {tweetObj.enriched.quoted_tweet && (
                            <QuotedTweet
                              tweet={tweetObj.enriched.quoted_tweet}
                            />
                          )}
                          <TweetInfo tweet={tweetObj.enriched} />

                          <TweetActions tweet={tweetObj.enriched} />
                        </TweetContainer>
                      </Box>
                    ),
                  }}
                />
              </Box>
              <TweetExplanation
                hideCustomMargin={index !== mappingTweets.length - 1}
                tokens={tweetObj.tweet.message.tokens}
              />

              {tokenPrice && tweetObj.tweet.tokenPriceUSDOnMessageTime && (
                <PriceGrain
                  priceGain={
                    ((tokenPrice - tweetObj.tweet.tokenPriceUSDOnMessageTime) /
                      tweetObj.tweet.tokenPriceUSDOnMessageTime) *
                    100
                  }
                >
                  ${tweetObj.tweet.tokenPriceUSDOnMessageTime.toFixed(4)} → $
                  {tokenPrice.toFixed(4)}
                </PriceGrain>
              )}

              {/* HERE ARE FOLLOWERS */}
              {/* <Stack
                direction={'row'}
                alignItems={'center'}
                gap={0.25}
                position={'absolute'}
                title="Followers Count"
                color={'rgb(139, 152, 165)'}
                className={'followers-count'}
                fontFamily={'var(--tweet-font-family)'}
                fontWeight={600}
                fontSize={15}
                bottom={99}
                right={50}
              >
                <Typography>
                  {followerCounterFormatter.format(
                    // tweetObj.tweet.tweetUser.follower_count ?? 0
                    1000,
                  )}
                </Typography>
                <PermIdentityIcon
                  sx={{
                    height: 20,
                    width: 20,
                  }}
                />
              </Stack> */}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default TokenTwitterSentimentsModal;
