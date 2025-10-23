import { EnrichedTweet, enrichTweet } from 'react-tweet';
import {
  ITwitterTweet,
  TokenTwitterSentimentsOverTimeItem,
  TwitterSentimentsCluster,
  TwitterSentimentThreshold,
} from './twitter.interfaces';
import { ETweetSentiment } from './twitter.enums';
import * as d3 from 'd3';

export function mappingEnrichedTweet(tweet: ITwitterTweet): EnrichedTweet {
  return enrichTweet({
    __typename: 'Tweet',
    lang: 'en',
    created_at: tweet.message.messageTime,
    display_text_range: [0, 500],
    entities: {
      hashtags: [{ indices: [0, 160], text: '' }],
      urls: [{ display_url: '', expanded_url: '', indices: [0, 0], url: '' }],
      user_mentions: [
        { id_str: tweet.author.id, indices: [0, 0], name: '', screen_name: '' },
      ],
      symbols: [{ indices: [0, 0], text: '' }],
    },
    id_str: tweet.message.messageId,
    text: tweet.message.message,
    user: {
      id_str: tweet.author.id,
      name: tweet.author.name,
      profile_image_url_https: tweet.author.avatarURL,
      profile_image_shape: 'Circle',
      screen_name: tweet.author.username,
      is_blue_verified: false,
      verified: false,
    },
    edit_control: {
      edit_tweet_ids: [],
      editable_until_msecs: '',
      is_edit_eligible: false,
      edits_remaining: '',
    },
    isEdited: false,
    isStaleEdit: false,
    favorite_count: 0,
    conversation_count: 0,
    news_action_type: 'conversation',
  });
}

export function aggregateSentiments(data: ITwitterTweet[]): {
  xAxisData: Date[];
  seriesData: number[][];
} {
  const groupedData: Record<string, TokenTwitterSentimentsOverTimeItem> = {};

  data.forEach(({ message, sentiment }) => {
    const { messageTime } = message;
    const date = new Date(
      new Date(messageTime).getFullYear(),
      new Date(messageTime).getMonth(),
      new Date(messageTime).getDate(),
    ).toISOString();
    // new Date(timestamp).toDateString().split('T')[0];

    if (!groupedData[date]) {
      groupedData[date] = {
        date: new Date(date),
        positive: 0,
        negative: 0,
        neutral: 0,
      };
    }

    if (sentiment === 'positive') {
      groupedData[date].positive += 1;
    } else if (sentiment === 'negative') {
      groupedData[date].negative += 1;
    } else if (sentiment === 'neutral') {
      groupedData[date].neutral += 1;
    }
  });

  const sortedData = Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const xAxisData = sortedData.map((item) => item.date);
  const positiveSeries = sortedData.map((item) => item.positive);
  const negativeSeries = sortedData.map((item) => item.negative);
  const neutralSeries = sortedData.map((item) => item.neutral);

  return {
    xAxisData,
    seriesData: [positiveSeries, negativeSeries, neutralSeries],
  };
}

export const colorBySentiment = (sentiment?: ETweetSentiment) => {
  switch (sentiment) {
    case ETweetSentiment.POSITIVE:
      return 'green';
    case ETweetSentiment.NEGATIVE:
      return 'red';
    default:
      return 'white';
  }
};

export const prepareSourceDataGraph = (
  rootNode: { tokenAddress: string; tokenImage: string },
  sourceData: ITwitterTweet[],
): {
  root: TwitterSentimentsCluster;
  clusters: TwitterSentimentsCluster[];
  independentNodes: TwitterSentimentsCluster[];
} => {
  const clusters: Record<string, TwitterSentimentsCluster> = {};

  const radiusScale = d3
    .scaleSqrt()
    .domain([1000, 1000000])
    .range([13, 100])
    .clamp(true);

  const reversedData = sourceData.reverse();

  reversedData.forEach((tweet) => {
    const { sentiment, author, message } = tweet;
    const { id, avatarURL, followers } = author;

    const follower_count = Number.isNaN(Number(followers))
      ? 10000
      : Number(followers);

    const clusterPath = `cluster-${id}-${sentiment.toLocaleLowerCase()}`;
    if (!clusters[clusterPath]) {
      clusters[clusterPath] = {
        id: `cluster-${id}`,
        group: 'cluster',
        sentiment,
        tokenPrice: tweet.tokenPriceUSDOnMessageTime,
        pic: avatarURL,
        r: radiusScale(follower_count),
        latestTweet: message,
        author: author,
        nodes: [],
      };
    }
    if (clusters[clusterPath] && !clusters[clusterPath].tokenPrice) {
      clusters[clusterPath].tokenPrice = tweet.tokenPriceUSDOnMessageTime;
    }

    if (clusters[clusterPath].nodes) {
      clusters[clusterPath].nodes.push({ group: 'node', tweet });
    }
  });

  return {
    root: {
      id: 'root',
      group: 'root',
      pic: rootNode.tokenImage,
      r: 40,
    },
    clusters: Object.values(clusters),
    independentNodes: [],
  };
};

export const getTimestampsByThreshold = (
  days: TwitterSentimentThreshold,
  rangeDays?: [string, string],
): { start_date: number; end_date: number } => {
  let start_date: number;
  let end_date: number;

  if (days === 0 && rangeDays) {
    start_date = new Date(rangeDays[0]).getTime();
    if (rangeDays[1] === null) {
      end_date = new Date(rangeDays[0]).getTime();
    } else {
      end_date = new Date(rangeDays[1]).getTime();
    }
  } else {
    const currentDate = new Date();
    end_date = currentDate.getTime();

    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - days);
    start_date = pastDate.getTime();
  }

  return { start_date: start_date / 1000, end_date: end_date / 1000 };
};
