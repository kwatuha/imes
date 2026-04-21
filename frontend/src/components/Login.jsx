// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiService from '../api';
import logo from '../assets/logo.png';
import logo2x from '../assets/logo_2x.png';
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
    Container,
    InputAdornment,
    Stack,
    useTheme,
    alpha,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const theme = useTheme();
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
        try {
            const data = await apiService.auth.login(username, password);

            if (data && data.token) {
                login(data.token);
                navigate('/', { replace: true });
            } else {
                setError('Login successful, but no token property received in response.');
            }
        } catch (err) {
            console.error('Login.jsx: Error during login:', err);
            setError(err.message || err.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const primary = theme.palette.primary.main;
    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: alpha(theme.palette.grey[500], 0.06),
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
                duration: theme.transitions.duration.shorter,
            }),
            '&:hover': {
                bgcolor: alpha(theme.palette.grey[500], 0.09),
            },
            '&.Mui-focused': {
                bgcolor: '#fff',
                boxShadow: `0 0 0 3px ${alpha(primary, 0.2)}`,
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: primary,
        },
    };

    const shortScreen = {
        '@media (max-height: 720px)': {
            py: { xs: 0.75, sm: 1 },
        },
        '@media (max-height: 640px)': {
            py: 0.5,
        },
    };

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: { xs: 1.25, sm: 2 },
                px: 2,
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                ...shortScreen,
                bgcolor: '#f1f5f9',
                backgroundImage: `
                    radial-gradient(ellipse 120% 80% at 50% -30%, ${alpha(primary, 0.18)}, transparent 55%),
                    radial-gradient(ellipse 70% 50% at 100% 100%, ${alpha('#38bdf8', 0.12)}, transparent 50%),
                    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 45%, #e2e8f0 100%)
                `,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(
                        -12deg,
                        transparent,
                        transparent 40px,
                        ${alpha(theme.palette.common.black, 0.02)} 40px,
                        ${alpha(theme.palette.common.black, 0.02)} 41px
                    )`,
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: 0 }}>
                <Card
                    elevation={0}
                    sx={{
                        maxWidth: 440,
                        mx: 'auto',
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                        boxShadow: `
                            0 1px 2px ${alpha(theme.palette.common.black, 0.04)},
                            0 12px 40px ${alpha(primary, 0.12)},
                            0 4px 24px ${alpha(theme.palette.common.black, 0.06)}
                        `,
                        bgcolor: '#ffffff',
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 2, sm: 2.5 },
                            '&:last-child': { pb: { xs: 2, sm: 2.5 } },
                            '@media (max-height: 720px)': {
                                p: 1.5,
                                '&:last-child': { pb: 1.5 },
                            },
                        }}
                    >
                        <Stack spacing={{ xs: 1.25, sm: 1.5 }} alignItems="center" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <Box
                                component="img"
                                src={logo}
                                srcSet={`${logo2x} 2x, ${logo} 1x`}
                                alt="County Government of Kisumu seal"
                                width={216}
                                height={216}
                                loading="eager"
                                decoding="async"
                                draggable={false}
                                sx={{
                                    height: { xs: 188, sm: 216 },
                                    width: { xs: 188, sm: 216 },
                                    maxWidth: 'min(100%, 240px)',
                                    objectFit: 'contain',
                                    display: 'block',
                                    flexShrink: 0,
                                    backfaceVisibility: 'hidden',
                                    '@media (max-height: 720px)': {
                                        height: 160,
                                        width: 160,
                                        maxWidth: 200,
                                    },
                                    '@media (max-height: 640px)': {
                                        height: 136,
                                        width: 136,
                                        maxWidth: 160,
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    width: '100%',
                                    px: { xs: 0.5, sm: 1 },
                                }}
                            >
                                <Typography
                                    component="p"
                                    sx={{
                                        m: 0,
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                        fontWeight: 700,
                                        lineHeight: 1.3,
                                        color: theme.palette.primary.dark,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        '@media (max-height: 640px)': {
                                            fontSize: '0.875rem',
                                            letterSpacing: '0.05em',
                                        },
                                    }}
                                >
                                    County Government of Kisumu
                                </Typography>
                                <Box
                                    aria-hidden
                                    sx={{
                                        width: { xs: 56, sm: 64 },
                                        height: 3,
                                        mt: { xs: 1, sm: 1.125 },
                                        mx: 'auto',
                                        borderRadius: 1.5,
                                        background: `linear-gradient(90deg, ${alpha(primary, 0.15)} 0%, ${primary} 45%, ${alpha(primary, 0.15)} 100%)`,
                                    }}
                                />
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{
                                        fontWeight: 700,
                                        color: theme.palette.grey[900],
                                        letterSpacing: '0.06em',
                                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                        lineHeight: 1.15,
                                        mt: { xs: 0.25, sm: 0.5 },
                                        '@media (max-height: 640px)': {
                                            fontSize: '1.35rem',
                                        },
                                    }}
                                >
                                    E-CIMES
                                </Typography>
                                <Box
                                    sx={{
                                        mt: { xs: 1, sm: 1.125 },
                                        mx: 'auto',
                                        maxWidth: 400,
                                        px: { xs: 1.5, sm: 2 },
                                        py: { xs: 1, sm: 1.25 },
                                        borderRadius: 2,
                                        bgcolor: alpha(primary, 0.06),
                                        border: `1px solid ${alpha(primary, 0.14)}`,
                                        '@media (max-height: 640px)': {
                                            mt: 0.75,
                                            py: 0.75,
                                            px: 1.25,
                                        },
                                    }}
                                >
                                    <Typography
                                        component="p"
                                        sx={{
                                            m: 0,
                                            textAlign: 'center',
                                            fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                                            lineHeight: 1.55,
                                            fontWeight: 400,
                                            color: theme.palette.grey[700],
                                            letterSpacing: '0.025em',
                                            fontFeatureSettings: '"kern" 1',
                                        }}
                                    >
                                        Electronic County Integrated
                                        <br />
                                        Monitoring &amp; Evaluation System
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        mt: 0.75,
                                        color: theme.palette.grey[500],
                                        letterSpacing: '0.02em',
                                        '@media (max-height: 640px)': {
                                            mt: 0.5,
                                            fontSize: '0.7rem',
                                        },
                                    }}
                                >
                                    Sign in to continue
                                </Typography>
                            </Box>
                        </Stack>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Stack spacing={{ xs: 1.5, sm: 1.75 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Username or email"
                                    id="username"
                                    name="username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                    variant="outlined"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineOutlinedIcon
                                                    sx={{ color: theme.palette.grey[500], fontSize: 22 }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Password"
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) =>
                                        e.target.value.length <= 50 ? setPassword(e.target.value) : null
                                    }
                                    required
                                    disabled={loading}
                                    variant="outlined"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon
                                                    sx={{ color: theme.palette.grey[500], fontSize: 22 }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox size="small" color="primary" disabled={loading} />
                                        }
                                        label="Remember me"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '0.875rem',
                                                color: theme.palette.grey[700],
                                            },
                                        }}
                                    />
                                    <Link
                                        href="#"
                                        onClick={(ev) => ev.preventDefault()}
                                        sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: primary,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                                color: theme.palette.primary.dark,
                                            },
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </Box>

                                {error && (
                                    <Alert severity="error" variant="outlined" sx={{ fontSize: '0.875rem' }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="medium"
                                    disabled={loading}
                                    disableElevation
                                    sx={{
                                        py: 1.1,
                                        mt: 0,
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        bgcolor: primary,
                                        boxShadow: `0 4px 14px ${alpha(primary, 0.45)}`,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            boxShadow: `0 6px 20px ${alpha(primary, 0.5)}`,
                                        },
                                        '&:disabled': {
                                            bgcolor: theme.palette.action.disabledBackground,
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CircularProgress size={22} color="inherit" />
                                            Signing in…
                                        </Box>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>

                <Typography
                    variant="caption"
                    align="center"
                    component="p"
                    sx={{
                        display: 'block',
                        mt: { xs: 1.25, sm: 1.5 },
                        mb: 0,
                        color: theme.palette.grey[600],
                        '@media (max-height: 640px)': {
                            mt: 0.75,
                            fontSize: '0.65rem',
                        },
                    }}
                >
                    Secure access · Authorized use only
                </Typography>
            </Container>
        </Box>
    );
};

export default Login;
