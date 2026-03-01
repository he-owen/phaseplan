import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function PageViewsBarChart({ data = {} }) {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  const labels = data.labels || [];
  const offPeak = data.offPeak || [];
  const midPeak = data.midPeak || [];
  const onPeak = data.onPeak || [];
  const monthlyCost = data.monthlyCost || 0;

  const firstTotal = (offPeak[0] || 0) + (midPeak[0] || 0) + (onPeak[0] || 0);
  const lastTotal =
    (offPeak[offPeak.length - 1] || 0) +
    (midPeak[midPeak.length - 1] || 0) +
    (onPeak[onPeak.length - 1] || 0);
  const pctChange = firstTotal > 0 ? Math.round(((lastTotal - firstTotal) / firstTotal) * 100) : 0;
  const chipLabel = pctChange <= 0 ? `${pctChange}%` : `+${pctChange}%`;
  const chipColor = pctChange <= 0 ? 'success' : 'error';

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Monthly Energy Cost
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
              ${monthlyCost.toFixed(2)}
            </Typography>
            {labels.length > 1 && <Chip size="small" color={chipColor} label={chipLabel} />}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Cost breakdown by rate period
          </Typography>
        </Stack>
        {labels.length > 0 ? (
          <BarChart
            borderRadius={8}
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: labels,
                height: 24,
              },
            ]}
            yAxis={[{
              width: 50,
              valueFormatter: (v) => `$${v}`,
            }]}
            series={[
              {
                id: 'off-peak',
                label: 'Off-Peak',
                data: offPeak,
                stack: 'A',
                valueFormatter: (v) => `$${v.toFixed(2)}`,
              },
              {
                id: 'mid-peak',
                label: 'Mid-Peak',
                data: midPeak,
                stack: 'A',
                valueFormatter: (v) => `$${v.toFixed(2)}`,
              },
              {
                id: 'on-peak',
                label: 'On-Peak',
                data: onPeak,
                stack: 'A',
                valueFormatter: (v) => `$${v.toFixed(2)}`,
              },
            ]}
            height={250}
            margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
            grid={{ horizontal: true }}
            hideLegend
          />
        ) : (
          <Typography sx={{ color: 'text.secondary', py: 8, textAlign: 'center' }}>
            Select a utility provider to see cost breakdown
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

PageViewsBarChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    offPeak: PropTypes.arrayOf(PropTypes.number),
    midPeak: PropTypes.arrayOf(PropTypes.number),
    onPeak: PropTypes.arrayOf(PropTypes.number),
    monthlyCost: PropTypes.number,
  }),
};
