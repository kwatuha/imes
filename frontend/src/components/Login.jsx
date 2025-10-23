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
                background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 25%, #1976d2 50%, #1e88e5 75%, #2196f3 100%)',
                py: 4
            }}
        >
            <Card 
                sx={{ 
                    width: '100%', 
                    maxWidth: 420,
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    boxShadow: '0 12px 40px rgba(30, 58, 138, 0.15), 0 4px 16px rgba(30, 58, 138, 0.1)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2), 0 8px 24px rgba(30, 58, 138, 0.15)'
                    }
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    {/* Logo and Title Section */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img
                            src={logo}
                            alt="E-CIMES Logo"
                            style={{ 
                                height: '120px', 
                                width: 'auto', 
                                marginBottom: '20px',
                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                                transition: 'transform 0.3s ease-in-out',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: '#1976d2',
                                letterSpacing: '0.1em',
                                mb: 1,
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                textShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                            }}
                        >
                            E-CIMES
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                mb: 0.5,
                                color: '#374151'
                            }}
                        >
                            Electronic County Integrated Monitoring & Evaluation System
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontSize: '0.85rem', 
                                mt: 0.5,
                                fontStyle: 'italic',
                                color: '#6b7280'
                            }}
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
                            sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f1f5f9',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                            borderWidth: 2
                                        }
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1e3a8a',
                                            borderWidth: 2
                                        }
                                    }
                                }
                            }}
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
                            sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f1f5f9',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#3b82f6',
                                            borderWidth: 2
                                        }
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1e3a8a',
                                            borderWidth: 2
                                        }
                                    }
                                }
                            }}
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
                                    color: '#3b82f6',
                                    fontWeight: 500,
                                    '&:hover': { 
                                        textDecoration: 'underline',
                                        color: '#1e3a8a'
                                    }
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
                                py: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                background: 'linear-gradient(45deg, #1e3a8a 30%, #3b82f6 90%)',
                                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1e40af 30%, #2563eb 90%)',
                                    boxShadow: '0 6px 16px rgba(30, 58, 138, 0.4)',
                                    transform: 'translateY(-2px)'
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(45deg, #bdbdbd 30%, #e0e0e0 90%)',
                                    boxShadow: 'none',
                                    transform: 'none'
                                }
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