// Library imports
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Context provider imports
import { ClientInfoProvider } from "./contexts/ClientInfoContext";
import { DialogProvider } from "react-mui-dialog";

// Container imports for every role
import HomePage from "./containers/HomePage";
import EditProfilePage from "./containers/EditProfilePage";

// Container imports for adminstrator+
import AddKeyPage from "./containers/AddKeyPage";
import SearchKeysPage from "./containers/SearchKeysPage";
import SearchKeysByPidPage from "./containers/SearchKeysByPidPage";
import SearchUsersPage from "./containers/SearchUsersPage";
import LedgerPage from "./containers/LedgerPage";

// Container imports for requestor
import RequestKeyPage from "./containers/RequestKeyPage"
import SeeOwnedKeysPage from "./containers/SeeOwnedKeysPage";

// Component imports
import NavigationBar from "./components/NavigationBar/index";
import ProtectedRoute from "./components/ProtectedRoute";

// Service imports
import CASService from "./services/casService/index";

// CSS imports (is this needed?)
import "./App.css";
import ChangeRolesPage from "./containers/ChangeRolesPage";
import ChangeAdminEmailPage from "./containers/ChangeAdminEmailPage";


function App() {

    // Define global client info state
    const [clientInfo, setClientInfo] = useState(null);   // empty json denotes not ready

    // Define global loading state
    const [isLoading, setIsLoading] = useState(true);

    // Use a useEffect hook to asynchronously get client info
    useEffect(() => {

        // Start loading
        setIsLoading(true);

        // Get the client info
        CASService.getClientInfo().then(result =>{
            if(result.ok) {
                setClientInfo(result.data);
                // Stop loading regardless of result
                setIsLoading(false);
            } else {
                setClientInfo(null);
                // Stop loading regardless of result
                setIsLoading(false);
            }
        })

    }, [])



    return (
        <div
            style={{
                backgroundColor: "white",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ClientInfoProvider value={clientInfo}>

                <DialogProvider>

                    {/** Navigation Bar contains buttons and menus that can trigger the navigation */}
                    <NavigationBar />

                    {/** All routes defined here */}
                    <Routes>

                        {/* For every role */}
                        <Route exact path="/home" element={<HomePage />} />
                        <Route exact path="/" element={<Navigate to="/home" />} />

                        <Route exact path="/editprofile" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={false}>
                                <EditProfilePage />
                            </ProtectedRoute>
                        } />


                        {/* For administrators and above */}
                        <Route exact path="/addkey" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <AddKeyPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/search/keys" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <SearchKeysPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/search/keysbypid" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <SearchKeysByPidPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/search/users" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <SearchUsersPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/ledger" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <LedgerPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/changeroles" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <ChangeRolesPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/changeadminemail" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={true}>
                                <ChangeAdminEmailPage />
                            </ProtectedRoute>
                        } />

                        {/* For requestors */}

                        <Route exact path="/requestkey" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={false}>
                                <RequestKeyPage />
                            </ProtectedRoute>
                        } />

                        <Route exact path="/ownedkeys" element={
                            <ProtectedRoute isLoading={isLoading} requiresAdmin={false}>
                                <SeeOwnedKeysPage />
                            </ProtectedRoute>
                        } />

                    </Routes>

                </DialogProvider>

            </ClientInfoProvider>
        </div>
    );
}

export default App;