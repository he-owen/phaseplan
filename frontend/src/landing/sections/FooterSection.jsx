import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { scrollToSection } from '../utils';

export default function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        px: 2,
        borderTop: '1px solid',
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={6}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-start' }}
        >
          {/* Logo */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.03em',
                fontSize: '1.35rem',
                mb: 1,
              }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>
                Phase
              </Box>
              <Box component="span" sx={{ color: 'text.primary' }}>
                Plan
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
              Smart energy management for the modern home.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6}>
            <Stack spacing={2}>
              <Typography fontWeight={600} sx={{ fontSize: '0.75rem', letterSpacing: 1, color: 'text.secondary' }}>
                PRODUCT
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => scrollToSection('features')}
                sx={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Features
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => scrollToSection('how-it-works')}
                sx={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                How It Works
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => scrollToSection('faq')}
                sx={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                FAQ
              </Link>
            </Stack>
            <Stack spacing={2}>
              <Typography fontWeight={600} sx={{ fontSize: '0.75rem', letterSpacing: 1, color: 'text.secondary' }}>
                LEGAL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Terms of Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Privacy Policy
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', opacity: 0.7 }}>
            © {new Date().getFullYear()} PhasePlan. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
