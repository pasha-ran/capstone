// Library imports
import React, { useContext } from 'react'

// MUI imports
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';

// sub-component imports
import { MenuDrawerHeader } from './MenuDrawerHeader';
import AdministratorList from './MenuLists/AdministratorList';
import RequestorList from './MenuLists/RequestorList';

// Context imports
import ClientInfoContext from "../../contexts/ClientInfoContext";


// Service class imports
import CASService from "../../services/casService/index";


export default function MenuDrawer({open, onClick}) {

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    // Defines width of the drawer. 
    // Higher means opens more of the screen
    const drawerWidth = 240;

    // Setting the theme
    const theme = useTheme();

    // Define roles that can see requestor views
    const requestorViewRoles = new Set(["requestor"]);

    // Define roles that can see administrator views
    const adminstratorViewRoles = new Set(["administrator", "sudo"]);


    return (
        <div>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <MenuDrawerHeader>
                    <IconButton onClick={onClick}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </MenuDrawerHeader>



                {clientInfo !== null && requestorViewRoles.has(clientInfo.role) &&
                    <RequestorList />
                }

                {clientInfo !== null && adminstratorViewRoles.has(clientInfo.role) &&
                    <AdministratorList />
                }

            </Drawer>
        </div>
    )
}
