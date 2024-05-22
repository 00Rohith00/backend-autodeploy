import { collections } from "../../mongoose/index.mongoose.js"
import { verifyPassword, generateJwtToken, passwordEncryption } from "../../router/authenticationRouters/authentication.helper.js"
import { returnStatement } from "../../utils/return.handler.js"
import { addNewSubscriber, sendEmail } from "../microServices/emailNotification.js"

/**
 * Checks if a user with the given email ID exists in the database. 
 * This function takes in data containing the user's email ID. 
 * It queries the database to check if a user with the provided email ID exists. 
 * If the user exists, it resolves the promise with an object indicating the user's existence and whether they are new or not. 
 * If the user does not exist, it throws an error message. 
 * If any other error occurs during the process, it throws an internal server error message.
 * 
 * Additional Notes:
 * This authentication module is common for user like super admin ,admin, doctor, system admin. And this function is common to
 * check the whether user is existing or not
 *
 * @param {Object} data - The data object containing the user's email ID.
 * @param {string} data.body.user_email_id - The email ID of the user to check.
 * @return {Promise<Object>} A promise that resolves to an object indicating if the user exists and if they are new or not.
 * @throws {string} If the user does not exist, an error message is thrown.
 * @throws {string} If any other error occurs, an internal server error message is thrown.
 */
const isExistingUserApi = async (data) => {

  try {

    const isExistingEmailId = await collections.UserDetailModel.findOne(
      { user_email_id: data.body.user_email_id },
      { _id: 1 })

    if (isExistingEmailId != null) {

      const loginObjectId = await collections.UserModel.findOne({ user_details: isExistingEmailId._id }, { _id: 0 })
        .populate({
          path: 'user_login',
          select: 'update_count -_id',
        })

      return returnStatement(true, "existing email id",
        {
          isExist: true,
          isNew: loginObjectId.user_login.update_count ? false : true
        })
    }

    else {
      throw returnStatement(false, "email id is not found")
    }
  } catch (error) {

    if (error.status == false && error.message != null) {
      // if client id is not found then this if statement will execute
      throw error.message
    }
    else {
      // if any error occurs while inserting or retrieving a data we can find that using error._message [in build property]
      // if we got some other error just returning a internal server error to the front end.
      throw error._message ? error._message : "internal server error"
    }
  }
}


/**
 * Sets a new password for a user based on their email ID.
 * This function takes in a data object containing the user's email ID and the new password. It updates the user's password 
 * in the database and returns a Promise that resolves to an object indicating the success of the password update. If the 
 * email ID is not found, it throws an error object with status false and message "email id not found". If any other error occur
 * during the process, it throws an error message "internal server error".
 * 
 * Additional Notes:
 * This authentication module is common for user like super admin ,admin, doctor, system admin. And this function is common to
 * check the whether user's password on their email ID
 *
 * @param {Object} data - The data object containing the user's email ID and new password.
 * @param {string} data.body.user_email_id - The email ID of the user.
 * @param {string} data.body.password - The new password for the user.
 * @return {Promise<Object>} A promise that resolves to an object indicating the success of the password update.
 * @throws {Object} If the email ID is not found, an error object with status false and message "email id not found" is thrown.
 * @throws {string} If any other error occurs, an error message "internal server error" is thrown.
 */
const setPasswordApi = async (data) => {

  try {

    const ObjectIdOfUserDetails = await collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id })

    if (ObjectIdOfUserDetails != null) {
      const userDetails = await collections.UserModel
        .findOne({ user_details: ObjectIdOfUserDetails._id }, { user_login: 1, _id: 0 })
        .populate({
          path: 'user_login',
          select: '_id update_count',
        })
      await collections.UserLoginModel.findOneAndUpdate(
        { _id: userDetails.user_login._id },
        {
          $set: {
            password: passwordEncryption(data.body.password),
            update_count: ((userDetails.user_login.update_count) + 1)
          }
        },//password encryption gives hash string
        { new: true }
      )
      return returnStatement(true, "password is updated")
    }
    else { throw returnStatement(false, "email id not found") }

  } catch (error) {

    if (error.status == false && error.message != null) { throw error.message }
    else { throw error._message ? error._message : "internal server error" }
  }
}



/**
 * Function that handles user login authentication. This function takes in a data object containing user credentials
 * such as email ID, password, and role ID for login. It then validates the provided credentials and attempts to authenticate 
 * the user. If successful, it returns a Promise that resolves to an object indicating the success of the login attempt.
 * If the email ID is not found, it throws an error object with status false and message "email id not found". If the password 
 * is invalid or the user role is invalid, it throws an error object with status false and message "invalid password" or "invalid 
 * user role". If any other error occurs during the authentication process, it throws an error message "internal server error".
 * 
 * Additional Notes:
 * This authentication module is common for user like super admin ,admin, doctor, system admin. And this function is common to
 * check the whether user's login credentials like email Id, password and user's role
 * 
 * @param {Object} data - The data object containing user credentials for login.
 * @param {string} data.body.user_email_id - The email ID of the user.
 * @param {string} data.body.password - The password of the user.
 * @param {string} data.body.role_id - The role ID of the user.
 * @return {Promise<Object>} A promise that resolves to an object indicating the success or failure of the login attempt.
 * 
 * @throws {Object} If the email ID is not found, an error object with status false and message "email id not found" is thrown.
 * @throws {Object} If the password is invalid or the user role is invalid, an error object with status false and message "invalid password" or "invalid user role" is thrown.
 * @throws {string} If any other error occurs, an error message "internal server error" is thrown.
 */
