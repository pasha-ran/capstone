// Library imports
import React, { useContext } from 'react'

// MUI imports
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';

// Context imports
import ClientInfoContext from "../../contexts/ClientInfoContext";

// Service imports
import CASService from "../../services/casService/index"

export default function ProfileList({ onClose }) {

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    /**
     * Login the client
     */
    const handleLoginClicked = () => {

        // Get destination url which should map to home page
        const currentPage = window.location.href;
        const lastIndex = currentPage.lastIndexOf("/");
        const before = currentPage.slice(0, lastIndex);
        const destination = `${before}/home`;

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/cas/login?destination=${destination}`;

        // Navigate to URL
        window.location.href = url;
    }

    /**
     * Logout the client
     */
    const handleLogoutClicked = () => {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/cas/logout`;

        // Open a new tab that has the logout URL
        let newTab = window.open(url);

        // Refresh the main window on the side
        window.location.reload();

        // Force the main window to go to the home route
        window.location.href = "/home";
    }

    if (clientInfo !== null) {
        return (
            <div>
                <MenuItem onClick={onClose}>PID: {clientInfo.pid}</MenuItem>
                <MenuItem onClick={onClose}>Role: {clientInfo.role} </MenuItem>
                <Link href="/editprofile" underline="none" style={{ color: 'black' }}>
                    <MenuItem onClick={onClose}>
                        <EditIcon style={{ paddingRight: "8%" }} />
                        Edit Profile
                    </MenuItem>
                </Link>
                <MenuItem onClick={handleLogoutClicked}>
                    <LogoutIcon style={{ paddingRight: "8%" }} />
                    Logout
                </MenuItem>
            </div>
        )
    } else {
        return (
            <div>
                <MenuItem onClick={handleLoginClicked}>Login</MenuItem>
            </div>
        )
    }
}
