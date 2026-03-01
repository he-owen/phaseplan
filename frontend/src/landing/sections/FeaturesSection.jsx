import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import FadeInOnScroll from '../FadeInOnScroll';

const features = [
  {
    icon: BoltRoundedIcon,
    title: 'Energy monitoring',
    description:
      'Track real-time and historical energy consumption across your devices. Understand usage patterns and identify opportunities to save.',
  },
  {
    icon: DevicesRoundedIcon,
    title: 'Device management',
    description:
      'Add and manage all your energy-consuming devices. Categorize by type, set run durations, and monitor individual device usage.',
  },
  {
    icon: TrendingDownRoundedIcon,
    title: 'Cost optimization',
    description:
      'Leverage time-of-use rates and AI-powered suggestions to shift usage to cheaper hours and reduce your monthly bills.',
  },
  {
    icon: ReceiptLongRoundedIcon,
    title: 'Billing insights',
    description:
      'Connect your utility provider and view detailed billing history. Compare actual costs with projections and track savings over time.',
  },
];

export default function FeaturesSection() {
  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        px: 2,
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
          Features
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            mb: 6,
            color: 'text.primary',
          }}
        >
          Everything you need to manage energy
        </Typography>
      </FadeInOnScroll>

      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <FadeInOnScroll delay={index * 120} sx={{ height: '100%' }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    borderColor: 'rgba(255,255,255,0.06)',
                    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(8px)',
                    position: 'relative',
                    overflow: 'hidden',
                    /* Top gradient line */
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '10%',
                      right: '10%',
                      height: '1px',
                      background:
                        'linear-gradient(90deg, transparent, hsla(210,98%,48%,0.4), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      borderColor: 'hsla(210,98%,48%,0.35)',
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 20px hsla(210,98%,48%,0.08)',
                      '&::before': { opacity: 1 },
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        background:
                          'linear-gradient(135deg, hsla(210,98%,48%,0.15) 0%, hsla(210,98%,48%,0.04) 100%)',
                        border: '1px solid hsla(210,98%,48%,0.12)',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
