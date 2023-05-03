/**
 * Service layer for API calls to email routes
 */

class EmailService {


    /**
     * Get the administrator email
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
     async getAdminEmail() {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/email`;

        // Send GET request
        const response = await fetch(url, { credentials: "include" });

        // Clone response
        const dataResponse = response.clone();

        // Get response message
        let msg = await response.text();

        // Exit if the response is not ok
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
     * Update the administrator email
     * 
     * @param {string} email        - The new administrator email
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
     async updateAdminEmail(email) {
        
        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/email/${email}`;
        
        // Send PATCH request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH",
            credentials: "include"
        });
        
        // Get the response message
        const msg = await response.text();
        
        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: null };
    }

    /**
     * Send a request email to a recipient
     * 
     * @param {Object} email              - An object containing details for the email
     * @param {number} email.student_id   - The requestors last 4 digits of student id
     * @param {string} email.recipient    - An email address to the recipient
     * @param {string} email.key_type     - The key type
     * @param {string} email.description  - The description of the key of interest
     * @param {string} email.reason       - The reason why the requestor needs the key
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async sendRequestEmail(email) {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/email/request`;

        // Send POST request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(email)
        });

        // Get the response message
        const msg = await response.text();

        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: null };
    }

    /**
     * Send a return email to administrator
     * 
     * @param {Object} email              - An object containing details for the email
     * @param {number} email.tag_number   - The tag number for the returned key
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async sendReturnEmail(email) {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/email/return`;

        // Send POST request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(email)
        });

        // Get the response message
        const msg = await response.text();

        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: null };
    }

    /**
     * Send a return email to administrator
     * 
     * @param {Object} email        - An object containing details for the email
     * @param {number} tag_number   - The tag number for the returned key
     * @param {string} reason       - The reason why the key was reported  
     *
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async sendReportEmail(email) {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/email/report`;

        // Send POST request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(email)
        });

        // Get the response message
        const msg = await response.text();

        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: null };
    }
}

export default new EmailService();