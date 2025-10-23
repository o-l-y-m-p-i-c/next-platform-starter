import { useEffect } from 'react';
import {
  widget,
  ChartingLibraryWidgetOptions,
} from '../../../public/charting_library';
import { UDFCompatibleDatafeed } from '../../../public/datafeeds/udf/src/udf-compatible-datafeed';
import { getBackendURL } from '@/helpers/urlHelper';

const ChartingLibraryTV = ({ tokenSlug }: { tokenSlug: string }) => {
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      theme: 'dark',
      // interval: '15s' as ChartingLibraryWidgetOptions['interval'],
      interval: '1' as ChartingLibraryWidgetOptions['interval'],
      container: 'twc_container',
      datafeed: new UDFCompatibleDatafeed(`${getBackendURL()}/tokenfeed`),
      library_path: '/charting_library/',
      disabled_features: [
        'header_symbol_search',
        'allow_arbitrary_symbol_search_input',
        'create_volume_indicator_by_default',
        'header_compare',
        'header_quick_search',
        'symbol_info',
        'header_indicators',
        'control_bar',
        'left_toolbar',
        'compare_symbol_search_spread_operators',
        'timeframes_toolbar',
        'display_legend_on_all_charts',
        'header_widget',
      ],
      symbol: tokenSlug,
      locale: 'en',
      autosize: true,
    };

    const tvWidget = new widget(widgetOptions);
    return () => {
      tvWidget.remove();
    };
  }, []);
  return (
    <div
      id="twc_container"
      style={{
        flex: 1,
      }}
    ></div>
  );
};

export { ChartingLibraryTV };
