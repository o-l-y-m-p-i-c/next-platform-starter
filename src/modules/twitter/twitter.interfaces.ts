import { ETweetSentiment } from './twitter.enums';

type ITwitterUserMessage =
  | 'USERS_FOLLOWERS_SUCCESSFULLY_FETCHED'
  | 'USERS_FOLLOWINGS_SUCCESSFULLY_FETCHED'
  | 'USERS_STATS_FETCHED_SUCCESSFULLY'
  | 'USERS_FETCHED_SUCCESSFULLY';

type ITwitterProjectMessage =
  | 'PROJECT_TWEETS_FETCHED_SUCCESSFULLY'
  | 'PROJECT_SENTIMENT_STATS_SUCCESSFULLY_FETCHED'
  | 'PROJECT_SUCCESSFULLY_FETCHED'
  | 'PROJECT_SUCCESSFULLY_UPDATED'
  | 'PROJECT_SUCCESSFULLY_CREATED'
  | 'PROJECT_TWEETS_SUCCESSFULLY_SYNCED';

export interface ITwitterResponse<T> {
  message: ITwitterUserMessage & ITwitterProjectMessage;
  success: boolean;
  pagination: { total: number };
  data: T;
}

// interface ITwitterResponseWithPaginated<T> extends ITwitterResponse<T> {
//   total: number;
//   page: number;
//   limit: number;
//   totalPage: number;
// }

// interface ITwitterProjectSocialMedia {
//   twitter: string;
//   facebook: string;
//   instagram: string;
//   linkedin: string;
//   snapchat: string;
//   youtube: string;
//   telegram: string;
//   website: string;
// }

// interface ITwitterProject {
//   name: string;
//   symbol: string;
//   coingeckoId: string;
//   logo: string;
//   contract: string;
//   twitterUsername: string;
//   hashtags: string[];
//   query: string[];
//   category: string[];
//   tags: string[];
//   social_media: ITwitterProjectSocialMedia;
//   _id: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface ITweetProjectByContractUser {
//   name: string;
//   user_id: string;
//   username: string;
//   profile_pic_url: string;
//   follower_count: number;
// }

// export interface ITwitterProjectTweet
//   extends Pick<ITwitterProject, '_id' | '__v' | 'createdAt'> {
//   tweet_id: string;
//   bookmark_count: number;
//   coingeckoId: string;
//   conversation_id: string;
//   creation_date: string;
//   cryptoCategory: string;
//   favorite_count: number;
//   initialPrice: number;
//   language: string;
//   lastPrice: number;
//   lastPriceUpdatedOn: number;
//   priceGain: number;
//   project: string;
//   quote_count: number;
//   quoted_status: string | null;
//   reply_count: number;
//   retweet: boolean;
//   retweet_count: number;
//   retweet_tweet_id: string | null;
//   retweet_status: string | null;
//   sentiment: ETweetSentiment;
//   media_url?: string[];
//   source: string | null;
//   text: string;
//   timestamp: number;
//   tweetUser: ITweetProjectByContractUser;
//   tweet_type: string;
//   updatedAt: string;
//   user: string;
//   views: number;
// }

export interface ITwitterTweet {
  sentiment: ETweetSentiment;
  message: {
    messageId: string;
    imageURLs: string[];
    message: string;
    messageTime: string;
    videoURLs: [];
    tokens: { token: string; sentiment: string; explanation?: string }[];
  };
  author: {
    avatarURL: string;
    followers?: number;
    blueVerified: boolean;
    name: string;
    username: string;
    id: string;
  };
  tokenPriceUSDOnMessageTime: number;
  timestamp: number;
  tokenSymbolOrAddress: string;
}

// interface ITwitterProjectSentiment {
//   Positive: {
//     total: number;
//     tweets: ITwitterProjectTweet[];
//   };
//   Negative: {
//     total: number;
//     tweets: ITwitterProjectTweet[];
//   };
//   Nautral: {
//     total: number;
//     tweets: ITwitterProjectTweet[];
//   };
// }

// interface ITwitterProjectSentimentsStat
//   extends Pick<
//     ITwitterProjectSentimentsStats,
//     'Positive' | 'Negative' | 'Neutral'
//   > {
//   project: ITwitterProject;
// }

export interface TokenTwitterSentimentsOverTimeItem {
  date: Date;
  positive: number;
  negative: number;
  neutral: number;
}

export interface TwitterSentimentsClusterNode {
  group: 'node';
  tweet: ITwitterTweet;
}

export interface TwitterSentimentsCluster {
  id: string;
  group: 'root' | 'cluster';
  pic: string;
  r: number;
  priceGain?: number;
  tokenPrice?: number;
  latestTweet?: {
    messageId: string;
    imageURLs: string[];
    message: string;
    messageTime: string;
    videoURLs: [];
    tokens: { token: string; sentiment: string; explanation?: string }[];
  };
  author?: {
    avatarURL: string;
    followers?: number;
    blueVerified: boolean;
    name: string;
    username: string;
    id: string;
  };
  sentiment?: ETweetSentiment;
  nodes?: TwitterSentimentsClusterNode[];
}

export type TwitterSentimentThreshold = 0 | 1 | 3 | 7 | 30 | 90;
