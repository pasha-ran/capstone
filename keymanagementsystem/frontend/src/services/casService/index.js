/**
 * Service layer for API calls to CAS routes
 */
class CASService {

    /**
     * Get the authentication status of the client
     * 
     * @return A promise containing JSON like 
     * { ok: bool, msg: str, data: null or is_authenticated: bool }
     */
    async getClientAuthentication() {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/cas/authenticated`;

        // Send GET request
        const response = await fetch(url, { credentials: "include" });

        // Clone response
        const dataResponse = response.clone();

        // Get response message
        let msg = await response.text();

        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Get the data
        const data = await dataResponse.json();

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: data };
    }

    /**
     * Get client's information in system
     * 
     * @return A promise containing JSON like 
     * { ok: bool, msg: str, data: null or client's data }
     */
    async getClientInfo() {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/cas/info`;

        // Send GET request
        const response = await fetch(url, { credentials: "include" });

        // Clone response
        const dataResponse = response.clone();

        // Get response message
        let msg = await response.text();

        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Get the data
        const data = await dataResponse.json();

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: data };
    }
}

export default new CASService();