/**
 * The page where admin can change the role of a user
 */

// Library imports
import React, { useState, useContext } from "react";

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

// Context imports
import ClientInfoContext from "../contexts/ClientInfoContext";

// Service imports
import UsersService from "../services/usersService/index";


export default function ChangeRolesPage() {

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    // New full name hook
    const [newRole, setNewRole] = useState("");

    //hook for the pid to adjust
    const [userpid, setuserpid] = useState("");


    // Handler functions

    /**
     * Updates the role of a given user
     * @returns 
     */
    const handleUpdateClicked = () => {

        // Ensure a valid role was set
        if (newRole != "sudo" && newRole != "administrator" && newRole != "requestor") {
            alert("Error! The new role to be set must be either sudo, administrator, or requestor. The new role cannot be blank. Role entered was: " + newRole);

            return;
        }
        
        if (userpid == "" || userpid == clientInfo.pid) {
            alert("Error! The pid to modify must be valid and not blank. To prevent admins from locking themselves out, admins cannot adjust their own role. \n To remove an admin, have a different admin remove the user. Or, manually edit the mongoDB users collection.");

            return;
        }
        

        // Use the users service to set the new full name
        UsersService.updateUser(userpid, { role: newRole }).then(result => {

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
                <form onSubmit={ (event) => event.preventDefault()}>
                    <Typography
                        align="center"
                        variant="h2"
                        component="div"
                        color="black"
                        paddingBottom="7%"
                    >
                        Your Role is {clientInfo.role}
                    </Typography>
                    <Box
                        sx={{
                            width: 839,
                            height: 431,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <Box sx={{}}>
                            <TextField
                                sx={{ width: 329, height: 59, marginTop: 4, marginLeft: 31 }}
                                required
                                margin="normal"
                                id="userpid"
                                label="User PID to Change"
                                name="user pid"
                                value={userpid}
                                onChange={e => setuserpid(e.target.value)}
                            />
                            
                            <FormControl
                                sx={{ width: 226, height: 59, marginTop: 4,  marginLeft: 31 }}
                            >
                                <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                                <Select
                                    required
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={newRole}
                                    label="UserRole"
                                    onChange={(e) => setNewRole(e.target.value)}
                                >
                                    <MenuItem value={"administrator"}>Administrator</MenuItem>
                                    <MenuItem value={"requestor"}>Requestor</MenuItem>
                                    <MenuItem value={"sudo"}>Sudo</MenuItem>
                                </Select>

                            </FormControl>
                            
                        </Box>

                        <Button
                            type="submit"
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
                </form>
            </div>
        )
    } else {
        return (
            <div>
                 <h1>Client Info Failed to Load</h1>
            </div>
        )
    }
}