// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiService from '../api';
import logo from '../assets/logo.png';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Link,
    Alert,
    CircularProgress,
    Container
} from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Login.jsx: Attempting login with username:', username);
        try {
            const data = await apiService.auth.login(username, password);
            console.log('Login.jsx: Login API response data:', data);

            if (data && data.token) {
                console.log('Login.jsx: Token received, calling AuthContext login:', data.token);
                login(data.token);
                console.log('Login.jsx: Login successful, navigating to dashboard.');
                navigate('/', { replace: true });
            } else {
                setError('Login successful, but no token property received in response.');
                console.error('Login.jsx: Login successful, but no token property in response data:', data);
            }
        } catch (err) {
            console.error('Login.jsx: Error caught during login API call:', err);
            setError(err.message || err.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
            console.log('Login.jsx: Login attempt finished. Loading set to false.');
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                py: 4
            }}
        >
            <Card 
                sx={{ 
                    width: '100%', 
                    maxWidth: 400,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(0)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                    }
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    {/* Logo and Title Section */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img
                            src={logo}
                            alt="E-CIMES Logo"
                            style={{ height: '80px', width: 'auto', marginBottom: '16px' }}
                        />
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: 'primary.main',
                                letterSpacing: '0.1em',
                                mb: 1
                            }}
                        >
                            E-CIMES
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontSize: '0.875rem' }}
                        >
                            Integrated Project Monitoring & Evaluation System
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontSize: '0.875rem', mt: 0.5 }}
                        >
                            Please Login
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username/Email"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            sx={{ mb: 2 }}
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            label="Password"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => e.target.value.length <= 50 ? setPassword(e.target.value) : null}
                            required
                            disabled={loading}
                            sx={{ mb: 2 }}
                            variant="outlined"
                        />

                        {/* Remember Me & Forgot Password Section */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 2 
                        }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Remember me"
                                sx={{ fontSize: '0.875rem' }}
                            />
                            <Link 
                                href="#" 
                                sx={{ 
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
                                {error}
                            </Alert>
                        )}
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ 
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                textTransform: 'none'
                            }}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    Logging In...
                                </Box>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;