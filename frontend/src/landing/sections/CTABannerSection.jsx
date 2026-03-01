import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useAuth0 } from '@auth0/auth0-react';
import FadeInOnScroll from '../FadeInOnScroll';

export default function CTABannerSection() {
  const { loginWithRedirect } = useAuth0();

  const handleGetStarted = () => {
    loginWithRedirect({ appState: { returnTo: '/dashboard' } });
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        px: 2,
        position: 'relative',
      }}
    >
      <FadeInOnScroll>
        <Container maxWidth="md">
          <Box
            sx={{
              position: 'relative',
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              px: { xs: 3, md: 6 },
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.02)',

              /* Gradient glow behind the card */
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background:
                  'radial-gradient(ellipse at 50% 0%, hsla(210,98%,48%,0.12) 0%, transparent 60%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                letterSpacing: '-0.02em',
                mb: 2,
                color: 'text.primary',
                position: 'relative',
              }}
            >
              Start saving on energy today
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 480,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.7,
                position: 'relative',
              }}
            >
              Join PhasePlan for free and take control of your home's energy
              consumption with AI-powered insights and real-time monitoring.
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              sx={{ position: 'relative' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={handleGetStarted}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
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
                Get Started Free
              </Button>
            </Stack>
          </Box>
        </Container>
      </FadeInOnScroll>
    </Box>
  );
}
