/**
 * Component for protected routes
 */

// Library imports
import React, { useContext } from 'react';
import LoadingSpin from "react-loading-spin";

// Component imports
import UnauthorizedText from "./UnauthorizedText";

// Context imports
import ClientInfoContext from "../contexts/ClientInfoContext";

export default function ProtectedRoute({ isLoading, requiresAdmin, children }) {

    // Get client info
    const clientInfo = useContext(ClientInfoContext);

    // Define roles that can see administrator views
    const adminstratorViewRoles = new Set(["administrator", "sudo"]);

    // First we must check if we are loading. This takes highest priority
    if (!isLoading) {

        // Flickering happens here!
        if (clientInfo === null) {
            return <UnauthorizedText showNeedAdmin={false} />;
        } else {            
            if(requiresAdmin && !adminstratorViewRoles.has(clientInfo.role)) {
                return <UnauthorizedText showNeedAdmin={true} />;
            } else {
                return children;
            }
        }
        
    } else {
        return <LoadingSpin />;
    }

}
