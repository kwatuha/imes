import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  Chip,
  Divider,
  Grid,
  Link as MuiLink
} from '@mui/material';
import { 
  Home, 
  Dashboard, 
  PhotoLibrary, 
  RateReview, 
  AccountBalance,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Add as AddIcon,
  Announcement as AnnouncementIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProjectsGalleryPage from './pages/ProjectsGalleryPage';
import PublicFeedbackPage from './pages/PublicFeedbackPage';
import CitizenProposalsPage from './pages/CitizenProposalsPage';
import CountyProposedProjectsPage from './pages/CountyProposedProjectsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      
      {/* Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Grid container spacing={0} alignItems="flex-start" sx={{ flexGrow: 1 }}>
            {/* Logo Container */}
            <Grid item sx={{ display: 'flex', alignItems: 'flex-start', pr: 1 }}>
              <Box
                component="img"
                src="images/logo.min.png"
                alt="County Government of Kisumu Logo"
                sx={{
                  height: 50,
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  display: 'block',
                  mt: -0.5
                }}
              />
            </Grid>
            
            {/* Text Container */}
            <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  margin: 0
                }}
              >
                County Government of Kisumu
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  margin: 0
                }}
              >
                Project Management System
              </Typography>
            </Grid>
          </Grid>
          
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<Home />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<Dashboard />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/projects"
            startIcon={<PhotoLibrary />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Projects
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/public-feedback"
            startIcon={<RateReview />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Feedback
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/citizen-proposals"
            startIcon={<AddIcon />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Citizen Proposed Projects
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/county-projects"
            startIcon={<BusinessIcon />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            County Proposed Projects
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/announcements"
            startIcon={<AnnouncementIcon />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Announcements
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsGalleryPage />} />
          <Route path="/public-feedback" element={<PublicFeedbackPage />} />
          <Route path="/citizen-proposals" element={<CitizenProposalsPage />} />
          <Route path="/county-projects" element={<CountyProposedProjectsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
        </Routes>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
          color: 'white',
          py: 6,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={0} alignItems="flex-start">
                {/* Logo Container */}
                <Grid item sx={{ pr: 1 }}>
                  <Box
                    component="img"
                    src="images/logo.min.png"
                    alt="County Government of Kisumu Logo"
                    sx={{
                      height: 40,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      mt: -0.5
                    }}
                  />
                </Grid>
                
                {/* Text Container */}
                <Grid item xs>
                  <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                    County Government of Kisumu
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 2, mt: 2 }}>
                Project Management System
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Empowering transparency, accountability, and efficient project delivery 
                for the people of Kisumu County.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <MuiLink component={Link} to="/dashboard" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#3498db' } }}>
                  Dashboard
                </MuiLink>
                <MuiLink component={Link} to="/projects" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#3498db' } }}>
                  Projects Gallery
                </MuiLink>
                <MuiLink component={Link} to="/feedback" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#3498db' } }}>
                  Submit Feedback
                </MuiLink>
                <MuiLink component={Link} to="/public-feedback" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: '#3498db' } }}>
                  Feedback
                </MuiLink>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn sx={{ fontSize: 16, color: '#3498db' }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Kisumu County Headquarters
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone sx={{ fontSize: 16, color: '#3498db' }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    +254 57 202 0000
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email sx={{ fontSize: 16, color: '#3498db' }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    info@kisumu.go.ke
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Social Media */}
            <Grid item xs={12} md={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Follow Us
              </Typography>
              <Box display="flex" gap={1}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#3498db',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Facebook sx={{ fontSize: 20 }} />
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#3498db',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Twitter sx={{ fontSize: 20 }} />
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#3498db',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <LinkedIn sx={{ fontSize: 20 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Copyright */}
          <Box textAlign="center">
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              © {new Date().getFullYear()} County Government of Kisumu. All rights reserved.
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ mt: 1, display: 'block' }}>
              Built with transparency and accountability in mind
            </Typography>
          </Box>
        </Container>
      </Box>
    </Router>
  );
}

export default App;