const userLoginApi = async (data) => {

  try {
    const ObjectIdOfUserDetails = await collections.UserDetailModel
      .findOne({ user_email_id: data.body.user_email_id, },
        { _id: 1, user_name: 1 })

    if (ObjectIdOfUserDetails != null) {

      const userDetails = await collections.UserModel
        .findOne({ user_details: ObjectIdOfUserDetails._id },
          { _id: 0, user_login: 1, user_id: 1, user_roles: 1 })
        .populate({
          path: 'user_roles',
          select: '-_id role_id role_name',
        })

      const loginDetails = await collections.UserLoginModel.findById(userDetails.user_login)

      if (loginDetails.update_count == 0) {
        throw returnStatement(false, "set password")
      }
      const verifyUserPassword = verifyPassword(data.body.password, loginDetails.password)

      if (verifyUserPassword && userDetails.user_roles.role_id == data.body.role_id) {

        return returnStatement(true, "login successful",
          {
            user_name: ObjectIdOfUserDetails.user_name,
            user_id: userDetails.user_id,
            token: generateJwtToken(
              {
                user_id: userDetails.user_id,
                role_id: data.body.role_id,
                role_name: userDetails.user_roles.role_name
              })
          })
      }
      else {
        throw returnStatement(false, userDetails.user_roles.role_id == data.body.role_id ?
          "invalid password" : "invalid user role")
      }

    }
    else { throw returnStatement(false, "email id not found") }

  } catch (error) {
    if (error.status == false && error.message != null) { throw error.message }
    else { throw error._message ? error._message : "internal server error" }
  }
}


const sendOtpApi = async (data) => {

  try {
    const isExistingEmailId = await collections.UserDetailModel.findOne(
      { user_email_id: data.body.user_email_id },
      { _id: 1 })

    if (isExistingEmailId != null) {

      const [loginObjectId, otpCollection] = await Promise.all([
        await collections.UserModel.findOne({ user_details: isExistingEmailId._id }, { _id: 0 })
          .populate({
            path: 'user_login',
            select: 'update_count -_id',
          }),
        await collections.OtpModel.findOne({ user_email_id: data.body.user_email_id })
      ])

      if (!loginObjectId.user_login.update_count) {
        throw returnStatement(false, "this email id didn't set password yet")
      }

      const otp = 1234                           // write an method for generate a dynamic otp

      await addNewSubscriber(data.body.user_email_id)

      if (otpCollection == null) {

        await collections.OtpModel.create({
          user_email_id: data.body.user_email_id,
          otp: otp,
          expiry_date_time: Date.now() + 10 * 60000
        })
      }
      else {

        const timeDifference = Date.now() - otpCollection.expiry_date_time

        if (timeDifference < 0) {
          throw returnStatement(false, `you have to wait ${Math.abs(Math.round(timeDifference / 60000))} mins to send next otp`)
        }

        await collections.OtpModel.findOneAndUpdate(
          { user_email_id: data.body.user_email_id },
          { $set: { otp: otp, expiry_date_time: Date.now() + 10 * 60000 } },
          { new: true }
        )
      }
      await sendEmail(data.body.user_email_id, "email notification testing", "atre health tech", "srohith10012002@gmail.com", `hello guys current i am doing email notification service using mail chimp ${otp}`)

      return returnStatement(true, "OTP sent successfully")
    }
    else { throw returnStatement(false, "email id is not found") }
  }
  catch (error) {
    if (error.status == false && error.message != null) { throw error.message }
    else { throw error._message ? error._message : "internal server error" }
  }
}


const verifyOtpApi = async (data) => {

  try {

    const [isExistingEmailId, otpCollection] = await Promise.all([
      await collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id }),
      await collections.OtpModel.findOne({ user_email_id: data.body.user_email_id })
    ])
  
    if (isExistingEmailId != null && otpCollection != null) {

      const timeDifference = Date.now() - otpCollection.expiry_date_time

      if (timeDifference < 0 && data.body.otp == otpCollection.otp) {

        return returnStatement(true, "OTP is correct")
      }
      else {
        throw returnStatement(false, timeDifference > 0 ?
          "OTP is expired" : "invalid OTP")
      }

    }
    else { throw returnStatement(false, isExistingEmailId == null ? "email id not found" : "you didn't send otp recently") }

  }
  catch (error) {
    if (error.status == false && error.message != null) { throw error.message }
    else { throw error._message ? error._message : "internal server error" }
  }
}

export default {
  isExistingUserApi, setPasswordApi,
  userLoginApi, sendOtpApi, verifyOtpApi
}