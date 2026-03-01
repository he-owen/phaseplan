import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FadeInOnScroll from '../FadeInOnScroll';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import DevicesOtherRoundedIcon from '@mui/icons-material/DevicesOtherRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const steps = [
  {
    number: '01',
    icon: LinkRoundedIcon,
    title: 'Connect Your Utility',
    description:
      'Link your utility provider to automatically import your rate schedules, billing history, and usage data.',
  },
  {
    number: '02',
    icon: DevicesOtherRoundedIcon,
    title: 'Add Your Devices',
    description:
      'Register your home\'s energy-consuming devices — HVAC, lighting, appliances — with their wattage and run times.',
  },
  {
    number: '03',
    icon: AutoAwesomeRoundedIcon,
    title: 'Get Optimized',
    description:
      'Our AI analyzes your usage patterns and rate schedules to suggest cost-saving schedules and actionable insights.',
  },
];

export default function HowItWorksSection() {
  return (
    <Box
      id="how-it-works"
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
          How It Works
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            mb: { xs: 6, md: 8 },
            color: 'text.primary',
          }}
        >
          Get started in three simple steps
        </Typography>
      </FadeInOnScroll>

      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 0 }}
          alignItems="stretch"
          sx={{ position: 'relative' }}
        >
          {/* Connecting line (desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 48,
              left: '18%',
              right: '18%',
              height: 2,
              background:
                'linear-gradient(90deg, transparent 0%, hsla(210,98%,48%,0.3) 20%, hsla(210,98%,48%,0.3) 80%, transparent 100%)',
              zIndex: 0,
            }}
          />

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <FadeInOnScroll key={index} delay={index * 150} sx={{ flex: 1, zIndex: 1 }}>
                <Stack alignItems="center" textAlign="center" spacing={2.5} sx={{ px: { xs: 2, md: 3 } }}>
                  {/* Number circle with icon */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -1,
                        borderRadius: '50%',
                        padding: '1px',
                        background:
                          'linear-gradient(135deg, hsla(210,98%,48%,0.4), transparent 60%)',
                        WebkitMask:
                          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      },
                    }}
                  >
                    <IconComponent sx={{ fontSize: 36, color: 'primary.main' }} />
                    {/* Step number badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: 'primary.contrastText',
                        }}
                      >
                        {step.number}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, maxWidth: 320 }}
                  >
                    {step.description}
                  </Typography>
                </Stack>
              </FadeInOnScroll>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
