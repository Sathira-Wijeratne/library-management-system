import React, { useEffect, useState } from 'react';
import {Container, Paper, TextField, Button, Typography, Alert, Box, useTheme, useMediaQuery} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { UserValidation } from '../utils/ValidateUser';
import AuthService from '../utils/AuthService';

// Interface for the registration form data
interface RegistrationForm {
    username: string;
    password: string;
    confirmPassword: string;
}

export default function Register(){
    const [registerData, setRegisterData] = useState<RegistrationForm>({ 
        username: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    // Media query for responsive design
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            navigate('/');
            return;
        }
    }, [navigate]);

    const handleChange = () => {
        setError('');
        setSuccess('');
    };

    const validateInput = () => {
        const errorMessage = UserValidation.validateUserInput(registerData);
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
        setSuccess('');


        try {
            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message || 'Registration successful! You can now login.');
                setRegisterData({ username: '', password: '', confirmPassword: '' });
                setTimeout(() => navigate('/login'), 1000);
            } else {
                const errorData = await response.text();
                setError(errorData || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 2 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
                        Register
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={registerData.username}
                            onChange={(e) => {
                                setRegisterData({ ...registerData, [e.target.name]: e.target.value });
                                handleChange();
                            }}
                            margin="normal"
                            required
                            helperText="3-24 characters, letters, numbers, hyphens, underscores, periods allowed"
                        />
                        
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={registerData.password}
                            onChange={(e) => {
                                setRegisterData({ ...registerData, [e.target.name]: e.target.value });
                                handleChange();
                            }}
                            margin="normal"
                            required
                            helperText="8-32 characters with uppercase, lowercase, digit, and special character"
                        />
                        
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) => {
                                setRegisterData({ ...registerData, [e.target.name]: e.target.value });
                                handleChange();
                            }}
                            margin="normal"
                            required
                            helperText="Must match the password above"
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ marginTop: 2, marginBottom: 2 }}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                        
                        <Typography align="center">
                            Already have an account?{' '}
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};
