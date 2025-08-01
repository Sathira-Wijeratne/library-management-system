import { AppBar, Toolbar, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthService from '../utils/AuthService';

export default function Header(){
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    
    // Media query for responsive design
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(AuthService.isAuthenticated());
        };
        
        checkAuth();
        
        // Check authentication status every second
        const interval = setInterval(checkAuth, 1000);
        
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        AuthService.removeToken();
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography 
                    variant={isMobile ? "h6" : "h4"}
                    sx={{ 
                        flexGrow: 1,
                        fontWeight: 600,
                    }}
                >
                    Library Management System
                </Typography>
                
                <Box>
                    {isAuthenticated && (
                        <Button 
                            color="secondary" 
                            onClick={handleLogout}
                            variant="contained"
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}