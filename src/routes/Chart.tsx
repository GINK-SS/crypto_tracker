import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';

interface IHistorical {
  time_open: number;
  time_close: number;
  open: number;
  high: number;
  low: number;
  close: string;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}
function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 30000,
    }
  );
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ReactApexChart
          type="line"
          series={[
            {
              name: 'Price',
              data: data?.map((price) => parseFloat(price.close)) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            grid: { show: false },
            stroke: {
              curve: 'smooth',
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              type: 'datetime',
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toISOString().slice(0, 10)
              ),
            },
            fill: {
              type: 'gradient',
              gradient: { gradientToColors: ['#0be881'], stops: [0, 100] },
            },
            colors: ['#0fbcf9'],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
