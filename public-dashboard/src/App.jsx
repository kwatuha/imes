import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline
} from '@mui/material';
import { Home, Dashboard, Feedback, PhotoLibrary, RateReview } from '@mui/icons-material';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProjectsGalleryPage from './pages/ProjectsGalleryPage';
import FeedbackPage from './pages/FeedbackPage';
import PublicFeedbackPage from './pages/PublicFeedbackPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            County PMTS
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<Home />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<Dashboard />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/projects"
            startIcon={<PhotoLibrary />}
          >
            Projects
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/public-feedback"
            startIcon={<RateReview />}
          >
            View Feedback
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/feedback"
            startIcon={<Feedback />}
          >
            Submit Feedback
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
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} County Government. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Projects Monitoring & Tracking System
          </Typography>
        </Container>
      </Box>
    </Router>
  );
}

export default App;

