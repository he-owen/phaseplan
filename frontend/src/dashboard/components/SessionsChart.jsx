import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function SessionsChart({ data = {} }) {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const labels = data.labels || [];
  const hvac = data.hvac || [];
  const appliances = data.appliances || [];
  const lighting = data.lighting || [];
  const totalEnergy = data.totalMonthlyEnergy || 0;

  const mid = Math.floor(labels.length / 2) || 1;
  const sumSlice = (arr, start, end) => arr.slice(start, end).reduce((a, b) => a + b, 0);
  const firstHalf = sumSlice(hvac, 0, mid) + sumSlice(appliances, 0, mid) + sumSlice(lighting, 0, mid) || 1;
  const secondHalf = sumSlice(hvac, mid, labels.length) + sumSlice(appliances, mid, labels.length) + sumSlice(lighting, mid, labels.length) || 1;
  const pctChange = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  const chipLabel = pctChange <= 0 ? `${pctChange}%` : `+${pctChange}%`;
  const chipColor = pctChange <= 0 ? 'success' : 'error';

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Daily Energy Usage
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalEnergy.toLocaleString()} kWh
            </Typography>
            {labels.length > 0 && <Chip size="small" color={chipColor} label={chipLabel} />}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Estimated energy consumption by category this month
          </Typography>
        </Stack>
        {labels.length > 0 ? (
          <LineChart
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'point',
                data: labels,
                tickInterval: (index, i) => (i + 1) % 5 === 0,
                height: 24,
              },
            ]}
            yAxis={[{
              width: 50,
              valueFormatter: (v) => `${v} kWh`,
            }]}
            series={[
              {
                id: 'hvac',
                label: 'HVAC',
                showMark: false,
                curve: 'linear',
                stack: 'total',
                area: true,
                stackOrder: 'ascending',
                data: hvac,
                valueFormatter: (v) => `${v} kWh`,
              },
              {
                id: 'appliances',
                label: 'Appliances',
                showMark: false,
                curve: 'linear',
                stack: 'total',
                area: true,
                stackOrder: 'ascending',
                data: appliances,
                valueFormatter: (v) => `${v} kWh`,
              },
              {
                id: 'lighting',
                label: 'Lighting & Other',
                showMark: false,
                curve: 'linear',
                stack: 'total',
                stackOrder: 'ascending',
                area: true,
                data: lighting,
                valueFormatter: (v) => `${v} kWh`,
              },
            ]}
            height={250}
            margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiAreaElement-series-hvac': {
                fill: "url('#home-hvac')",
              },
              '& .MuiAreaElement-series-appliances': {
                fill: "url('#home-appliances')",
              },
              '& .MuiAreaElement-series-lighting': {
                fill: "url('#home-lighting')",
              },
            }}
            hideLegend
          >
            <AreaGradient color={theme.palette.primary.dark} id="home-hvac" />
            <AreaGradient color={theme.palette.primary.main} id="home-appliances" />
            <AreaGradient color={theme.palette.primary.light} id="home-lighting" />
          </LineChart>
        ) : (
          <Typography sx={{ color: 'text.secondary', py: 8, textAlign: 'center' }}>
            Add devices to see your energy usage estimates
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

SessionsChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    hvac: PropTypes.arrayOf(PropTypes.number),
    appliances: PropTypes.arrayOf(PropTypes.number),
    lighting: PropTypes.arrayOf(PropTypes.number),
    totalMonthlyEnergy: PropTypes.number,
  }),
};
