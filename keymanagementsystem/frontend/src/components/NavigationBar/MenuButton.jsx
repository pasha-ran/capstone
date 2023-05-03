/** Library imports */
import React, { useState } from 'react'

/** Material imports */
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function MenuButton(props) {

    return (
        <div>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.onClick}
                edge="start"
                sx={{ mr: 2}}
            >
                <MenuIcon style={{color: "white"}}/>
            </IconButton>
        </div>
    )
}
