import React from "react";
import KeyIcon from '@mui/icons-material/Key';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Link from '@mui/material/Link';

export default function RequestorList() {
    return (
        <div>
            <List>
                <Link href="/requestkey" underline="none" style={{ color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <KeyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Request Key" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href="/ownedkeys" underline="none" style={{ color: 'black' }}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ListAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="See Owned Keys" />
                    </ListItemButton>
                </ListItem>
                </Link>
            </List>
        </div>
    );
}