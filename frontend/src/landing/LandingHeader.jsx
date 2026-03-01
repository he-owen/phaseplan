import { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAuth0 } from '@auth0/auth0-react';
import { scrollToSection } from './utils';

const navItems = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Preview', id: 'preview' },
  { label: 'FAQ', id: 'faq' },
];

export default function LandingHeader() {
  const { loginWithRedirect } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignIn = () => {
    loginWithRedirect({ appState: { returnTo: '/dashboard' } });
  };

  const handleNavClick = (id) => {
    scrollToSection(id);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(10, 14, 20, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            gap: 2,
            py: 1,
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
          }}
        >
          {/* Logo */}
          <Typography
            component="a"
            href="/"
            variant="h6"
            sx={{
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '-0.03em',
              fontSize: '1.35rem',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <Box component="span" sx={{ color: 'primary.main' }}>
              Phase
            </Box>
            <Box component="span" sx={{ color: 'text.primary' }}>
              Plan
            </Box>
          </Typography>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.id}
                color="inherit"
                onClick={() => handleNavClick(item.id)}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  px: 1.5,
                  borderRadius: 2,
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="contained"
              onClick={handleSignIn}
              sx={{
                ml: 1,
                px: 3,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, hsl(210,98%,48%) 0%, hsl(210,98%,38%) 100%)',
                boxShadow: '0 0 20px hsla(210,98%,48%,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, hsl(210,98%,52%) 0%, hsl(210,98%,42%) 100%)',
                  boxShadow: '0 0 28px hsla(210,98%,48%,0.45)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: 'text.primary',
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'hsl(220, 35%, 7%)',
            backgroundImage: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2, my: 1 }} />
        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSignIn}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              background: 'linear-gradient(135deg, hsl(210,98%,48%) 0%, hsl(210,98%,38%) 100%)',
              boxShadow: '0 0 20px hsla(210,98%,48%,0.3)',
            }}
          >
            Sign In
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
