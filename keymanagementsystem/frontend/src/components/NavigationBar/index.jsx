
// Library imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI imports
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

// Sub-component imports
import { NavAppBar } from './NavAppBar';
import MenuButton from './MenuButton';
import HomeButton from './HomeButton';
import ProfileButton from './ProfileButton'
import MenuDrawer from './MenuDrawer';
import { StyledTransition } from './StyledTransition';
import { MenuDrawerHeader } from './MenuDrawerHeader'


export default function NavigationBar(props) {

    // reactive variables
    const [open, setOpen] = useState(false);

    // navigation
    const navigate = useNavigate();

    // handler functions
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleHome = () => navigate("/home");


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <NavAppBar position="fixed" open={open} style={{ backgroundColor: '#68293B' }}>
                <Toolbar>
                    {/* Clicking this button just triggers the drawer */}
                    <MenuButton onClick={handleDrawerOpen} />

                    {/* Navigates to the home route */}
                    <HomeButton onClick={handleHome} />

                    {/* Click to trigger profile menu */}
                    <ProfileButton />
                </Toolbar>
            </NavAppBar>

            {/* Because the drawer is separate from the button */}
            <MenuDrawer open={open} onClick={handleDrawerClose} />

            <StyledTransition open={open}>
                <MenuDrawerHeader />
            </StyledTransition>
        </Box>
    );
}
