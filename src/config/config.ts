import { getBackendURL } from '../helpers/urlHelper';

const config = {
    TWITTER_API_URL: process.env.NEXT_PUBLIC_TWITTER_API_URL,
    CORE_API_URL: getBackendURL('http'),
    APP_NAME: 'TrenchSpy',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://trenchspy.com'
};

export { config };
