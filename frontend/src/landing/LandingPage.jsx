import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useAuth0 } from '@auth0/auth0-react';
import LandingHeader from './LandingHeader';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import HowItWorksSection from './sections/HowItWorksSection';
import DashboardPreviewSection from './sections/DashboardPreviewSection';
import FAQSection from './sections/FAQSection';
import CTABannerSection from './sections/CTABannerSection';
import FooterSection from './sections/FooterSection';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Box data-mui-color-scheme="dark" sx={{ minHeight: '100vh' }}>
      <Stack
        component="main"
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            background:
              'linear-gradient(180deg, hsl(220, 35%, 5%) 0%, hsl(220, 30%, 3%) 40%, hsl(220, 35%, 5%) 100%)',
          },
          /* Top-right blue glow */
          '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            top: '-15%',
            right: '-10%',
            width: '55%',
            height: '55%',
            background:
              'radial-gradient(ellipse, hsla(210, 98%, 48%, 0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Secondary subtle green glow */}
        <Box
          sx={{
            position: 'absolute',
            zIndex: -1,
            top: '45%',
            left: '-15%',
            width: '40%',
            height: '45%',
            background:
              'radial-gradient(ellipse, hsla(210, 70%, 40%, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <LandingHeader />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <FAQSection />
        <CTABannerSection />
        <FooterSection />
      </Stack>
    </Box>
  );
}
