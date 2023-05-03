/**
 * The page where the administrator will work with their ledger
 */

// Library imports
import React, { useState, useEffect } from "react";

// MUI and Formik imports
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
} from "@material-ui/core";
import { Select } from "formik-material-ui";
import { Field } from "formik"


// MUI data table and dialog
import MUIDataTable from "mui-datatables";
import { useDialog } from "react-mui-dialog";

// Validation package
import * as Yup from "yup";

// Service class imports
import LedgerService from "../services/ledgerService/index";


export default function LedgerPage() {


    // Janky counter for updating useEffect below
    let [counter, setCounter] = useState(0);

    // Ledger data
    const [ledgerData, setLedgerData] = useState([]);
    useEffect(() => LedgerService.getAllRecords().then(result => {
        if (result.ok) {

            // First get the data
            let data = result.data;

            // For each element, change the date to milliseconds
            data.forEach(element => {
                let utcDate = new Date(element.date.$date); // how can we convert this to local time?
                element.date = utcDate.getTime();
            });

            // Now set the ledger data
            setLedgerData(data);
        } else {
            alert(result.msg);
        }
    }), [counter]);

    // Dialog hook
    const { openDialog } = useDialog();

    // Handler functions

    // Edit a current record
    const handleEditClicked = (rowData) => {

        // Get current fields
        let oid = rowData[0].$oid;
        let currentTagNumber = rowData[1];
        let currentPID = rowData[2];

        let dateStrArr = new Date(rowData[3]).toISOString().split("T")[0].split("-");
        let currentDateStr = `${dateStrArr[1]}-${dateStrArr[2]}-${dateStrArr[0]}`;

        let currentExchange = rowData[4];
        let currentComment = rowData[5];

        // Now create a dialog
        openDialog({

            // Define title and content
            title: "Edit a record",
            contentText: "Fill in the fields for editing this record",

            // Define all fields here
            fields: {
                tagNumber: { initialValue: currentTagNumber, label: "Tag Number", fieldProps: { variant: "outlined" } },
                pid: { initialValue: currentPID, label: "PID", fieldProps: { variant: "outlined" } },

                exchange: {
                    initialValue: currentExchange,
                    component: (
                        <FormControl>
                            <InputLabel htmlFor="exchange"> Select exchange type </InputLabel>
                            <Field
                                component={Select}
                                name="exchange"
                                inputProps={{
                                    id: "exchange"
                                }}
                                validate={(value) => {
                                    if (value === "") {
                                        alert("Must select exchange type!");
                                        return "";  // Hack to prevent dialog from closing
                                    }
                                }}
                            >
                                <MenuItem key={"acquired"} value={"acquired"}>Acquired</MenuItem>
                                <MenuItem key={"returned"} value={"returned"}>Returned</MenuItem>
                                <MenuItem key={"reported"} value={"reported"}>Reported</MenuItem>
                            </Field>
                        </FormControl>
                    )
                },

                date: { initialValue: currentDateStr, label: "Date", fieldProps: { variant: "outlined" } },
                comment: { initialValue: currentComment, label: "Comments", fieldProps: { variant: "outlined" } },
            },

            // Ensure all fields provided
            validationSchema: Yup.object({
                tagNumber: Yup.number().required("This field is required"),
                pid: Yup.string().required("This field is required"),
                date: Yup.date().required("This field is required")
            }),

            // Define buttons
            cancelButton: { children: "Cancel" },
            submitButton: { children: "Submit" },

            // Define handlers
            onSubmit: async ({ tagNumber, pid, date, exchange, comment }) => {

                // First we need to convert the date string back to ISO format
                let actualDate = new Date(date).toISOString(); //.split("T")[0];
                console.log(actualDate);

                // Update record in database
                LedgerService.updateRecord(oid, {
                    tag_number: tagNumber,
                    pid: pid,
                    date: actualDate,
                    exchange: exchange,
                    comment: comment
                }).then(result => {
                    if (!result.ok) {
                        alert(result.msg);
                    } else {
                        alert(result.msg);
                        setCounter(counter + 1);
                    }
                });
            },
        });
    }

    // Add a new record
    const handleAddRecord = () => {
        openDialog({

            // Define title and content
            title: "Add a new record",
            contentText: "Fill in the fields for a new record in the ledger",

            // Define all fields here
            fields: {
                tagNumber: {
                    initialValue: "",
                    label: "Tag Number",
                    fieldProps: { variant: "outlined" }
                },

                pid: {
                    initialValue: "",
                    label: "PID",
                    fieldProps: { variant: "outlined" }
                },

                exchange: {
                    initialValue: "",
                    component: (
                        <FormControl>
                            <InputLabel htmlFor="exchange"> Select exchange type </InputLabel>
                            <Field
                                component={Select}
                                name="exchange"
                                inputProps={{
                                    id: "exchange"
                                }}
                                validate={(value) => {
                                    if (value === "") {
                                        alert("Must select exchange type!");
                                        return "";  // Hack to prevent dialog from closing
                                    }
                                }}
                            >
                                <MenuItem key={"acquired"} value={"acquired"}>Acquired</MenuItem>
                                <MenuItem key={"returned"} value={"returned"}>Returned</MenuItem>
                                <MenuItem key={"reported"} value={"reported"}>Reported</MenuItem>
                            </Field>
                        </FormControl>
                    )
                },

                comment: {
                    initialValue: "",
                    label: "Comments",
                    fieldProps: { variant: "outlined" }
                },
            },

            // Ensure all fields provided
            validationSchema: Yup.object({
                tagNumber: Yup.string().required("This field is required"),
                pid: Yup.string().required("This field is required"),
            }),

            // Define buttons
            cancelButton: { children: "Cancel" },
            submitButton: { children: "Submit" },

            // Define handlers
            onSubmit: async ({ tagNumber, pid, exchange, comment }) => {

                // Add the record to database
                LedgerService.addRecord({
                    tag_number: tagNumber,
                    pid: pid,
                    exchange: exchange,
                    comment: comment
                }).then(result => {
                    if (!result.ok) {
                        alert(result.msg);
                    } else {
                        alert(result.msg);
                        setCounter(counter + 1);
                    }
                });
            },
        });
    }


    // Define all columns
    const columns = [
        {
            name: "_id",
            label: "Ledger ID",
            options: {
                filter: true,
                sort: false,
                filterType: "textField",
                display: false,         // because it looks ugly to show this
                download: false,        // should not show in CSV
                customBodyRender: (val) => { return String(val.$oid) }
            }
        },

        {
            name: "tag_number",
            label: "Tag Number",
            options: { filter: true, sort: false, filterType: "textField" }
        },

        {
            name: "pid",
            label: "PID",
            options: { filter: true, sort: false, filterType: "textField" }
        },

        {
            name: "date",
            label: "Date",
            options: {
                filter: true,
                sort: true,
                filterType: "custom",

                // Use to present date in readable format
                customBodyRender: (val) => {
                    let dateStrArr = new Date(val).toISOString().split("T")[0].split("-");
                    return `${dateStrArr[1]}-${dateStrArr[2]}-${dateStrArr[0]}`;
                },

                // Custom filter option object
                customFilterListOptions: {

                    render: v => {
                        if (v[0] && v[1]) {
                            return [`From: ${v[0]}`, `To: ${v[1]}`];
                        } else if (v[0]) {
                            return `From: ${v[0]}`;
                        } else if (v[1]) {
                            return `To: ${v[1]}`;
                        }
                        return [];
                    },

                    update: (filterList, filterPos, index) => {
                        console.log('customFilterListOnDelete: ', filterList, filterPos, index);

                        if (filterPos === 0) {
                            filterList[index].splice(filterPos, 1, '');
                        } else if (filterPos === 1) {
                            filterList[index].splice(filterPos, 1);
                        } else if (filterPos === -1) {
                            filterList[index] = [];
                        }

                        return filterList;
                    },


                },

                // Custom filter actual set
                filterOptions: {
                    names: [],
                    logic(date, filters) {
                        
                        let dateTime = new Date(date).getTime();
                        if (filters[0] && filters[1]) {
                            return dateTime < new Date(filters[0]).getTime() || dateTime > new Date(filters[1]).getTime();
                        } else if (filters[0]) {
                            return dateTime < new Date(filters[0]).getTime();
                        } else if (filters[1]) {
                            return dateTime > new Date(filters[1]).getTime();
                        }
                        return false;
                    },
                    display: (filterList, onChange, index, column) => (
                        <div>
                            <FormLabel>Date</FormLabel>
                            <FormGroup row>
                                <TextField
                                    label='from'
                                    value={filterList[index][0] || ''}
                                    onChange={event => {
                                        filterList[index][0] = event.target.value;
                                        onChange(filterList[index], index, column);
                                    }}
                                    style={{ width: '50%', marginRight: '5%' }}
                                />
                                <TextField
                                    label='to'
                                    value={filterList[index][1] || ''}
                                    onChange={event => {
                                        filterList[index][1] = event.target.value;
                                        onChange(filterList[index], index, column);
                                    }}
                                    style={{ width: '50%' }}
                                />
                            </FormGroup>
                        </div>
                    ),
                },
            }
        },

        {
            name: "exchange",
            label: "Exchange",
            options: { filter: true, sort: false, filterType: "textField" }
        },

        {
            name: "comment",
            label: "Comments",
            options: { filter: true, sort: false, filterType: "textField" }
        },

        {
            name: "edit",
            label: "Edit",
            options: {
                filter: false,
                download: false, // should not show in CSV
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleEditClicked(tableMeta.rowData)}
                            >
                                Edit
                            </Button>
                        </div>
                    )
                }
            }
        },

    ]

    // Options
    const options = {

        // Only 1 row can be selected at a time
        selectableRows: "single",

        // Handle the delete functionality
        onRowsDelete: (rowsDeleted) => {
            let index = rowsDeleted.data[0].dataIndex;
            let oid = ledgerData[index]._id.$oid;

            // Prompt the user to confirm their decision
            if (confirm(`Are you sure you want to delete this record?`)) {

                // Delete the key
                LedgerService.deleteRecord(oid).then(result => {
                    if (!result.ok) {
                        alert(result.msg);
                        return false;
                    } else {
                        setCounter(counter + 1); // Force useEffect trigger
                        alert(result.msg);
                        return true;
                    }
                });



            } else {
                return false;
            }
        },

        // Define default sort
        sortOrder: {
            name: 'date',
            direction: 'desc'
        },

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
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddRecord}
            >
                Add Record
            </Button>
            <MUIDataTable
                title={"Ledger"}
                data={ledgerData}
                columns={columns}
                options={options}
            />
        </div>
    )
}
