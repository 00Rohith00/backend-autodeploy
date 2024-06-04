import { collections, rollBack } from "../../mongoose/index.mongoose.js"
import { role, roleId } from "../../config/config.js"
import { returnStatement } from "../../utils/return.handler.js"

/**
 * Admin creates a new system admin API endpoint. This function takes in data containing user 
 * information such as user ID, name, email, contact number, location, pin code, branch ID, image URL, and role name. 
 * It then validates the provided data and creates a new system admin user in the database. 
 * If successful, it returns a Promise that resolves to a boolean indicating success or failure along with a message. 
 * If any error occurs during the process, it throws an error message. 
 *
 * @param {Object} data - The data containing the details of the new system admin.
 * @param {Object} data.body - The body of the request containing the details of the new system admin.
 * @param {string} data.body.user_id - The ID of the user creating the new system admin.
 * @param {string} data.body.branch_id - The ID of the branch the new system admin belongs to.
 * @param {string} data.body.user_name - The name of the new system admin.
 * @param {string} data.body.user_email_id - The email ID of the new system admin.
 * @param {string} data.body.user_contact_number - The contact number of the new system admin.
 * @param {string} data.body.user_location - The location of the new system admin.
 * @param {string} data.body.user_age - The age  of the new system admin.
 * @param {string} data.body.user_pin_code - The pin code of the new system admin.
 * @param {string} data.body.role_name - The role name of the new system admin.
 * @param {string} data.body.image_url - The URL of the image of the new system admin.
 * @return {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation.
 * @throws {string} If an error occurs during the creation of the new system admin, an error message is thrown.
 */
const createNewSystemAdminApi = async (data) => {
  // Object to store parameters for rollback in case of failure
  const systemAdminRollBackParams = {}

  try {
    // Fetching necessary details from different collections
    const [adminDetails, isEmailExist] = await Promise.all([
      await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 }),
      await collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id })
    ])

    const healthCenterDetails = await collections.HealthCenterModel.findOne({ branch_id: data.body.branch_id, client_id: adminDetails.client_id })

    // Validation checks
    if (adminDetails && !isEmailExist && data.body.role_name === role.admin && healthCenterDetails) {
      // Creating personal details for the new user
      const personalDetails = {
        user_name: data.body.user_name,
        user_email_id: data.body.user_email_id,
        user_contact_number: data.body.user_contact_number,
        user_location: data.body.user_location,
        user_pin_code: data.body.user_pin_code,
        user_gender: data.body.user_gender,
        user_age: data.body.user_age,
        doctor: null
      }
      const userDetailsCollection = await collections.UserDetailModel.create(personalDetails)

      // If user details are created successfully
      if (userDetailsCollection._id) {
        systemAdminRollBackParams.UserDetailModel = userDetailsCollection._id

        // Creating user role
        const userRolesCollection = await collections.UserRoleModel.create({
          role_id: roleId.systemAdmin,
          role_name: role.systemAdmin
        })

        // If user role is created successfully
        if (userRolesCollection._id) {
          systemAdminRollBackParams.UserRoleModel = userRolesCollection._id
          const userLoginCollection = await collections.UserLoginModel.create({ update_count: 0 })

          // If user login details are created successfully
          if (userLoginCollection._id) {
            systemAdminRollBackParams.UserLoginModel = userLoginCollection._id
            const allDetails = {
              client_id: adminDetails.client_id,
              branch_id: data.body.branch_id,
              user_details: userDetailsCollection._id,
              user_roles: userRolesCollection._id,
              user_login: userLoginCollection._id,
              image_url: data.body.image_url,
              is_archive: false,
              created_by: data.body.user_id
            }
            const userCollection = await collections.UserModel.create(allDetails)

            // If user collection is created successfully
            if (userCollection._id) {
              // Update system admin ID directly in the health center collection
              const userId = userCollection.user_id
              await collections.HealthCenterModel.findOneAndUpdate(
                { branch_id: data.body.branch_id },
                { $push: { system_admin_id: userId } },
                { new: true }
              )
              return returnStatement(true, "System admin is created")
            }
            else { throw error }
          }
          else { throw error }
        }
        else { throw error }
      }
      else { throw error }
    }
    else {
      // Error handling for validation failures
      throw returnStatement(false,
        !adminDetails ? "User ID is not found" :
          isEmailExist ? "Email ID already exists" :
            !healthCenterDetails ? "Branch ID not found" :
              `${data.body.role_name} user can't able to create a new system admin`)
    }
  } catch (error) {
    // Rollback in case of failure
    rollBack(systemAdminRollBackParams)

    // Error handling
    if (error.status == false && error.message) { throw error.message }
    else { throw error._message ? error._message : "internal server error" }
  }
}

