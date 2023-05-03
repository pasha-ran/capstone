import React, { createContext } from 'react'

// Define the context object
const ClientInfoContext = createContext(null);

// Define the provider
export const ClientInfoProvider = ClientInfoContext.Provider;

// Export the context object
export default ClientInfoContext;