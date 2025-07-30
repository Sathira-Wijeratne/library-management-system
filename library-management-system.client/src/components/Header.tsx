import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Header(){
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        flexGrow: 1,
                        fontWeight: 600,
                    }}
                >
                    Library Management System
                </Typography>
            </Toolbar>
        </AppBar>
    );
}