/**
 * Service class for ledger data
 */

class LedgerService {

    /**
     * Get all records in the ledger
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or array of record JSONs }
     */
    async getAllRecords() {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/ledger`;

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
     * Get specific record in the ledger in the system
     * 
     * @param {number} oid - The object id of the record of interest in the ledger
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or JSON of record }
     */
    async getRecord(oid) {

        // Ensure oid was set correctly
        if (oid === null || oid === "") {
            console.log("Error! oid is not set correctly for LedgerService! Returning null...");
            return null;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/ledger/${oid}`;

        // Send GET request
        const response = await fetch(url, { method: "GET", credentials: "include" });

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
     * Add a record to the ledger in the database
     * 
     * @param {Object} record              - An object containing details needed for a new record
     * @param {string} record.tag_number   - The tag number for the associated key
     * @param {string} record.pid          - The pid for the user
     * @param {string} record.exchange     - The exchange type for the record
     * @param {string} record.comment      - The comment to add
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async addRecord(record) {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/ledger`;

        // Send POST request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(record)
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
     * Update properties about a record
     * 
     * @param {string} oid                  - The object id of the record of interest in the ledger
     * @param {Object} record               - An object containing details needed for an updated record
     * @param {string} record.tag_number    - The new tag number
     * @param {string} record.pid           - The new pid
     * @param {string} record.date          - The new date in YYYY-MM-DD format
     * @param {string} record.exchange      - The new exchange type
     * @param {string} record.comment       - The new comment
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async updateRecord(oid, record) {

        // Ensure oid was set correctly
        if (oid === null || oid === "") {
            console.log("Error! oid is not set correctly for LedgerService! Returning null...");
            return null;
        }

        // Ensure date is valid
        if (new Date(record.date).getTime() <= 0) {
            return { ok: false, msg: "Error! Date is invalid!", data: null };
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/ledger/${oid}`;

        // Send PATCH request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(record)
        });

        // Get the response message
        const msg = await response.text();

        // // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: null };
    }

    /**
     * Delete a specific record
     * @param {string} oid - The object id of the record of interest in the ledger
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async deleteRecord(oid) {

        // Ensure oid was set correctly
        if (oid === null || oid === "") {
            console.log("Error! oid is not set correctly for LedgerService! Returning null...");
            return null;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/ledger/${oid}`;

        // Send DELETE request
        const response = await fetch(url, { method: "DELETE", credentials: "include" });

        // Get response message
        let msg = await response.text();

        // Exit if response is not ok
        if (!response.ok) {
            console.error(msg);
            return { ok: false, msg: msg, data: null };
        }

        // Return a json containing response status, message and data
        return { ok: true, msg: msg, data: null };
    }

}

export default new LedgerService();