/**
 * The page where admin can change the admin email
 */

// Library imports
import React, { useState, useContext } from "react";

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Service imports
import EmailService from "../services/emailService/index";

// Get admin email
var adminEmail = "";
EmailService.getAdminEmail().then(result => {
    if (result.ok) {
        adminEmail = result.data;
    } else {
        alert(result.msg)
    }
});


export default function ChangeAdminEmailPage() {

    // New email hook
    const [newEmail, setNewEmail] = useState("");

    // Handler functions

    /**
     * Updates the role of a given user
     * @returns 
     */
    const handleUpdateClicked = () => {

        // Ensure an email was entered
        if (newEmail == "") {
            alert("Error! Please enter an email!");

            return;
        }
        

        // Use the email service to set the new admin email
        EmailService.updateAdminEmail(newEmail).then(result => {
            if (result.ok) {
                alert(result.msg);
                window.location.reload();
            } else {
                alert(result.msg);
            }
        });
    }

    if (adminEmail !== null) {
        return (
            <div>
                
                <h1>The current administrator email is: {adminEmail}</h1>
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
                            id="newEmail"
                            label="New admin email"
                            name="new email"
                            onChange={e => setNewEmail(e.target.value)}
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
        return (
            <div>
                 <h1>Admin Email Failed to Load</h1>
            </div>
        )
    }
}