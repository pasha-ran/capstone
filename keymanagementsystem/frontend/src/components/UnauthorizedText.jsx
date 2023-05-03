/**
 * Use this component when you want to render unauthorization
 */

// Library imports
import React from 'react';

// MUI imports
import Typography from "@mui/material/Typography";

export default function UnauthorizedText({ showNeedAdmin }) {

    return (
        <div>
            <Typography
                align="center"
                variant="h2"
                component="div"
                color="black"
                paddingBottom='7%'
            >
                Error, Unauthorized!
            </Typography>

            {showNeedAdmin &&
                <Typography
                    align="left"
                    variant="h3"
                    component="div"
                    color="black"
                    paddingBottom='2%'
                >
                    You do not have correct privileges to access this page!
                </Typography>
            }

            {!showNeedAdmin &&
                <Typography
                    align="left"
                    variant="h3"
                    component="div"
                    color="black"
                    paddingBottom='2%'
                >
                    Login by clicking the profile button on the top right!
                </Typography>
            }

        </div>
    )
}
