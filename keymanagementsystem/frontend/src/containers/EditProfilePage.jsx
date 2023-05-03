/**
 * The page where any user can edit their profile
 */

// Library imports
import React, { useState, useContext } from "react";

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Context imports
import ClientInfoContext from "../contexts/ClientInfoContext";

// Service imports
import UsersService from "../services/usersService/index";


export default function EditProfilePage() {

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    // New full name hook
    const [newFullName, setNewFullname] = useState("");


    // Handler functions

    /**
     * Updates the client's full name
     * @returns 
     */
    const handleUpdateClicked = () => {

        // Ensure a full name was set
        if (newFullName === "") {
            alert("Error! Cannot have blank as full name");
            return;
        }

        // Use the users service to set the new full name
        UsersService.updateUser(clientInfo.pid, { full_name: newFullName }).then(result => {

            if (result.ok) {
                alert(result.msg);
                window.location.reload();
            } else {
                alert(result.msg);
            }
        });
    }

    if (clientInfo !== null) {
        return (
            <div>
                <h1>Your full name is: {clientInfo.full_name}</h1>
                <h1>Your role is: {clientInfo.role}</h1>
                <Box
                    sx={{
                        width: 840,
                        height: 430,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Box sx={{}}>
                        <TextField
                            sx={{ width: 329, height: 59, marginTop: 4, marginLeft: 31 }}
                            id="newFullName"
                            label="Set Full Name"
                            name="Full Name"
                            onChange={e => setNewFullname(e.target.value)}
                            autoFocus
                        />
                    </Box>

                    <Button
                        type="update"
                        variant="contained"
                        onClick={handleUpdateClicked}
                        sx={{
                            mt: 5,
                            mb: 3,
                            ml: 30,
                            width: 340,
                            height: 50,
                            alignItems: "center",
                        }}
                    >
                        Update
                    </Button>
                </Box>
            </div>
        )
    } else {
        return null;
    }
}