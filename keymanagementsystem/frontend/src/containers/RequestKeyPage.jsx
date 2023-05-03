/**
 * The page where a requestor makes a request for a key
 */

// Library imports
import React, { useState, useContext } from "react";

// MUI Imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";

import pdf from '../pdfs/COEPolicy.pdf'

// Context imports
import ClientInfoContext from "../contexts/ClientInfoContext";

// Service class imports
import EmailService from "../services/emailService";

export default function RequestKeyPage() {

    // Get client info
    let clientInfo = useContext(ClientInfoContext);

    // Reactive variables
    const [studentID, setStudentID] = useState("");
    const [keyType, setKeyType] = useState("");
    const [description, setDescription] = useState("");
    const [reason, setReason] = useState("");
    const [supervisor, setSupervisor] = useState("");
    const [checked, setChecked] = useState(false); // change to acknowledged

    // Handler functions

    /**
     * Submit a request for a key into the system
     */
    const handleSubmit = () => {

        // Do not move on if all fields aren't specified
        if (studentID === "" ||
            keyType === "" ||
            description === "" ||
            reason === "" ||
            supervisor === "") {
            return;
        }

        // Alert explictly if the check is not checked
        if (!checked) {
            alert("Error! You must check agree and read the policy before you can continue!");
            return;
        }

        if (studentID.length < 4) {
            alert("Error! studentID must be at least 4 digits.");
            return;
        }

        // Alert explictly if the full name is not specified correctly
        if(clientInfo !== null && (clientInfo.full_name === "NA" || clientInfo.full_name == "" )) {
            alert("Error! You should fill out your full name first! Go to edit profile by clicking on icon in the top left of the screen.");
            return;
        }

        // Get the admin email
        EmailService.getAdminEmail().then(result => {
            if (result.ok) {
                var adminEmail = result.data;

                // Create email object
                let email = {
                    student_id: studentID,
                    recipient: adminEmail,
                    key_type: keyType,
                    description: description,
                    reason: reason,
                    supervisor: supervisor
                };

                // Use email service to send a request
                EmailService.sendRequestEmail(email).then(result => {
                    if (result.ok) {
                        alert(result.msg);
                    } else {
                        alert(result.msg);
                    }
                });
            } else {
                alert(result.msg)
            }
        });

    };

    return (
        <div>
            <Typography
                align="center"
                variant="h2"
                component="div"
                color="black"
                paddingBottom='2%'
            >
                Request a key
            </Typography>

            <form onSubmit={(event) => { event.preventDefault() }}>
                <Box
                    sx={{
                        width: 840,
                        height: 550,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                    }}
                >
                    {/* Student ID */}
                    <Box sx={{}}>
                        <TextField
                            sx={{ width: 329, height: 59, marginTop: 4, marginLeft: 10 }}
                            required
                            margin="normal"
                            id="studentID"
                            label="Last four digits of student ID"
                            name="Student ID"
                            onChange={(e) => setStudentID(e.target.value)}
                        />
                    </Box>

                    {/* Supervisor */}
                    <Box sx={{}}>
                        <TextField
                            sx={{ width: 329, height: 59, marginTop: 4, marginLeft: 10 }}
                            required
                            margin="normal"
                            id="Supervisor Email (n/a if not applicable)"
                            label="Supervisor Email (n/a if not applicable)"
                            name="Supervisor Email (n/a if not applicable)"
                            onChange={(e) => setSupervisor(e.target.value)}
                        />
                    </Box>

                    {/* Key type */}
                    <Box>
                        <FormControl
                            sx={{ width: 329, height: 59, marginTop: 1, marginLeft: 10 }}
                        >
                            <InputLabel id="demo-simple-select-label">Key Type</InputLabel>
                            <Select
                                required
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="KeyType"
                                value={keyType}
                                onChange={(event) => setKeyType(event.target.value)}
                            >
                                <MenuItem value={"door"}>Door</MenuItem>
                                <MenuItem value={"display"}>Display Case</MenuItem>
                                <MenuItem value={"file_cabinet"}>File Cabinet</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Description */}
                    <Box>
                        <TextField
                            sx={{ width: 700, height: 59, marginTop: 2, marginLeft: 10 }}
                            required
                            id="description"
                            label="Description"
                            name="Description"
                            inputProps={{ maxLength: 300 }}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Box>

                    {/* Reason */}
                    <Box>
                        <TextField
                            required
                            sx={{ width: 500, height: 59, marginTop: 5, marginLeft: 10 }}
                            multiline
                            rows={2}
                            margin="normal"
                            id="reason"
                            label="Reason"
                            name="Reason"
                            inputProps={{ maxLength: 300 }}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </Box>

                    {/* Disclosure */}
                    <Box sx={{ marginTop: 4, marginLeft: 10 }} >
                        <Typography
                            align="left"
                            variant="body2"
                            component="div"
                            color="black"
                            paddingBottom="2%"
                        >
                            I acknowledge by my signature that the following keys are issued for my use only.
                            Said keys will not be loaned or transferred to another individual without prior
                            approval of the departmental Key Control Designate.
                            I agree to notify the Key Control Designate immediately if any keys are lost or stolen.
                            I agree to use reasonable care in protecting said keys.
                            All keys remain the property of Virginia Tech and must be promptly returned to the departmental
                            Key Control Designate upon termination or transfer to another department.

                        </Typography>

                        <Link href="https://policies.vt.edu/assets/5620.pdf" target="_blank">
                            Read Virginia Tech's Key Policy {"\n"}
                        </Link>
                        <h1></h1>
                        <a href={pdf}  target='_blank'>
                            Read COE Dean's Office Key Policy
                        </a>

                    </Box>

                    {/* Checked */}
                    <Box sx={{ marginTop: 2, marginLeft: 10 }} >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    style={{ align: "right" }}
                                    onChange={(event) => setChecked(event.target.checked)}
                                />
                            }
                            label="Agree to All Policies"
                        />
                    </Box>

                    {/* Submit button */}
                    <Button
                        type="text"
                        lable="Submit"
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            mt: 5,
                            mb: 30,
                            ml: 30,
                            width: 400,
                            height: 50,
                            alignItems: "center",
                        }}
                    >
                        Submit
                    </Button>

                </Box>
            </form>
        </div>
    )
}