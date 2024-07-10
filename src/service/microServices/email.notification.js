import mail from '@mailchimp/mailchimp_marketing'
import axios from 'axios'
import { emailService } from '../../config/config.js'

mail.setConfig({
    apiKey: emailService.apiKey,
    server: emailService.server
})

/**
 * This function checks if an email address exists in the mailing list.
 * 
 * @async
 * @function isExistingEmail
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the email address exists in the mailing list.
 * @throws {Error} - Throws an error if the email service request fails.
 */
const isExistingEmail = async (email) => {
    try {
        let emailAddresses = []
        let count = 0
        let offset = 0
        const limit = 1000

        do {
            const response = await mail.lists.getListMembersInfo(emailService.audienceId, {
                count: limit,
                offset: offset
            })

            emailAddresses = emailAddresses.concat(response.members.map(member => member.email_address))
            count = response.members.length
            offset += limit
        } while (count === limit)
        return emailAddresses.includes(email)

    } catch (error) { throw error }
}

/**
 * This function adds a new subscriber to the mailing list if the email address does not already exist.
 * 
 * @async
 * @function addNewSubscriber
 * @param {string} email - The email address to add as a subscriber.
 * @returns {Promise<void>} - A promise that resolves when the email has been added to the mailing list.
 * @throws {Error} - Throws an error if the email service request fails.
 */
export const addNewSubscriber = async (email) => {

    try {
        const isExistingEmails = await isExistingEmail(email)

        if (!isExistingEmails) {

            await mail.lists.addListMember(emailService.audienceId, {
                email_address: email,
                status: 'subscribed',
            })
        }
    } catch (error) { throw error }
}

/**
 * This function sends an email to a specified recipient.
 * 
 * @async
 * @function sendEmail
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject line of the email.
 * @param {string} fromName - The name to display in the "from" field.
 * @param {string} replyTo - The reply-to email address.
 * @param {string} message - The HTML content of the email.
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 * @throws {Error} - Throws an error if the email service request fails.
 */
export const sendEmail = async (email, subject, fromName, replyTo, message) => {

    try {

        const segmentDetails = {
            name: `${email}` + Date.now(),
            static_segment: [`${email}`]
        }

        const segment = await mail.lists.createSegment(emailService.audienceId, segmentDetails)

        const url = `https://${emailService.server}.api.mailchimp.com/3.0/campaigns`
        const data = {

            type: 'regular',
            settings: {
                subject_line: subject,
                from_name: fromName,
                reply_to: replyTo
            },
            recipients: {
                list_id: emailService.audienceId,
                segment_opts: { saved_segment_id: parseInt(segment.id) }
            }
        }

        const campaignResponse = await axios.post(url, data, { headers: { 'Authorization': `apiKey ${emailService.apiKey}` } })


        const campaignId = campaignResponse.data.id

        await axios.put(`${url}/${campaignId}/content`, { html: message }, { headers: { 'Authorization': `apiKey ${emailService.apiKey}` } })

        await mail.campaigns.send(campaignId)

    } catch (error) { throw error }
}


