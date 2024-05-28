
/**
 * Gets the current date.
 *
 * @return {Date} The current date.
 */
export const getDate = () => {
    const date = new Date()
    return date
}


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

    return `${hours24Str}:${minutesStr}`
}



export const isValidDate = (year, month, day) => {

    if (month < 1 || month > 12) {
        return false
    }

    if (day < 1 || day > 31) {
        return false
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11))
    {
        return day != 31    
    }
    else if (month == 2)
    {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return day <= 29
        } else {
            return day <= 28
        }
    }
    else
    {
        return true    
    }
}