/**
 * Admin creates a new doctor API. This function is responsible for creating a new doctor based on the provided data. 
 * The 'data' object should contain details such as the user ID of the creator, doctor registration ID, year of MBBS completion, 
 * department, schedule timings, approval status, name, email, contact number, location, pin code, role name, and image URL of the 
 * new doctor. The function returns a Promise that resolves to an object indicating the success or failure of the operation. 
 * If any error occurs during the creation process, an error message is thrown.
 *
 * @param {Object} data - The data object containing the details of the new doctor.
 * @param {Object} data.body - The body object containing the details of the new doctor.
 * @param {string} data.body.user_id - The ID of the user creating the new doctor.
 * @param {string} data.body.doctor_registration_id - The registration ID of the new doctor.
 * @param {string} data.body.mbbs_completed_year - The year the new doctor completed MBBS.
 * @param {string} data.body.doctor_department - The department of the new doctor.
 * @param {string} data.body.time_from - The start time of the new doctor's schedule.
 * @param {string} data.body.time_to - The end time of the new doctor's schedule.
 * @param {boolean} data.body.is_approved - The approval status of the new doctor.
 * @param {string} data.body.user_name - The name of the new doctor.
 * @param {string} data.body.user_email_id - The email ID of the new doctor.
 * @param {string} data.body.user_contact_number - The contact number of the new doctor.
 * @param {string} data.body.user_location - The location of the new doctor.
 * @param {string} data.body.user_pin_code - The pin code of the new doctor.
 * @param {string} data.body.role_name - The role name of the new doctor.
 * @param {string} data.body.image_url - The URL of the image of the new doctor.
 * @return {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation.
 * @throws {string} If an error occurs during the creation of the new doctor, an error message is thrown.
 */
const createNewDoctorApi = async (data) => {
  const doctorRollBackPrams = {}

  try {

    const [adminDetails, doctorCollection, isEmailExist] = await Promise.all([
      await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 }),
      await collections.DoctorModel.findOne({ doctor_registration_id: data.body.doctor_registration_id }),
      await collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id })
    ])

    if (adminDetails && !doctorCollection && !isEmailExist && data.body.role_name === role.admin) {

      const doctorDetails = {
        doctor_registration_id: data.body.doctor_registration_id,
        mbbs_completed_year: data.body.mbbs_completed_year,
        doctor_department: data.body.doctor_department,
        is_approved: true                               // write a cron job for doctor verification
      }

      if (data.body.time_from) doctorDetails.time_from = data.body.time_from
      if (data.body.time_to) doctorDetails.time_from = data.body.time_to

      const doctorDetailsCollection = await collections.DoctorModel.create(doctorDetails)

      if (doctorDetailsCollection._id) {
        doctorRollBackPrams.doctorDetailsCollection = doctorDetailsCollection._id

        const personalDetails = {
          user_name: data.body.user_name,
          user_email_id: data.body.user_email_id,
          user_contact_number: data.body.user_contact_number,
          user_location: data.body.user_location,
          user_pin_code: data.body.user_pin_code,
          user_gender: data.body.user_gender,
          user_age: data.body.user_age,
          doctor: doctorDetailsCollection._id
        }
        const userDetailsCollection = await collections.UserDetailModel.create(personalDetails)

        if (userDetailsCollection._id) {
          doctorRollBackPrams.UserDetailModel = userDetailsCollection._id
          const userRolesCollection = await collections.UserRoleModel.create({ role_id: roleId.doctor, role_name: role.doctor })

          if (userRolesCollection._id) {
            doctorRollBackPrams.UserRoleModel = userRolesCollection._id
            const userLoginCollection = await collections.UserLoginModel.create({ update_count: 0 })

            if (userLoginCollection._id) {
              doctorRollBackPrams.UserLoginModel = userLoginCollection._id
              const allDetails = {
                client_id: adminDetails.client_id,
                branch_id: null,
                user_details: userDetailsCollection._id,
                user_roles: userRolesCollection._id,
                user_login: userLoginCollection._id,
                image_url: data.body.image_url,
                is_archive: false,
                created_by: data.body.user_id
              }
              const userCollection = await collections.UserModel.create(allDetails)

              if (userCollection._id) {
                return returnStatement(true, "doctor is created")
              }
              else { throw error }
            }
            else { throw error }
          }
          else { throw error }
        }
        else { throw error }
      }
      else { throw error }
    }
    else {
      throw returnStatement(false,
        !adminDetails ? "used id is not found" :
          isEmailExist ? "email id is already exists" :
            doctorCollection ? " doctor registration id is already exist" :
              `${data.body.role_name} user can't able to create new doctor`)
    }
  }
  catch (error) {
    rollBack(doctorRollBackPrams)
    if (error.status == false && error.message) { throw error.message }
    else { throw error._message ? error._message : "internal server error" }
  }
}


export default {
  createNewSystemAdminApi, createNewDoctorApi
}  