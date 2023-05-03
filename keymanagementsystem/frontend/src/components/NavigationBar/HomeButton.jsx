// Library imports
import React from 'react'

// MUI imports
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

export default function HomeButton(props) {
    return (
        <div>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.onClick}
                edge="start"
                sx={{ ml: 2}}
            >
                <HomeIcon style={{color: "white"}}/>
            </IconButton>
        </div>

    )
}
