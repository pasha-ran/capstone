/**
 * The page where the administrator can add a key
 */

// Library imports
import React, { useState } from "react";

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

// Service class imports
import KeysService from "../services/keysService/index";
import LedgerService from "../services/ledgerService/index";
import CASService from "../services/casService/index";

export default function AddKeyPage() {

    // Reactive variables
    const [tagNumber, setTagNumber] = useState("");
    const [seriesID, setSeriesID] = useState("");
    const [sequenceID, setSequenceID] = useState("");
    const [building, setBuilding] = useState("");
    const [keyType, setKeyType] = useState("");
    const [location, setLocation] = useState("");
    const [comment, setComment] = useState("");

    // Handler functions
    const handleSubmitClicked = () => {

        // Do not move on if all fields aren't specified
        if (tagNumber === "" ||
            seriesID === "" ||
            sequenceID === "" ||
            building === "" ||
            keyType === "" ||
            location === "") {
            return;
        }

        // Create a key object with limited fields
        const key = {
            tag_number: (tagNumber === "") ? null : tagNumber,
            series_id: (seriesID === "") ? null : seriesID,
            sequence_id: (sequenceID === "") ? null : sequenceID,
            building: (building === "") ? null : building,
            key_type: (keyType === "") ? null : keyType,
            location: (location === "") ? null : location,
            comment: (comment === "") ? "" : comment,
            is_available: true
        }

        // Send post request and alert with the response message
        KeysService.addKey(key).then(result => {
            if (result.ok) {
                alert(result.msg);
                
                CASService.getClientInfo().then(result => {
                    if (!result.ok) {
                        alert(result.msg);
                    }
                    else {

                        // Add a record indicating key added
                        LedgerService.addRecord({
                            tag_number: tagNumber,
                            pid: result.data.pid,
                            exchange: "acquired",
                            comment: "Auto-Generated: Key added"
                        }).then(result => {
                            if (!result.ok) {
                                alert(result.msg);
                            }
                        });
                    }
                })

            } else {
                alert(result.msg);
            }
        });
    }

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
                    ADD A KEY
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
                            sx={{ width: 226, height: 59, marginTop: 4, marginLeft: 8, marginRight: 2 }}
                            required
                            margin="normal"
                            id="tagNumber"
                            label="Tag Number"
                            name="Tag Number"
                            value={tagNumber}
                            onChange={(e) => setTagNumber(e.target.value)}
                        />
                        <TextField
                            sx={{ width: 226, height: 59, marginTop: 4, marginRight: 2 }}
                            required
                            margin="normal"
                            id="seriesID"
                            label="Series ID"
                            name="Series ID"
                            value={seriesID}
                            onChange={(e) => setSeriesID(e.target.value)}
                        />
                        <TextField
                            sx={{ width: 226, height: 59, marginTop: 4 }}
                            required
                            margin="normal"
                            id="sequenceID"
                            label="Sequence ID"
                            name="Sequence ID"
                            value={sequenceID}
                            onChange={(e) => setSequenceID(e.target.value)}
                        />
                        <TextField
                            sx={{ width: 226, height: 59, marginTop: 4, marginLeft: 8, marginRight: 2 }}
                            required
                            id="building"
                            label="Building"
                            name="Building"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            autoFocus
                        />
                        <FormControl
                            sx={{ width: 226, height: 59, marginTop: 4 }}
                            required
                        >
                            <InputLabel id="demo-simple-select-label">Key Type</InputLabel>
                            <Select
                                // required
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={keyType}
                                label="KeyType"
                                onChange={(e) => setKeyType(e.target.value)}
                            >
                                <MenuItem value={"Door"}>Door</MenuItem>
                                <MenuItem value={"Display case"}>Display Case</MenuItem>
                                <MenuItem value={"File cabinet"}>File Cabinet</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            sx={{ width: 226, height: 59, marginTop: 4, marginLeft: 2, marginRight: 2 }}
                            required
                            margin="normal"
                            id="location"
                            label="Location"
                            name="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <TextField
                            sx={{ width: 712, height: 59, marginTop: 4, marginLeft: 8, marginRight: 2 }}
                            id="comment"
                            label="Comment"
                            name="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            autoFocus
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSubmitClicked}
                        sx={{
                            mt: 5,
                            mb: 3,
                            ml: 30,
                            width: 343,
                            height: 52,
                            alignItems: "center",
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </div>
    );
}
