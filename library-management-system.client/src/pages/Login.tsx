import React, { useEffect, useState } from 'react';
import {Container,Paper,TextField,Button,Typography,Alert,Box} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { UserValidation } from '../utils/ValidateUser';
import AuthService from '../utils/AuthService';

// Interface for the login form data
interface LoginForm {
    username: string;
    password: string;
}

export default function Login(){
    const [loginData, setLoginData] = useState<LoginForm>({ username: '', password: '' });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const validateInput = () => {
        const errorMessage = UserValidation.validateUserInput(loginData);
        if (errorMessage) {
            setError(errorMessage);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInput()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                AuthService.setToken(data.token);
                // TODO
                window.location.href = '/';
            } else {
                const errorData = await response.text();
                setError(errorData || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={loginData.username}
                            onChange={(e) => {
                                setLoginData({ ...loginData, [e.target.name]: e.target.value });
                                setError('');
                            }}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => {
                                setLoginData({ ...loginData, [e.target.name]: e.target.value });
                                setError('');
                            }}
                            margin="normal"
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ marginTop: 2, marginBottom: 2 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Typography align="center">
                            Don't have an account?{' '}
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};