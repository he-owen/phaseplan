import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { scrollToSection } from '../utils';
import FadeInOnScroll from '../FadeInOnScroll';

/* ── Animated ring SVG rendered behind the hero text ── */
function EnergyGraphic() {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: { xs: 340, sm: 500, md: 650 },
        height: { xs: 340, sm: 500, md: 650 },
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
      }}
    >
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Outer ring — slow spin */}
        <circle cx="200" cy="200" r="190" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 200 200"
            to="360 200 200"
            dur="60s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Mid ring — reverse spin */}
        <circle cx="200" cy="200" r="145" stroke="url(#grad2)" strokeWidth="0.7" strokeDasharray="8 16" opacity="0.45">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 200 200"
            to="0 200 200"
            dur="45s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Inner ring — slow pulse */}
        <circle cx="200" cy="200" r="100" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="r" values="98;105;98" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Tiny orbit dot */}
        <circle r="3" fill="hsl(210,98%,62%)" opacity="0.9">
          <animateMotion dur="12s" repeatCount="indefinite" path="M200,55 A145,145 0 1,1 199.99,55" />
        </circle>
        <circle r="2" fill="hsl(210,98%,72%)" opacity="0.7">
          <animateMotion dur="20s" repeatCount="indefinite" path="M200,10 A190,190 0 1,1 199.99,10" />
        </circle>
        {/* Central glow */}
        <circle cx="200" cy="200" r="60" fill="url(#glow)" opacity="0.35">
          <animate attributeName="opacity" values="0.25;0.4;0.25" dur="4s" repeatCount="indefinite" />
        </circle>
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="400" y2="400">
            <stop offset="0%" stopColor="hsl(210,98%,62%)" />
            <stop offset="100%" stopColor="hsl(210,98%,32%)" />
          </linearGradient>
          <linearGradient id="grad2" x1="400" y1="0" x2="0" y2="400">
            <stop offset="0%" stopColor="hsl(210,98%,58%)" />
            <stop offset="100%" stopColor="hsl(210,60%,28%)" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(210,98%,52%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(210,98%,52%)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </Box>
  );
}

export default function HeroSection() {
  const { loginWithRedirect } = useAuth0();

  const handleGetStarted = () => {
    loginWithRedirect({ appState: { returnTo: '/dashboard' } });
  };

  return (
    <Stack
      component="section"
      sx={{
        alignItems: 'center',
        textAlign: 'center',
        py: { xs: 12, md: 18 },
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '85vh' },
        justifyContent: 'center',
      }}
    >
      <EnergyGraphic />

      <FadeInOnScroll sx={{ position: 'relative', zIndex: 1 }}>
        <Stack alignItems="center" spacing={0}>
          <Chip
            icon={<BoltRoundedIcon sx={{ fontSize: 16 }} />}
            label="Energy intelligence"
            size="small"
            sx={{
              mb: 3.5,
              fontWeight: 600,
              border: '1px solid hsla(210,98%,48%,0.3)',
              backgroundColor: 'hsla(210,98%,48%,0.1)',
              color: 'hsl(210,98%,72%)',
              backdropFilter: 'blur(8px)',
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.75rem', sm: '3.75rem', md: '4.75rem' },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              maxWidth: 820,
              mb: 3,
              background:
                'linear-gradient(135deg, hsl(0,0%,100%) 30%, hsl(210,98%,72%) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Smart energy management for your home
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              maxWidth: 540,
              mb: 5,
              lineHeight: 1.7,
              fontWeight: 400,
              color: 'text.secondary',
            }}
          >
            Monitor your devices, optimize costs, and gain insights into your energy
            usage. PhasePlan helps you save money and reduce your carbon footprint.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={handleGetStarted}
              sx={{
                px: 4,
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                background:
                  'linear-gradient(135deg, hsl(210,98%,48%) 0%, hsl(210,98%,38%) 100%)',
                boxShadow: '0 0 24px hsla(210,98%,48%,0.35)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, hsl(210,98%,52%) 0%, hsl(210,98%,42%) 100%)',
                  boxShadow: '0 0 32px hsla(210,98%,48%,0.5)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => scrollToSection('features')}
              sx={{
                px: 4,
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                borderColor: 'rgba(255,255,255,0.15)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </FadeInOnScroll>
    </Stack>
  );
}
