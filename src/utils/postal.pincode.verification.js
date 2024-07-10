/**
 * Validates an Indian postal code using the postal pincode in API.
 * 
 * @param {string} postalCode - The postal code to validate.
 * @returns {Promise<boolean|string>} - Returns a promise that resolves to true if the postal code is valid, false if invalid, 
 * or an error message if the postal code is empty or undefined.
 */
export const isValidPostalCode = async (postalCode) => {
    if (!postalCode) {
        return "postal code is empty or undefined";
    }

    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${postalCode}`);
        const data = response.data;
        if (data[0].Status === 'Success') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return { error: 'An error occurred while verifying the postal code' };
    }
}
