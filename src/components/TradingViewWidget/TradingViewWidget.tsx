import { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol = 'NASDAQ:AAPL' }) {
  const container = useRef<HTMLDivElement | null>(null);
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (container.current && !scriptAdded.current) {
      const script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "1H",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": false,
          "hide_top_toolbar": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com",
          "hide_top_bar": true,
          "hide_search": true
        }`;
      container.current.appendChild(script);
      scriptAdded.current = true;
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
        scriptAdded.current = false;
      }
    };
  }, [symbol]);

  return (
    <div
      style={{
        height: '100%',
        minHeight: 500,
      }}
      className="trading-container"
      ref={container}
    >
      <div style={{ width: '100%' }}></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
