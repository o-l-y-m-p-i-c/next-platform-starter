import { MainLayoutWrapper } from '../../components/MainLayoutWrapper';
import { TokenPage } from '../../../src/page-components';
import { Metadata } from 'next';
import { config } from '@/config/config';

interface TokenPageProps {
  params: Promise<{
    tokenSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TokenPageProps): Promise<Metadata> {
  const { tokenSlug } = await params;

  try {
    // Fetch token data for metadata
    const response = await fetch(`${config.CORE_API_URL}/token/${tokenSlug}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      return {
        title: `Token | ${config.APP_NAME}`,
        description: 'Discover crypto token analytics and hype data',
      };
    }

    const data = await response.json();
    const token = data.data;

    if (!token) {
      return {
        title: `Token | ${config.APP_NAME}`,
        description: 'Discover crypto token analytics and hype data',
      };
    }

    const title = `Discover ${token.symbol} With ${config.APP_NAME}`;
    const description = `Hype Analytics on ${token.name}. ${token.description?.substring(0, 120) || ''}`;
    const image = token.imageURL || '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: `Token | ${config.APP_NAME}`,
      description: 'Discover crypto token analytics and hype data',
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
