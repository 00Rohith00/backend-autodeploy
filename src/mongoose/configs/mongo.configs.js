import mongoose from 'mongoose'
import { mongooseConfig } from '../../config/config.js'

/**
 * Asynchronously connects to the Mongoose database based on the provided usage flag.
 *
 * @param {boolean} usage - A flag indicating whether to connect to the database.
 * @return {Promise} A promise that resolves once the connection process is completed.
 */
export const connectToMongoose = async (usage) => {
  try {
    if (usage) {
      mongoose.connect(mongooseConfig.URL)
      console.log("🟢 Connected to database!")
    }
    else {
      console.log("🟡 Working with no database!")
    }
  } catch (error) {
    console.error(error)
    console.log("Connection failed!")
  }
}
