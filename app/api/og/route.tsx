import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const title = searchParams.get('title') || 'TrenchSpy.ai';
        const tokenSymbol = searchParams.get('symbol');
        const imageUrl = searchParams.get('image');
        const networkImage = searchParams.get('network');
        const address = searchParams.get('address');

        const mindshareBearish = searchParams.get('mindshareBearish') || '0';
        const mindshareNeutral = searchParams.get('mindshareNeutral') || '0';
        const mindshareBullish = searchParams.get('mindshareBullish') || '0';

        const baseUrl = new URL(req.url).origin;

        const dotoRegular = await fetch(
            'https://fonts.gstatic.com/s/doto/v3/t5tJIRMbNJ6TQG7Il_EKPqP9zTnvqqGNcuvLMt1JIphFOOKezw.ttf'
        ).then((res) => res.arrayBuffer());

        const dotoBold = await fetch(
            'https://fonts.gstatic.com/s/doto/v3/t5tJIRMbNJ6TQG7Il_EKPqP9zTnvqqGNcuvLMt1JIphF3-Wezw.ttf'
        ).then((res) => res.arrayBuffer());

        console.log('searchParams', searchParams);

        return new ImageResponse(
            (
                <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex' }}>
                    <img
                        src={`${baseUrl}/og_assets/bg.png`}
                        alt=""
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '49px 59px 40px'
                        }}
                    >
                        <img
                            src={`${baseUrl}/og_assets/logo.svg`}
                            alt=""
                            style={{
                                width: 407,
                                height: 84,
                                objectFit: 'contain'
                            }}
                        />
                        <div
                            style={{
                                maxWidth: '75%',
                                flex: 1,

                                marginTop: 67,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                                {imageUrl && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            position: 'relative',
                                            width: 120,
                                            height: 120,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <svg
                                            width="120"
                                            height="120"
                                            style={{ position: 'absolute', top: 0, left: 0, opacity: 0.58 }}
                                        >
                                            <defs>
                                                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#61CBD0" />
                                                    <stop offset="100%" stopColor="#121623" />
                                                </linearGradient>
                                            </defs>
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="59"
                                                fill="none"
                                                stroke="url(#borderGradient)"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                        <svg
                                            width="150"
                                            height="150"
                                            style={{ position: 'absolute', top: -15, left: -15, opacity: 0.58 }}
                                        >
                                            <defs>
                                                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#61CBD0" />
                                                    <stop offset="100%" stopColor="#121623" />
                                                </linearGradient>
                                            </defs>
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="59"
                                                fill="none"
                                                stroke="url(#borderGradient)"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                        <svg
                                            width="180"
                                            height="180"
                                            style={{ position: 'absolute', top: -30, left: -30, opacity: 0.58 }}
                                        >
                                            <defs>
                                                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#61CBD0" />
                                                    <stop offset="100%" stopColor="#121623" />
                                                </linearGradient>
                                            </defs>
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="59"
                                                fill="none"
                                                stroke="url(#borderGradient)"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                        {/* Token image */}
                                        <img
                                            src={imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`}
                                            alt=""
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'contain',
                                                objectPosition: 'center',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        flex: 1
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            fontSize: 55,
                                            lineHeight: 1,
                                            fontFamily: 'Doto',
                                            fontWeight: '600',
                                            color: '#FFFFFF',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '100%'
                                        }}
                                    >
                                        {title}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            fontSize: 50,
                                            lineHeight: 1,
                                            fontFamily: 'Doto',
                                            fontWeight: '900',
                                            color: '#61CBD0',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '100%'
                                        }}
                                    >
                                        {tokenSymbol?.startsWith('$') ? tokenSymbol : `$${tokenSymbol}`}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {networkImage && (
                                        <img
                                            src={
                                                networkImage.startsWith('http')
                                                    ? networkImage
                                                    : `${baseUrl}${networkImage}`
                                            }
                                            alt="Network"
                                            style={{
                                                width: 24,
                                                height: 24,
                                                objectFit: 'contain'
                                            }}
                                        />
                                    )}

                                    {address && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                fontSize: 19,
                                                lineHeight: 1,
                                                fontFamily: 'Doto',
                                                fontWeight: '900',
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            {address}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
                                <div
                                    style={{
                                        fontSize: 40,
                                        lineHeight: 1,
                                        fontFamily: 'Doto',
                                        fontWeight: '900',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    Mindshare:
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 37 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            fontSize: 40,
                                            lineHeight: 1,
                                            fontFamily: 'Doto',
                                            fontWeight: '900',
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        🚀 {mindshareBearish}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            fontSize: 40,
                                            lineHeight: 1,
                                            fontFamily: 'Doto',
                                            fontWeight: '900',
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        💬 {mindshareNeutral}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            fontSize: 40,
                                            lineHeight: 1,
                                            fontFamily: 'Doto',
                                            fontWeight: '900',
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        🚩 {mindshareBullish}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Doto',
                        data: dotoRegular,
                        weight: 400,
                        style: 'normal'
                    },
                    {
                        name: 'Doto',
                        data: dotoBold,
                        weight: 700,
                        style: 'normal'
                    }
                ]
            }
        );
    } catch (error) {
        console.error('OG Image generation error:', error);
        return new Response('Failed to generate image', { status: 500 });
    }
}
