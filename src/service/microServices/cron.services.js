import cron from 'node-cron'

/**
 * This function is used to start the cron server.
 * 
 * @function cronServer
 * @module cronServer
 * @description This function is used to start the cron server.
 * @param {*} start - start the cron server.
 * @param {*} end - end the cron server.
 * @returns {Promise<void>} - Promise that resolves to void.
 * @throws {Error} - Throws an error if the start argument is not a boolean.
 * 
 */
const cronServer = async (start = false) => {

    start ?
        console.log("🟢 Cron Server started...", "")
        :
        console.log("🔴 Please pass the argument to start cron server...")

    if (start) {
        // update here
        cron.schedule('*/3  * * * *', async () => {
            // add the functions that are need to run in cron
        })

        cron.schedule('*/1  * * * *', async () => {
            // add the functions that are need to run in cron

        })

        // Schedule a task to run every hour '0 * * * *' represents a schedule where the 
        //job runs at the 0th minute of every hour.
        cron.schedule('0 * * * *', async () => {
            // add the functions that are need to run in cron
        })

    }
}

export { cronServer }