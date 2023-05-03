/**
 * The page that every user sees when going to the website
 */


// Library Imports
import React, { useState, useEffect, useContext } from "react";

// Context imports
import ClientInfoContext from "../contexts/ClientInfoContext";

// MUI Imports
import Typography from "@mui/material/Typography";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

//Component Imports
import FirstTimeUserAccordion from '../components/HomePageAccordions/FirstTimeUserAccordion'
import RequestorAccordion from "../components/HomePageAccordions/RequestorAccordion";
import AdministratorAccordion from "../components/HomePageAccordions/AdministratorAccordion";

//This is the page that will integrate CAS login
export default function HomePage() {

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    // Define roles that can see requestor views
    const requestorViewRoles = new Set(["requestor"]);

    // Define roles that can see administrator views
    const adminstratorViewRoles = new Set(["administrator", "sudo"]);

    return (
        <div>

            {(clientInfo === null || clientInfo === {}) &&
                <Typography
                    align="center"
                    variant="h2"
                    component="div"
                    color="black"
                    paddingBottom='3%'
                >
                    WELCOME TO THE KEY MANAGEMENT SYSTEM
                </Typography>

            }

            {clientInfo !== null &&
                <Typography
                    align="center"
                    variant="h2"
                    component="div"
                    color="black"
                    paddingBottom='3%'
                >
                    Welcome back:  {clientInfo.full_name}
                </Typography>
            }

            <Typography
                align="center"
                component="div"
                color="black"
                paddingBottom='3%'
                variant="button" 
                display="block" 
            >
                *Enable pop-ups while using this website
            </Typography>

            <FirstTimeUserAccordion />

            {clientInfo !== null && requestorViewRoles.has(clientInfo.role) &&

                <div>
                    <RequestorAccordion />

                    <Typography
                        align="left"
                        color="black"
                        paddingBottom='1.5%'
                        variant="button" 
                        display="block" 
                        paddingTop= "5%"
                    >
                        As a requestor:
                    </Typography> 

                    <FormGroup>
                        <FormControlLabel control={<Checkbox  defaultChecked  />} label="You abide to use the system for its 
                        intended purpose. Malicious usage (e.g. spamming request form) can revoke access" />
                        <FormControlLabel control={<Checkbox defaultChecked  />} label="You acknowledge that your supervisor 
                        is the correct supervisor as assigned when making a key request" />
                        <FormControlLabel control={<Checkbox defaultChecked  />} label="You adhere to the key policy when 
                        requesting a key (see the key policy link in the request key page)" />
                    </FormGroup>
                </div>

            }

            {clientInfo !== null && adminstratorViewRoles.has(clientInfo.role) &&
                <div>
                    <AdministratorAccordion />

                    <Typography
                        align="left"
                        color="black"
                        paddingBottom='1.5%'
                        variant="button" 
                        display="block" 
                        paddingTop= "5%"
                    >
                        As a {clientInfo.role}:
                    </Typography>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox  defaultChecked  />} label="Ensure that supervisors have contacted 
                        the respective room owners (if applicable) before finalizing a request" />
                        <FormControlLabel control={<Checkbox defaultChecked  />} label="Use the ledger to stay up to date on all
                         key transactions (further instructions will be provided via notifications from keymanagementsystem@cs.vt.edu)" />
                        <FormControlLabel control={<Checkbox defaultChecked  />} label="All keys added to the system are accurate and 
                        correctly represent the physical details of the key" />
                    </FormGroup>
                </div>
            }
        </div>
    )
}
