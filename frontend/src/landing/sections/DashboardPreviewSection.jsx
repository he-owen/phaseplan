import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import FadeInOnScroll from '../FadeInOnScroll';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

/* ── Shared card wrapper ── */
const cardSx = {
  borderRadius: 2,
  border: '1px solid rgba(255,255,255,0.06)',
  backgroundColor: 'rgba(255,255,255,0.025)',
  p: 2,
};

/* ── Fake sidebar nav items (mirrors MenuContent) ── */
const sidebarItems = [
  { icon: <HomeRoundedIcon sx={{ fontSize: 16 }} />, label: 'Home', active: true },
  { icon: <DevicesRoundedIcon sx={{ fontSize: 16 }} />, label: 'Devices' },
  { icon: <ReceiptLongRoundedIcon sx={{ fontSize: 16 }} />, label: 'Billing' },
  { icon: <TrendingDownRoundedIcon sx={{ fontSize: 16 }} />, label: 'Optimization' },
  { icon: <BuildRoundedIcon sx={{ fontSize: 16 }} />, label: 'Tools' },
  { icon: <TuneRoundedIcon sx={{ fontSize: 16 }} />, label: 'Preferences' },
];

/* ── Stat card sparkline data ── */
const usageSparkline = [18, 22, 19, 25, 21, 24, 20, 26, 23, 28, 22, 25, 27, 24, 29, 26, 23, 21, 28, 25, 30, 27, 24, 26, 29, 25, 22, 27, 24, 26];
const deviceSparkline = Array(30).fill(8);

/* ── Bar chart data (monthly cost) ── */
const barMonths = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const barValues = [142, 128, 156, 134, 119, 127];
const barMax = Math.max(...barValues);

/* ── Stacked area chart (daily usage by category) ── */
const areaPoints = 28;
function wave(i, seed, base) {
  return base + Math.sin((i + seed) * 0.45) * (base * 0.3) + Math.cos((i + seed * 2) * 0.8) * (base * 0.15);
}
const hvacLine = Array.from({ length: areaPoints }, (_, i) => wave(i, 1, 3.5));
const applianceLine = Array.from({ length: areaPoints }, (_, i) => wave(i, 4, 2.0));
const lightingLine = Array.from({ length: areaPoints }, (_, i) => wave(i, 7, 1.2));
const stackedMax = Math.max(...hvacLine.map((v, i) => v + applianceLine[i] + lightingLine[i]));

/* ── Pie / donut data ── */
const pieCategories = [
  { name: 'HVAC', value: 48, color: 'hsl(220, 25%, 65%)' },
  { name: 'Appliances', value: 28, color: 'hsl(220, 25%, 45%)' },
  { name: 'Lighting', value: 16, color: 'hsl(220, 25%, 30%)' },
  { name: 'Other', value: 8, color: 'hsl(220, 25%, 20%)' },
];

/* ── Mini sparkline (pure CSS) ── */
function Sparkline({ data, color, height = 36 }) {
  const max = Math.max(...data);
  return (
    <Stack direction="row" spacing={0.3} alignItems="flex-end" sx={{ height }}>
      {data.map((v, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            borderRadius: 0.3,
            backgroundColor: color,
            opacity: i >= data.length - 3 ? 0.9 : 0.4,
            minWidth: 1.5,
          }}
        />
      ))}
    </Stack>
  );
}

/* ── Donut chart (SVG) ── */
function DonutChart() {
  const total = pieCategories.reduce((s, c) => s + c.value, 0);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box sx={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width="100" height="100">
        {pieCategories.map((cat) => {
          const dash = (cat.value / total) * circumference;
          const gap = circumference - dash;
          const segment = (
            <circle
              key={cat.name}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={cat.color}
              strokeWidth="10"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          );
          offset += dash;
          return segment;
        })}
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
          672
        </Typography>
        <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>kWh</Typography>
      </Box>
    </Box>
  );
}

