import React from "react";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Link from '@mui/material/Link';

// Icon imports
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';


export default function AdministratorList() {
    return (
        <div>
            <List>
                <Link href="/search/keys" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <KeyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Search Keys" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/search/keysbypid" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <KeyIcon /> 
                            </ListItemIcon>
                            <ListItemText primary="Search Keys by PID" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/search/users" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <PersonIcon /> 
                            </ListItemIcon>
                            <ListItemText primary="Search Users" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/changeroles" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton variant="link" href="changeroles">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Change Users Role" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/changeadminemail" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton variant="link" href="changeadminemail">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Change Admin Email" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/ledger" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <HistoryEduIcon />
                            </ListItemIcon>
                            <ListItemText primary="Ledger" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/addkey" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton variant="link" href="addkey">
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add A Key" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/ownedkeys" underline="none" style={{ color: 'black' }}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <KeyIcon />
                        </ListItemIcon>
                        <ListItemText primary="See Owned Keys" />
                    </ListItemButton>
                </ListItem>
                </Link>
            </List>
        </div>
    );
}