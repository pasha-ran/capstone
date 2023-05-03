/**
 * The page where the requestor can see their owned keys
 * 
 * TODO:
 *      - The report key form should provide a description of what happened
 */


// Library imports
import React, { useState, useEffect, useContext } from "react";

// MUI imports
import Button from '@mui/material/Button';

// Context imports
import ClientInfoContext from "../contexts/ClientInfoContext";

// Service imports
import UsersService from "../services/usersService/index";
import EmailService from "../services/emailService/index";
import LedgerService from "../services/ledgerService/index";

// MUI data table
import MUIDataTable from "mui-datatables";

export default function SeeOwnedKeys() {

    // Janky counter for updating useEffect below
    let [counter, setCounter] = useState(0);

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    // Owned keys data
    const [ownedKeysData, setOwnedKeysData] = useState([]);
    useEffect(() => {
        if (clientInfo.pid !== null) {
            console.log(clientInfo.pid);
            UsersService.getUserOwnedKeys(clientInfo.pid).then(result => {
                if (result.ok) {
                    setOwnedKeysData(result.data);
                } else {
                    alert(result.msg);
                }
            });
        } else {
            console.error("For some reason, something is null");
        }
    }, [counter]);

    // Handler functions

    const handleReturnClicked = (tagNumber) => {
        if (confirm(`Are you sure you want to return the key with tag number ${tagNumber}`)) {

            // First, remove the key from the user
            UsersService.removeKey(clientInfo.pid, tagNumber).then(result => {
                if (result.ok) {

                    // Then, use email service to send an email to the adminstrator about a returned key
                    EmailService.sendReturnEmail({ tag_number: tagNumber }).then(result => {

                        if (result.ok) {
                            alert(result.msg);

                            // Add the record to database
                            LedgerService.addRecord({
                                tag_number: tagNumber,
                                pid: clientInfo.pid,
                                exchange: "returned",
                                comment: "Auto-Generated"
                            }).then(result3 => {
                                if (!result3.ok) {
                                    alert(result3.msg);
                                }
                            });

                            setCounter(counter + 1);    // Trigger useEffect for owned keys
                        } else {
                            alert(result.msg);
                        }
                    })

                } else {
                    console.log("Coming from return clicked user service...");
                    alert(result.msg);
                }
            })
        }
    }

    const handleReportClicked = (tagNumber) => {

        // First, prompt the user to enter the reason why they are reporting this key
        let reason = prompt("NOTICE! By reporting a key, you have full responsibility for finding and returing this key! Please fill out why you are reporting this key");

        // Do not move on if no reason was provided
        if (reason === null) {
            return;
        }

        // First, remove the key from the user
        UsersService.removeKey(clientInfo.pid, tagNumber).then(result => {
            if (result.ok) {

                // Then, use email service to send an email to the administrator about a reported key
                EmailService.sendReportEmail({ tag_number: tagNumber, reason: reason }).then(result => {
                    if (result.ok) {
                        alert(result.msg);

                        LedgerService.addRecord({
                            tag_number: tagNumber,
                            pid: clientInfo.pid,
                            // full_name: fullName,
                            exchange: "reported",
                            comment: "Auto-Generated. Reason: " + reason
                        }).then(result => {
                            if (!result.ok) {
                                alert(result.msg);
                            }
                        });

                        setCounter(counter + 1);    // Trigger useEffect for owned keys
                    } else {
                        alert(result.msg);
                    }
                })

            } else {
                console.log("Coming from report clicked user service...");
                alert(result.msg);
            }
        });

    }


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
        },

        {
            name: "return",
            label: "Return Key",
            options: {
                filter: false,
                download: false,        // should not show in CSV
                
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleReturnClicked(tableMeta.rowData[0])}
                            >
                                Return
                            </Button>
                        </div>
                    );
                }
            }
        },

        {
            name: "Report",
            label: "Report Key",
            options: {
                filter: false,
                download: false,        // should not show in CSV

                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleReportClicked(tableMeta.rowData[0])}
                            >
                                Report
                            </Button>
                        </div>
                    );
                }
            }
        },
    ];

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
        <div>
            <MUIDataTable
                title={"Owned Keys"}
                data={ownedKeysData}
                columns={columns}
                options={options}
            />
        </div>
    )
}