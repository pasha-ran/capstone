/**
 * The page where the administrator will search for users
 */

// Library imports
import React, { useEffect, useState } from 'react';

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// MUI data table
import MUIDataTable from "mui-datatables";

// Service class imports
import UsersService from "../services/usersService/index";

export default function SearchKeysByPidPage() {

    // Reactive variables
    let [counter, setCounter] = useState(0);

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    const [ownedKeys, setOwnedKeys] = useState(null);
    const [currentPid, setCurrentPid] = useState("");

    useEffect(() => UsersService.getAllUsers().then(result => {

        console.log("I was called because counter is " + counter);

        if (result.ok) {
            setUserData(result.data);
        } else {
            alert(result.msg)
        }
    }), [counter]);

    // Handler functions
    const handleSearchClicked = () => {

        // Do not move on if the input was not provided (such as clicking the cancel button)
        if (currentPid === null) {
            return;
        }

        // Use service class to set user data
        UsersService.getSingleUser(currentPid).then(result => {
            if (result.ok) {
                setUser(result.data);

                // Use service class to set owned keys
                UsersService.getUserOwnedKeys(currentPid).then(result => {
                    if (result.ok) {
                        setOwnedKeys(result.data);
                    }

                    // No need to do the alert here because the above will already handle that
                });
                
            } else {
                alert(result.msg);
            }
        });
    }

    // const handleSearchClickedName = () => {

    //     // Prompt user to enter pid
    //     const fn = prompt("Enter the full name of the user you want to search");

    //     // Do not move on if the input was not provided (such as clicking the cancel button)
    //     if (fn == "") {
    //         return;
    //     }
    //     //alert(fn + " getSingleUserByName");
    //     // Use service class to set user data
    //     UsersService.getSingleUserByName(fn).then(result => {
    //         if (result.ok) {
    //             //alert(JSON.stringify(result.data));
    //             setUser(result.data);

    //             // Use service class to set owned keys
    //             UsersService.getUserOwnedKeysByName(fn).then(result => {
    //                 if (result.ok) {
    //                     //alert("ok")
    //                     setOwnedKeys(result.data);
    //                 }

    //                 // No need to do the alert here because the above will already handle that
    //             });
                
    //         } else {
    //             //alert(JSON.stringify(result.data));
    //             alert(result.msg);
    //         }
    //     });
    // }

    // Define all columns
    const columns = [
        {
            name: "tag_number",
            label: "Tag Number",
            options: { filter: true, sort: true, filterType: "textField" }
        },

        {
            name: "series_id",
            label: "Series ID",
            options: { filter: true, sort: false, filterType: "textField" }
        },

        {
            name: "sequence_id",
            label: "Sequence ID",
            options: { filter: true, sort: true, filterType: "textField" }
        },

        {
            name: "building",
            label: "Building",
            options: { filter: true, sort: true, filterType: "dropdown" }
        },

        {
            name: "key_type",
            label: "Key Type",
            options: { filter: true, sort: true, filterType: "multiselect" }
        },

        {
            name: "location",
            label: "Location",
            options: {
                filter: true, sort: true, filterType: "textField",
                customBodyRender: (val) => { return String(val) }
            }
        }
    ]

        // Define all columns
        const columnsUser = [
            {
                name: "pid",
                label: "PID",
                options: { filter: true, sort: true, filterType: "textField" }
            },
    
            {
                name: "full_name",
                label: "Full Name",
                options: { filter: true, sort: false, filterType: "textField" }
            },
    
            {
                name: "role",
                label: "Role",
                options: { filter: true, sort: true, filterType: "textField" }
            },
    
        ]

    // Options
    const options = {

        // No checkboxes
        selectableRows: "none",

        // Set CSV download options
        downloadOptions: {
            filterOptions: {
                useDisplayedColumnsOnly: true,
                useDisplayedRowsOnly: true,
            }
        },

        print: false // hide print button
    }


    return (
        <div style={{ align: "center" }}>
            <Box
                sx={{
                    width: 840,
                    height: 230,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                }}
            >

                <Box sx={{}}>
                    <TextField
                        sx={{ width: 329, height: 59, marginTop: 4, marginLeft: 31 }}
                        id="currentPid"
                        label="Current Pid"
                        name="current pid"
                        onChange={e => setCurrentPid(e.target.value)}
                        autoFocus
                    />
                </Box>

                <Button
                    type="update"
                    variant="contained"
                    onClick={handleSearchClicked}
                    sx={{
                        mt: 5,
                        mb: 3,
                        ml: 30,
                        width: 340,
                        height: 50,
                        alignItems: "center",
                    }}
                >
                    Search PID
                </Button>
            </Box>
            <break> </break>
            {/* Show user data conditonally <Button variant="contained" color="primary" onClick={handleSearchClickedName}>Search by Full Name</Button>, button to search by name. doesnt work when people share a name*/}
            {user &&
                <div>
                    <h1>PID: {user.pid}</h1>
                    <h1>Full name: {user.full_name}</h1>
                    <h1>Role: {user.role}</h1>
                    <h1>Owned keys:</h1>
                </div>
            }

            {/* Show key data conditionally */}
            {ownedKeys &&
                <div>
                    <MUIDataTable
                        title={"User's owned keys"}
                        data={ownedKeys}
                        columns={columns}
                        options={options}
                    />
                </div>
            }

        </div>
        
    );
}
