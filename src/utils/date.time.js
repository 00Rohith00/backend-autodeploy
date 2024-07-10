/**
 * Gets the current date.
 *
 * @return {Date} The current date.
 */
export const getDate = () => {
    const date = new Date()
    return date
}


/**
 * Converts a 12-hour formatted time string to a 24-hour formatted time string.
 * @param {string} time12h - The input time string in 12-hour format (e.g., 'hh:mm AM/PM').
 * @returns {string} The converted time string in 24-hour format (e.g., 'hh:mm').
 */
export const convertTimeTo24HourFormat = (time12h) => {

    const [time, period] = time12h.split(' ')
    const [hours, minutes] = time.split(':').map(Number)

    let hours24 = hours
    if (period === 'PM' && hours !== 12) {
        hours24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
        hours24 = 0
    }

    // Formatting the output
    const hours24Str = hours24.toString().padStart(2, '0')
    const minutesStr = minutes.toString().padStart(2, '0')

    return `${hours24Str}:${minutesStr}:00`
}



/**
 * Validates if a given date and time are in the future compared to the current date and time.
 * @param {string} date - The date string in ISO format (e.g., 'YYYY-MM-DD').
 * @param {string} time - The time string in 12-hour format with AM/PM (e.g., 'hh:mm AM/PM').
 * @returns {boolean} Returns true if the combined date and time are in the future, otherwise false.
 */
export const validateDateTime = (date, time) => {

    const now = new Date()
    const inputDateTime = new Date(`${date}T${convertTimeTo24HourFormat(time)}`)
    return inputDateTime > now
}



/**
 * Checks if the given year, month, and day form a valid date.
 * @param {number} year - The year (e.g., 2024).
 * @param {number} month - The month (1 for January, 2 for February, ..., 12 for December).
 * @param {number} day - The day of the month (1 to 31, depending on the month and year).
 * @returns {boolean} Returns true if the year, month, and day together form a valid date; otherwise, false.
 */
export const isValidDate = (year, month, day) => {

    if (month < 1 || month > 12) {
        return false
    }

    if (day < 1 || day > 31) {
        return false
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11)) {
        return day != 31
    }
    else if (month == 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return day <= 29
        } else {
            return day <= 28
        }
    }
    else {
        return true
    }
}

