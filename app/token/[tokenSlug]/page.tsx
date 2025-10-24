import { MainLayoutWrapper } from '../../components/MainLayoutWrapper';
import { TokenPage } from '../../../src/page-components';
import { Metadata } from 'next';
import { config } from '@/config/config';
import { getChainInfo } from '@/utils/chainUtils';
import { headers } from 'next/headers';

interface TokenPageProps {
    params: Promise<{
        tokenSlug: string;
    }>;
}

async function isImageAccessible(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            next: { revalidate: 3600 }
        });
        const contentType = response.headers.get('content-type');
        return response.ok && (contentType?.startsWith('image/') ?? false);
    } catch {
        return false;
    }
}

export async function generateMetadata({ params }: TokenPageProps): Promise<Metadata> {
    const { tokenSlug } = await params;

    const headersList = await headers();
    const host = headersList.get('host') || '';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        const response = await fetch(`${config.CORE_API_URL}/token/${tokenSlug}`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return {
                title: `Token | ${config.APP_NAME}`,
                description: 'Discover crypto token analytics and hype data'
            };
        }

        const data = await response.json();
        const token = data.data;

        if (!token) {
            return {
                title: `Token | ${config.APP_NAME}`,
                description: 'Discover crypto token analytics and hype data'
            };
        }

        const title = `${token.name} (${token.symbol}) - Price, Analytics & Sentiment | ${config.APP_NAME}`;
        const description = token.description
            ? `${token.description.substring(0, 140)}...`
            : `Real-time analytics, price charts, and social sentiment analysis for ${token.name} (${token.symbol}). Track holders, mindshare, and market data.`;

        const url = `${baseUrl}/token/${tokenSlug}`;

        const ogImageParams = new URLSearchParams({
            title: token.name,
            description: description.substring(0, 100),
            symbol: token.symbol
        });

        const defaultImage = `${baseUrl}/default-token.png`;

        let finalImageUrl = defaultImage;

        if (token.imageURL && token.imageURL.startsWith('http')) {
            try {
                new URL(token.imageURL);

                const isAccessible = await isImageAccessible(token.imageURL);
                if (isAccessible) {
                    finalImageUrl = token.imageURL;
                } else {
                    console.warn('Token image not accessible (404 or invalid), using default:', token.imageURL);
                }
            } catch (e) {
                console.warn('Invalid token image URL, using default:', token.imageURL);
            }
        }

        ogImageParams.append('image', finalImageUrl);

        ogImageParams.append('address', token.addresses[0].blockchainAddress);

        // try {
        //     // Use AbortController for timeout
        //     const controller = new AbortController();
        //     const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        //     const twitterResponse = await fetch(
        //         `${config.CORE_API_URL}/token/${tokenSlug}/twitter?page=1&limit=1000`, // Reduced from 10000 to 1000
        //         {
        //             cache: 'no-store', // Disable caching - response is too large
        //             signal: controller.signal
        //         }
        //     );

        //     clearTimeout(timeoutId);

        //     if (twitterResponse.ok) {
        //         const twitterData = await twitterResponse.json();
        //         const tweets = twitterData.data || [];

        //         // Count sentiments
        //         let bullishCount = 0;
        //         let bearishCount = 0;
        //         let neutralCount = 0;

        //         tweets.forEach((tweet: any) => {
        //             const sentiment = tweet.sentiment?.toLowerCase();
        //             if (sentiment === 'positive') {
        //                 bullishCount++;
        //             } else if (sentiment === 'negative') {
        //                 bearishCount++;
        //             } else {
        //                 neutralCount++;
        //             }
        //         });

        //         ogImageParams.append('mindshareBullish', String(bullishCount));
        //         ogImageParams.append('mindshareBearish', String(bearishCount));
        //         ogImageParams.append('mindshareNeutral', String(neutralCount));
        //     } else {
        //         // API returned error status
        //         ogImageParams.append('mindshareBullish', '0');
        //         ogImageParams.append('mindshareBearish', '0');
        //         ogImageParams.append('mindshareNeutral', '0');
        //     }
        // } catch (error) {
        //     console.warn('Failed to fetch Twitter sentiment data (using defaults):', error instanceof Error ? error.message : error);
        //     ogImageParams.append('mindshareBullish', '0');
        //     ogImageParams.append('mindshareBearish', '0');
        //     ogImageParams.append('mindshareNeutral', '0');
        // }

        ogImageParams.append('mindshareBullish', String(0));
        ogImageParams.append('mindshareBearish', String(0));
        ogImageParams.append('mindshareNeutral', String(0));

        if (token.addresses && token.addresses.length > 0) {
            const chainInfo = getChainInfo({
                blockchainAddress: token.addresses[0].blockchainAddress,
                blockchainId: token.addresses[0].blockchainId
            });

            if (chainInfo?.image) {
                const networkImageUrl = chainInfo?.image;
                ogImageParams.append('network', networkImageUrl);
                ogImageParams.append('networkLabel', chainInfo.label);
            } else {
                console.warn('No chain info found for blockchainId:', token.addresses[0].blockchainId);
            }
        }

        const ogImageUrl = `${baseUrl}/api/og?${ogImageParams.toString()}`;

        const priceInfo = token.stats?.tokenUSDPrice ? `Current Price: $${token.stats.tokenUSDPrice.toFixed(6)}` : '';

        return {
            title,
            description,

            keywords: [
                token.name,
                token.symbol,
                'crypto analytics',
                'token price',
                'social sentiment',
                'crypto hype',
                'blockchain analytics',
                token.addresses?.[0]?.blockchainId
            ].filter(Boolean),
            authors: [{ name: config.APP_NAME }],
            openGraph: {
                title,
                description,
                url,
                siteName: config.APP_NAME,
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: `${token.name} (${token.symbol}) analytics`
                    }
                ],
                type: 'website',
                locale: 'en_US'
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: priceInfo ? `${priceInfo} | ${description}` : description,
                images: [ogImageUrl],
                creator: `@${config.APP_NAME}`
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1
                }
            },
            alternates: {
                canonical: url
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: `Token | ${config.APP_NAME}`,
            description: 'Discover crypto token analytics and hype data'
        };
    }
}

export default function Token() {
    return (
        <MainLayoutWrapper>
            <TokenPage />
        </MainLayoutWrapper>
    );
}
