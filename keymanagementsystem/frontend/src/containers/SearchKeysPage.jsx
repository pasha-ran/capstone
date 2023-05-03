/**
 * The page where the administrator will search for keys
 */

// Library imports
import React, { useEffect, useState } from 'react';

// MUI imports
import {
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    CssBaseline,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    TextField,
    Typography,
    makeStyles,
    withStyles
} from "@mui/material";
import { Select } from "formik-material-ui";
import { Field } from "formik"

// Service imports
import KeysService from "../services/keysService/index";
import UsersService from "../services/usersService/index";
import LedgerService from "../services/ledgerService/index";
import CASService from "../services/casService/index";

// MUI data table
import MUIDataTable from "mui-datatables";
import { useDialog } from "react-mui-dialog";
import * as Yup from "yup";
import SelectInput from '@mui/material/Select/SelectInput';

export default function SearchKeysPage() {


    // Janky counter for updating useEffect below
    let [counter, setCounter] = useState(0);

    // Key data
    const [keyData, setKeyData] = useState([]);
    useEffect(() => KeysService.getAllKeys().then(result => {

        console.log("I was called because counter is " + counter);

        if (result.ok) {
            setKeyData(result.data);
        } else {
            alert(result.msg)
        }
    }), [counter]);

    // Handler functions

    /**
     * Handle when the assign button is clicked
     * @param {String} tag_number - The tag number for the key to assign
     */
    const handleAssignClicked = (tag_number) => {

        // Prompt user to enter pid
        const pid = prompt("Enter the PID you want to assign this key to, or N/A for a user without a PID");

        // Do not move on if the input was not provided (such as clicking the cancel button)
        if (pid === null) {
            return;
        }

        // Assign the key
        UsersService.assignKey(pid, tag_number).then(result => {
            if (result.ok) {
                alert(result.msg);

                // Add the record to database
                LedgerService.addRecord({
                    tag_number: tag_number,
                    pid: pid,
                    exchange: "acquired",
                    comment: "Auto-Generated"
                }).then(result => {
                    if (!result.ok) {
                        alert(result.msg);
                    }
                });

                setCounter(counter + 1); // Trigger the use effect 
            } else {
                if (pid == "") {
                    alert("No pid given!");
                }
                else {
                    if(confirm("User with PID " + pid + " has not signed in before or the PID does not exist. Instruct this user to sign in on this website if possible.\nForce Create a new user instead?")){
                        handleAddUser(pid, tag_number);
                    }
                }
            }
        });
        
    }

    /**
     * Handle adding new users
     * @param {String} tag_number - The tag number for the key to assign
     * @param {String} pid
     */
     const handleAddUser = (pid, tag_number) => {

        // Do nothing if there is no pid
        if (pid == null) {
            return;
        }

        // Prompt to get the full name
        let fullName = prompt("Enter the user's full name");
        // Prompt to get the full name
        let newPid = prompt("Enter the user's PID, if they have one. If not, you can enter a mock PID for record keeping (e.g. a user's email). Mock PIDs should be unique to a user and not conflict with any other PIDs. \n Users without valid PID cannot sign on or return keys on the website. Their keys must be force returned ");

        let realOrMock = prompt("If the user does not have a PID, state the reason shortly (e.g. \"visitor\" or \"custodian\"). Otherwise, leave this blank.");

        let setmessage = "";

        if (realOrMock == "") {
            setmessage = "Auto-Gen. Force Create User.";
        }
        else {
            setmessage = "Mock: " + realOrMock;
        }

        // Create a User object
        const user = {
            pid: newPid,
            full_name: fullName,
            role: "requestor"
        }

        // Add the user to the database
        UsersService.addUser(user).then(result => {
            if (!result.ok) {
                alert(result.msg);
            } else {
                // alert(result.msg);

                // Assign the key
                UsersService.assignKey(newPid, tag_number).then(result2 => {
                    if (result2.ok) {
                        alert(result2.msg);

                        // Add the record to database
                        LedgerService.addRecord({
                            tag_number: tag_number,
                            pid: newPid,
                            exchange: "acquired",
                            comment: setmessage
                        }).then(result3 => {
                            if (!result3.ok) {
                                alert(result3.msg);
                            }
                        });

                        setCounter(counter + 1);
                    } else {
                        alert(result2.msg);
                    }
                });
            }
        });

    }

    /**
     * Handle when the return button is clicked
     * @param {String} tag_number 
     */
     const handleReturnClicked = (tag_number) => {

        // First, get the pid of the user of the key (if any)
        var pid = "";
        KeysService.getKeyOwner(tag_number).then(result => {
            if (result.ok) {
                pid = result.data.pid;
            }

            // Code is inside the service so that value of pid is gotten
            // before it tries to return the key

            // Return the key
            KeysService.returnKey(tag_number).then(result2 => {
                if (result2.ok) {
                    alert(result2.msg);
                    setCounter(counter + 1);
                } else { // Force returning a key
                    handleForceReturn(tag_number, pid);
                }
            });
        });
        
    }

    /**
     * Handle force returning keys
     * @param {String} tag_number 
     * @param {String} pid
     */
    const handleForceReturn = (tag_number, pid) => {

        // Do nothing if there is no pid
        if (pid == null) {
            return;
        }

        let warning = "WARNING: User " + pid + " still owns this key!\nPress OK to force return the key.";
        if (confirm(warning) == true) {

            // Return the key for the user
            UsersService.removeKey(pid, tag_number).then(result => {
                if (!result.ok) {
                    alert(result.msg);
                } else {
                    // Return the key
                    KeysService.returnKey(tag_number).then(result2 => {
                        if (result2.ok) {
                            alert(result2.msg);

                            // Add the record to database
                            LedgerService.addRecord({
                                tag_number: tag_number,
                                pid: pid,
                                exchange: "returned",
                                comment: "Auto-Generated"
                            }).then(result3 => {
                                if (!result3.ok) {
                                    alert(result3.msg);
                                }
                            });

                            setCounter(counter + 1);
                        } else {
                            alert(result2.data.msg);
                        }
                    });
                }
            });

        }
    }

    /**
     * Handle when the return button is clicked
     * @param {String} tag_number 
     */
     const handleCheckKeyOwner = (tag_number) => {

        // First, get the pid of the user of the key
        KeysService.getKeyOwner(tag_number).then(result => {
            if (result.ok) {
                alert("Key Owner: " + result.data.pid);
            } else {
                alert(result.msg);
            }

        });
    }

    const { openDialog } = useDialog();
    const handleEditClicked = (currentTag, currentSeries, currentSeq, 
        currentBuild, currentType, currentLoc, currentComm) => {
        let currentTagNumber = currentTag;
        let currentSeriesID = currentSeries;
        let currentSequenceID = currentSeq;
        let currentBuilding = currentBuild;
        let currentKeyType = currentType;
        let currentLocation = currentLoc;
        let currentComment = currentComm;

        openDialog({

            title: "Edit Key",
            contentText: "Fill in the fields to edit the key",

            fields: {
                tagNumber: {
                    initialValue: currentTagNumber,
                    label: "Tag Number",
                    fieldProps: { variant: "outlined" }
                },
                seriesID: {
                    initialValue: currentSeriesID,
                    label: "Series ID",
                    fieldProps: { variant: "outlined" }
                },
                sequenceID: {
                    initialValue: currentSequenceID,
                    label: "Sequence ID",
                    fieldProps: { variant: "outlined" }
                },
                building: {
                    initialValue: currentBuilding,
                    label: "Building",
                    fieldProps: { variant: "outlined" }
                },

                keyType: {
                    initialValue: currentKeyType,
                    component: (
                        <FormControl>
                            <InputLabel htmlFor="keyType"></InputLabel>
                            <Field
                                component={Select}
                                name="keyType"
                                inputProps={{
                                    id: "keyType"
                                }}
                                validate={(value) => {
                                    if (value === "") {
                                        alert("Must select key type!");
                                        return "";  // Hack to prevent dialog from closing
                                    }
                                }}
                            >
                                <MenuItem key={"Door"} value={"Door"}>Door</MenuItem>
                                <MenuItem key={"Display case"} value={"Display case"}>Display case</MenuItem>
                                <MenuItem key={"File cabinet"} value={"File cabinet"}>File cabinet</MenuItem>
                            </Field>
                        </FormControl>
                    )
                },
                location: {
                    initialValue: currentLocation,
                    label: "Location",
                    fieldProps: { variant: "outlined" }
                },
                comment: {
                    initialValue: currentComm,
                    label: "Comment",
                    fieldProps: { variant: "outlined" }
                },
                
            },
            validationSchema: Yup.object({
                tagNumber: Yup.number().required("This field is required"),
                seriesID: Yup.string().required("This field is required"),
                sequenceID: Yup.number().required("This field is required"),
                building: Yup.string().required("This field is required"),
                keyType: Yup.string().required("This field is required"),
                // location: Yup.string().required("This field is required"),
            }),
    
                // Define buttons
            cancelButton: { children: "Cancel" },
            submitButton: { children: "Submit" },
    
                // Define handlers
            onSubmit: async ({ tagNumber, seriesID, sequenceID, 
                    building, keyType, location, comment }) => {
                        const key = {
                            tag_number: tagNumber,
                            series_id: seriesID,
                            sequence_id: sequenceID,
                            building: building,
                            key_type: keyType,
                            location: location,
                            comment: comment
                        }
                        // currently passing in new tag number here, then update in index.js for keysService
                        // need to pass in old tag number
                        KeysService.updateKey(currentTagNumber, key).then(result => {
                            if (!result.ok) {
                                alert(result.msg);
                            } else {
                                alert(result.msg);
                                
                                CASService.getClientInfo().then(result => {
                                    if (!result.ok) {
                                        alert(result.msg);
                                    }
                                    else {
                                        // Add a record indicating key edit
                                        LedgerService.addRecord({
                                            tag_number: tagNumber,
                                            pid: result.data.pid,
                                            exchange: "acquired",
                                            comment: "Auto-Generated: Key edited"
                                        }).then(result => {
                                            if (!result.ok) {
                                                alert(result.msg);
                                            }
                                        });
                                    }
                                })

                                setCounter(counter + 1);
                            }
                        })
                }
                
            }

            
        )

    }

    // Define all columns
    const columns = [
        {
            name: "tag_number",
            label: "Tag Number",
            options: { filter: true, sort: true, filterType: "textField",
                sortCompare: (order) => {
                    return (obj1, obj2) => {
                    console.log(order);
                    let val1 = parseFloat(obj1.data);
                    let val2 = parseFloat(obj2.data);
                    return (val1 - val2) * (order === 'asc' ? 1 : -1);
                    };
                }
            }
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
                filter: true, sort: false, filterType: "textField",
                customBodyRender: (val) => { return String(val).replace(",", "/") }
            }
        },

        {
            name: "is_available",
            label: "Is Available",
            options: {
                filter: true, sort: false, filterType: "multiselect", display: false,
                customBodyRender: (val) => { return val === true ? "true" : "false" }
            }
        },

        {
            name: "see_owner",
            label: "Key Owner",
            options: {
                filter: false,
                sort: false,
                download: false,        // should not show in CSV
                customBodyRender: (value, tableMeta, updateValue) => {

                    let tagNumber = tableMeta.rowData[0];
                    let isAvailable = tableMeta.rowData[6];

                    if (isAvailable) {
                        return (
                            <div>
                                
                            </div>
                        )

                    } else {
                        return (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleCheckKeyOwner(tagNumber)}
                            >
                                See Owner
                            </Button>
                        )
                    }
                }
            }
        },

        {
            name: "assign_return",
            label: "Assign / Return key",
            options: {
                filter: false,
                sort: false,
                download: false,        // should not show in CSV
                customBodyRender: (value, tableMeta, updateValue) => {

                    let tagNumber = tableMeta.rowData[0];
                    let isAvailable = tableMeta.rowData[6];

                    if (isAvailable) {
                        return (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleAssignClicked(tagNumber)}
                            >
                                Assign
                            </Button>
                        )

                    } else {
                        return (
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => handleReturnClicked(tagNumber)}
                            >
                                Return
                            </Button>
                        )
                    }
                }
            }
        },
        {
            name: "edit_key",
            label: "Edit Key",
            options: {
                filter: false,
                sort: false,
                download: false,        // should not show in CSV
                customBodyRender: (value, tableMeta, updateValue) => {
                    let currentTag = tableMeta.rowData[0];
                    let currentSeries = tableMeta.rowData[1];
                    let currentSeq = tableMeta.rowData[2];
                    let currentBuild = tableMeta.rowData[3];
                    let currentType = tableMeta.rowData[4];
                    let currentLoc = tableMeta.rowData[5];
                    let currentComm = tableMeta.rowData[10];

                    return (
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => handleEditClicked(currentTag, currentSeries, 
                                currentSeq, currentBuild, currentType, currentLoc, currentComm)}
                        >
                            Edit
                        </Button>
                    )
                }
            }
        },
        {
            name: "comment",
            label: "Comment",
            options: { filter: true, sort: false, filterType: "dropdown" }
        },

    ];

    // Options
    const options = {

        sortOrder: {
            name: 'tag_number',
            direction: "asc"
        },

        // Only 1 row can be selected at a time
        selectableRows: "single",

        // Handle delete functionality
        onRowsDelete: (rowsDeleted) => {
            let index = rowsDeleted.data[0].dataIndex;
            let tag_number = keyData[index].tag_number;

            // Prompt the user to confirm their decision
            if (confirm(`Are you sure you want to delete the key with tag: ${tag_number}?`)) {

                // Delete the key
                KeysService.deleteKey(tag_number).then(result => {
                    if (!result.ok) {
                        alert(result.msg);
                        return false;
                    } else {
                        setCounter(counter + 1); // Force useEffect trigger
                        alert(result.msg);
                        return true;
                    }
                });

                return true;
            } else {
                return false;
            }
        },

        // Set CSV download options
        downloadOptions: {
            filterOptions: {
                useDisplayedColumnsOnly: true,
                useDisplayedRowsOnly: true,
            }
        },

        print: false // hide print button
    };

    return (
        <div>
            <MUIDataTable
                title={"Key List"}
                data={keyData}
                columns={columns}
                options={options}
            />
        </div>
    )
}