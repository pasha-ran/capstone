const VALID_TAG_REGEX = /^[0-9]+[0-9.]*$/;

/**
 * Service layer for API calls to key routes
 */
class KeysService {

    /**
     * Get all keys in the system
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or array of key JSONs }
     */
    async getAllKeys() {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys`;

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
     * Get specific key in the system
     * 
     * @param {string} tagNumber - The tag number for the key of interest
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or JSON of key }
     */
    async getSingleKey(tagNumber) {

        // Ensure a valid tag number was specified
        if (tagNumber === null || !tagNumber.match(VALID_TAG_REGEX)) {
            alert("Error! No valid tag number was specified!");
            return;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys/${tagNumber}`;

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
     * Get the owner of a specific key in the system
     * 
     * @param {string} tagNumber - The tag number for the key of interest
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or JSON of owner }
     */
     async getKeyOwner(tagNumber) {

        // Ensure a valid tag number was specified
        if (tagNumber === null || !tagNumber.match(VALID_TAG_REGEX)) {
            alert("Error! No valid tag number was specified!");
            return;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys/${tagNumber}/owner`;

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
     * Add a key to the system
     * 
     * @param {Object} key              - An object containing details needed for a new key
     * @param {string} key.tag_number   - The tag number for a key
     * @param {string} key.series_id    - The series ID for a key
     * @param {number} key.sequence_id  - The sequence ID for a key
     * @param {string} key.building     - The building for a key
     * @param {string} key.key_type     - The type of key (must be either "door", "display", or "file_cabinet")
     * @param {number} key.location     - The location for a key (must be a comma separated list if multiple)
     * @param {string} key.comment      - A comment for a key (optional)
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async addKey(key) {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys`;

        // Send POST request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(key)
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
     * Update properties about a key
     * 
     * @param {string} tagNumber        - The tag number for the key of interest
     * @param {Object} key              - An object containing details needed for a new key
     * @param {string} key.tag_number
     * @param {string} key.series_id    - The new series ID for a key
     * @param {number} key.sequence_id  - The new sequence ID for a key
     * @param {string} key.building     - The new building for a key
     * @param {string} key.key_type     - The new type of key (must be either "door", "display", or "file_cabinet")
     * @param {number} key.location     - The new location for a key (must be a comma separated list if multiple)
     * @param {string} key.comment      - A comment for a key (optional)
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async updateKey(tagNumber, key) {

        // Ensure a valid tag number was specified
        if (tagNumber === null || !tagNumber.match(VALID_TAG_REGEX)) {
            alert("Error! No valid tag number was specified!");
            return;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys/${tagNumber}`;

        // Send PATCH request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(key)
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
     * Return a key to the system
     * 
     * @param {string} tagNumber - The tag number for the key of interest
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async returnKey(tagNumber) {

        // Ensure a valid tag number was specified
        if (tagNumber === null || !tagNumber.match(VALID_TAG_REGEX)) {
            alert("Error! No valid tag number was specified!");
            return;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys/${tagNumber}/return`;

        // Send PATCH request
        const response = await fetch(url, { method: "PATCH", credentials: "include" });

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

    /**
     * Delete a key from the system
     * 
     * @param {string} tagNumber - The tag number for the key of interest
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async deleteKey(tagNumber) {

        // Ensure a valid tag number was specified
        if (tagNumber === null || !tagNumber.match(VALID_TAG_REGEX)) {
            alert("Error! No valid tag number was specified!");
            return;
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/keys/${tagNumber}`;

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

export default new KeysService();