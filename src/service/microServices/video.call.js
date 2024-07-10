import https from "https"
import axios from "axios"


/**
 * This function calls the video call API with the provided conference information. 
 * This function accepts an object containing conference details such as appointment date, appointment time, and owner. 
 * It initiates a video call using these details. If the call is successful, the promise resolves to an object 
 * containing the meeting URL and moderator URL. If there's an error during the call, the promise resolves to "null".
 *
 * @param {Object} conferenceInfo - An object containing conference information.
 * @param {string} appointmentDate - The date of the appointment for the conference.
 * @param {string} appointmentTime - The time of the appointment for the conference.
 * @param {string} conferenceInfo.owner - The owner or initiator of the conference. One side of the call doctor and 
 * other hand the patient. 
 * @returns {Promise<Object|string>} A Promise that resolves to an object containing the meeting URL and moderator URL 
 * if the video call initiation is successful. If there's an error during the call, the Promise resolves to "null".
 */
export const videoCallApi = async (conferenceInfo) => {

    // convert the given time to utc format
    const localDate = conferenceInfo.appointment_date
    const localTime = conferenceInfo.appointment_time

    // Create a new Date object with the local date and time
    const localDateTime = new Date(`${localDate} ${localTime}`)

    // Convert the local date and time to UTC format
    const startUtcDateTime = localDateTime.toISOString()

    const agent = new https.Agent({
        rejectUnauthorized: false
    })

    const config = {
        method: "POST",
        url: `https://tr.atrehealthtech.com/scheduleConference?owner=${conferenceInfo.owner}&start_time=${startUtcDateTime}`,
        headers: {},
        httpsAgent: agent,
    }

    try {
        const meetingUrl = await axios(config)
        var meetingDetails = {
            "meetingUrl": meetingUrl.data.meetingUrl,
            "moderatorUrl": meetingUrl.data.moderatorUrl
        }
        return meetingDetails

    } catch (error) {
        console.log("Unable to fetch meeting url from external server")
        return "null"
    }
}
