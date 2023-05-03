// Library imports
import React, { useState } from 'react'

// MUI imports
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';

// Sub-component imports
import ProfileList from "./ProfileList"



export default function ProfileButton() {

    // Anchor reactive variable
    const [anchorEl, setAnchorEl] = useState(null);

    // Handler function when profile button should open
    const handleProfileOpen = (event) => {
        setAnchorEl(event.target);
    }

    // Handler function when profile button should close
    const handleProfileClose = () => {
        setAnchorEl(null);
    }


    return (
        <div
            style={{
                position: 'absolute',
                right: '10px'
            }}
        >

            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileOpen}
                color="inherit"
            >
                <AccountCircle style={{color: "white"}}/>
            </IconButton>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
            >
                <ProfileList onClose={handleProfileClose} />
            </Menu>
        </div>
    )
}
