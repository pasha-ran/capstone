// Defines allowed PID regexes to prevent HTML errors
const VALID_PID_REGEX = /^[a-zA-Z0-9]+$/;
const VALID_OR_MOCK_PID_REGEX = /^[a-zA-Z0-9_@.-]+$/;
const VALID_TAG_REGEX = /^[0-9]+[0-9.]*$/;


/**
 * Service class for user data
 */
class UsersService {

    /**
     * Get all users in the system
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or array of users JSONs }
     */
    async getAllUsers() {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users`;

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
     * Get specific user in the system
     * 
     * @param {string} pid - The pid for the user of interest
     * 
     * @return A promise containing JSON like { ok: bool msg: str, data: null or JSON of user }
     */
    async getSingleUser(pid) {

        // Ensure a valid pid was specified
        if (pid === null || !pid.match(VALID_OR_MOCK_PID_REGEX)) {
            let msg = "Error! PID is invalid!";
            return { ok: false, msg: msg, data: null };
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/${pid}`;

        // Send GET request
        const response = await fetch(url, { method: "GET", credentials: "include" }).catch(e => console.error("Error" + e));

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
     * Get specific user in the system BY NAME
     * 
     * @param {string} full_name 
     * 
     * @return A promise containing JSON like { ok: bool msg: str, data: null or JSON of user }
     */
     async getSingleUserByName(full_name) {

        //alert(full_name);

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/name/${full_name}`;

        // Send GET request
        const response = await fetch(url, { method: "GET", credentials: "include" }).catch(e => console.error("Error" + e));

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
     * Add a user to the system
     * 
     * @param {Object} user             - An object containing details needed for a new user
     * @param {string} user.pid         - The pid of the user
     * @param {string} user.full_name   - The full name of the user
     * @param {string} user.role        - The role of the user (must be "reqestor" (default), "administrator, or sudo")
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
     async addUser(user) {

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users`;

        // Send POST request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(user)
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
     * Get specific user's owned keys
     * 
     * @param {string} pid - The pid for the user of interest
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or array of key JSONs }
     */
    async getUserOwnedKeys(pid) {

        // Ensure a valid pid was specified
        if (pid === null || !pid.match(VALID_OR_MOCK_PID_REGEX)) {
            let msg = "Error! PID is invalid!";
            return { ok: false, msg: msg, data: null };
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/${pid}/keys`;

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
     * Get specific user's owned keys
     * 
     * @param {string} full_name
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null or array of key JSONs }
     */
    async getUserOwnedKeysByName(full_name) {

    
        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/name/${full_name}/keys`;

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
     * Update specific user's properties
     * 
     * @param {string} pid - The pid of the user
     * @param {Object} userFields - An object containing user fields to change for a user
     * @param {string} userFields.full_name - The full name for a user
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async updateUser(pid, userFields) {

        // Ensure a valid pid was specified
        if (pid === null || !pid.match(VALID_OR_MOCK_PID_REGEX)) {
            let msg = "Error! PID is invalid!";
            return { ok: false, msg: msg, data: null };
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/${pid}`;

        // Send PATCH request
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(userFields)
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
     * Assigns a key to a user
     * @param {string} pid          - The pid to assign to
     * @param {string} tagNumber    - The tag number of the key to assign
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async assignKey(pid, tagNumber) {

        // Ensure a valid pid was specified
        if (pid === null || !pid.match(VALID_OR_MOCK_PID_REGEX)) {
            let msg = "Error! PID is invalid!";
            return { ok: false, msg: msg, data: null };
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/${pid}/keys/${tagNumber}`;

        // Send POST request
        const response = await fetch(url, { method: "POST", credentials: "include" });

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
     * Remove a key from a user
     * @param {string} pid          - The pid to remove from
     * @param {string} tagNumber    - The tag number of the key to remove
     * 
     * @return A promise containing JSON like { ok: bool, msg: str, data: null }
     */
    async removeKey(pid, tagNumber) {

        // Ensure a valid pid was specified
        if (pid === null || !pid.match(VALID_OR_MOCK_PID_REGEX)) {
            let msg = "Error! PID is invalid!";
            return { ok: false, msg: msg, data: null };
        }

        // Ensure a valid tag number was specified
        if (tagNumber === null || !tagNumber.match(VALID_TAG_REGEX)) {
            let msg = "Error! Tag number cannot be empty / negative";
            return { ok: false, msg: msg, data: null };
        }

        // Create URL
        let url = `${process.env.REACT_APP_API_URL}/users/${pid}/keys/${tagNumber}`;

        // Send DELETE request
        const response = await fetch(url, { method: "DELETE", credentials: "include" });

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

export default new UsersService();