export default function DashboardPreviewSection() {
  return (
    <Box
      id="preview"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        px: 2,
        position: 'relative',
      }}
    >
      <FadeInOnScroll>
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            textAlign: 'center',
            letterSpacing: 2,
            color: 'primary.main',
            fontWeight: 600,
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            mb: 2,
            color: 'text.primary',
          }}
        >
          Your energy, at a glance
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: 520,
            mx: 'auto',
            mb: { xs: 5, md: 7 },
            lineHeight: 1.6,
          }}
        >
          A unified view of consumption, devices, and costs — designed to help
          you make smarter decisions instantly.
        </Typography>
      </FadeInOnScroll>

      <FadeInOnScroll delay={200}>
        <Container maxWidth="lg">
          <Box sx={{ perspective: '1200px', display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 1000,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(10,14,20,0.95)',
                boxShadow:
                  '0 24px 80px rgba(0,0,0,0.55), 0 0 60px hsla(210,98%,48%,0.06)',
                transform: { xs: 'none', md: 'rotateX(2deg)' },
                transition: 'transform 0.5s ease',
                '&:hover': { transform: 'rotateX(0deg) scale(1.005)' },
              }}
            >
              {/* ── Browser chrome ── */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                  px: 2,
                  py: 1.2,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <Box
                    key={c}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: c,
                      opacity: 0.7,
                    }}
                  />
                ))}
                <Box
                  sx={{
                    ml: 2,
                    flex: 1,
                    maxWidth: 280,
                    height: 24,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    px: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.6rem', opacity: 0.5 }}
                  >
                    app.phaseplan.io/dashboard
                  </Typography>
                </Box>
              </Box>

              {/* ── Dashboard body: sidebar + main ── */}
              <Stack direction="row" sx={{ minHeight: { xs: 340, md: 400 } }}>
                {/* Sidebar (hidden on xs) */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    width: 170,
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: 'rgba(255,255,255,0.015)',
                    py: 1.5,
                    px: 1,
                    flexShrink: 0,
                  }}
                >
                  {/* Logo in sidebar */}
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      letterSpacing: '-0.02em',
                      px: 1,
                      mb: 1.5,
                    }}
                  >
                    <Box component="span" sx={{ color: 'primary.main' }}>Phase</Box>
                    <Box component="span" sx={{ color: 'text.primary' }}>Plan</Box>
                  </Typography>

                  <Stack spacing={0.3}>
                    {sidebarItems.map((item) => (
                      <Stack
                        key={item.label}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          px: 1,
                          py: 0.6,
                          borderRadius: 1.5,
                          backgroundColor: item.active
                            ? 'rgba(255,255,255,0.06)'
                            : 'transparent',
                          cursor: 'default',
                        }}
                      >
                        <Box sx={{ color: item.active ? 'text.primary' : 'text.secondary', display: 'flex' }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: item.active ? 600 : 400,
                            color: item.active ? 'text.primary' : 'text.secondary',
                            fontSize: '0.7rem',
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Main content area */}
                <Box sx={{ flex: 1, p: { xs: 1.5, md: 2.5 }, overflow: 'hidden' }}>
                  {/* Header bar */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography
                      sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary' }}
                    >
                      Dashboard &gt; Home
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: 1,
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SearchRoundedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                      </Box>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: 1,
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <NotificationsRoundedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                      </Box>
                    </Stack>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1.5,
                    }}
                  >
                    Overview
                  </Typography>

                  {/* Row 1: Stat cards + Monthly cost bar chart */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1.5 }}>
                    {/* Stat card: Today's Usage */}
                    <Box sx={{ ...cardSx, flex: 1 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                        Today's Usage
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.3 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                          24.7 kWh
                        </Typography>
                        <Chip
                          label="-12%"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            backgroundColor: 'hsla(140,70%,45%,0.15)',
                            color: 'hsl(140,70%,55%)',
                          }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 0.5 }}>
                        Last 30 days
                      </Typography>
                      <Sparkline data={usageSparkline} color="hsl(140,60%,40%)" height={32} />
                    </Box>

                    {/* Stat card: Active Devices */}
                    <Box sx={{ ...cardSx, flex: 1 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                        Active Devices
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.3 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                          8
                        </Typography>
                        <Chip
                          label="+5%"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            color: 'text.secondary',
                          }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 0.5 }}>
                        Currently registered
                      </Typography>
                      <Sparkline data={deviceSparkline} color="hsl(220,20%,50%)" height={32} />
                    </Box>

                    {/* Monthly Energy Cost bar chart */}
                    <Box sx={{ ...cardSx, flex: 1.8, display: { xs: 'none', md: 'block' } }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                        Monthly Energy Cost
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.3, mb: 0.3 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                          $127.40
                        </Typography>
                        <Chip
                          label="-6%"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            backgroundColor: 'hsla(140,70%,45%,0.15)',
                            color: 'hsl(140,70%,55%)',
                          }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 1 }}>
                        Cost breakdown by rate period
                      </Typography>
                      {/* Bar chart */}
                      <Stack direction="row" spacing={0.8} alignItems="flex-end" sx={{ height: 60 }}>
                        {barValues.map((v, i) => (
                          <Stack key={i} alignItems="center" spacing={0.3} sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: `${(v / barMax) * 54}px`,
                                borderRadius: 0.8,
                                background:
                                  i === barValues.length - 1
                                    ? 'linear-gradient(180deg, hsl(210,98%,60%) 0%, hsl(210,98%,40%) 100%)'
                                    : 'linear-gradient(180deg, hsl(210,40%,50%) 0%, hsl(210,30%,30%) 100%)',
                                transition: 'height 0.4s ease',
                              }}
                            />
                            <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>
                              {barMonths[i]}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Row 2: Daily Energy Usage line chart + Usage by Device Type pie */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    {/* Daily Energy Usage (stacked area) */}
                    <Box sx={{ ...cardSx, flex: 1.2 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                        Daily Energy Usage
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.3, mb: 0.3 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
                          672 kWh
                        </Typography>
                        <Chip
                          label="-8%"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            backgroundColor: 'hsla(140,70%,45%,0.15)',
                            color: 'hsl(140,70%,55%)',
                          }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 1 }}>
                        Estimated energy consumption by category this month
                      </Typography>
                      {/* Stacked area chart (CSS) */}
                      <Box sx={{ position: 'relative', height: 70 }}>
                        <svg
                          viewBox={`0 0 ${areaPoints} ${Math.ceil(stackedMax)}`}
                          preserveAspectRatio="none"
                          width="100%"
                          height="100%"
                          style={{ display: 'block' }}
                        >
                          {/* Lighting + Appliances + HVAC (bottom to top, drawn top-down) */}
                          <path
                            d={
                              `M0,${stackedMax} ` +
                              hvacLine
                                .map(
                                  (v, i) =>
                                    `L${i},${stackedMax - (v + applianceLine[i] + lightingLine[i])}`,
                                )
                                .join(' ') +
                              ` L${areaPoints - 1},${stackedMax} Z`
                            }
                            fill="hsl(210,50%,32%)"
                            opacity="0.5"
                          />
                          <path
                            d={
                              `M0,${stackedMax} ` +
                              hvacLine
                                .map(
                                  (v, i) =>
                                    `L${i},${stackedMax - (v + applianceLine[i])}`,
                                )
                                .join(' ') +
                              ` L${areaPoints - 1},${stackedMax} Z`
                            }
                            fill="hsl(210,60%,46%)"
                            opacity="0.45"
                          />
                          <path
                            d={
                              `M0,${stackedMax} ` +
                              hvacLine
                                .map((v, i) => `L${i},${stackedMax - v}`)
                                .join(' ') +
                              ` L${areaPoints - 1},${stackedMax} Z`
                            }
                            fill="hsl(210,70%,58%)"
                            opacity="0.5"
                          />
                        </svg>
                      </Box>
                      {/* Legend */}
                      <Stack direction="row" spacing={1.5} sx={{ mt: 0.8 }}>
                        {[
                          { label: 'HVAC', color: 'hsl(210,70%,58%)' },
                          { label: 'Appliances', color: 'hsl(210,60%,46%)' },
                          { label: 'Lighting', color: 'hsl(210,50%,32%)' },
                        ].map((l) => (
                          <Stack key={l.label} direction="row" alignItems="center" spacing={0.4}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: l.color,
                              }}
                            />
                            <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>
                              {l.label}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>

                    {/* Usage by Device Type (donut) */}
                    <Box sx={{ ...cardSx, flex: 1 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', fontSize: '0.65rem', mb: 1, display: 'block' }}>
                        Usage by Device Type
                      </Typography>
                      <Stack alignItems="center" sx={{ mb: 1.5 }}>
                        <DonutChart />
                      </Stack>
                      {/* Category bars */}
                      <Stack spacing={0.8}>
                        {pieCategories.map((cat) => (
                          <Stack key={cat.name} spacing={0.2}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography sx={{ fontSize: '0.6rem', fontWeight: 500, color: 'text.primary' }}>
                                {cat.name}
                              </Typography>
                              <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                                {cat.value}%
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={cat.value}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                [`& .${linearProgressClasses.bar}`]: {
                                  borderRadius: 2,
                                  backgroundColor: cat.color,
                                },
                              }}
                            />
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </FadeInOnScroll>
    </Box>
  );
}
