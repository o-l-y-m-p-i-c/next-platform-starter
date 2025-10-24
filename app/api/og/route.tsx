import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const title = searchParams.get('title') || 'TrenchSpy.ai';
        const description = searchParams.get('description') || 'Spot the Most-Hyped Tokens Before Everyone Else';
        const tokenSymbol = searchParams.get('symbol');
        const imageUrl = searchParams.get('image');

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#040816',
                        backgroundImage:
                            'radial-gradient(circle at 25px 25px, #1DCED2 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1DCED2 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        padding: '40px 80px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#101624',
                            borderRadius: '24px',
                            padding: '60px',
                            width: '100%',
                            maxWidth: '1000px',
                            border: '2px solid #1DCED2'
                        }}
                    >
                        <div
                            style={{
                                display: imageUrl ? 'flex' : 'none',
                                marginBottom: '30px'
                            }}
                        >
                            <img
                                src={imageUrl || ''}
                                alt="Token"
                                width="120"
                                height="120"
                                style={{
                                    borderRadius: '60px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: '64px',
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                    marginBottom: '20px',
                                    lineHeight: 1.2
                                }}
                            >
                                {title}
                            </div>

                            <div
                                style={{
                                    display: tokenSymbol ? 'flex' : 'none',
                                    fontSize: '32px',
                                    color: '#1DCED2',
                                    fontWeight: '600',
                                    marginBottom: '20px'
                                }}
                            >
                                ${tokenSymbol}
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: '28px',
                                    color: '#B0B0B0',
                                    maxWidth: '800px',
                                    lineHeight: 1.4
                                }}
                            >
                                {description}
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '40px',
                                fontSize: '24px',
                                color: '#1DCED2',
                                fontWeight: '600'
                            }}
                        >
                            🕵️ TrenchSpy.ai
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630
            }
        );
    } catch (error) {
        console.error('OG Image generation error:', error);
        return new Response('Failed to generate image', { status: 500 });
    }
}
