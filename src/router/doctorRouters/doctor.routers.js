import { router } from "../../../server.js"

import middleware from "./import.js"
import controller from "../../controller/doctorControllers/doctor.controller.js"

const doctorRouters = router

//post routers
doctorRouters.post("/doctor-details", middleware.doctorDetailsApi, controller.doctorDetailsApi)
doctorRouters.post("/edit-doctor-details", middleware.editDoctorDetailsApi, controller.editDoctorDetailsApi)
doctorRouters.post("/list-of-doctors", middleware.listOfDoctorsApi, controller.listOfDoctorsApi)
doctorRouters.post("/list-of-departments", middleware.listOfDepartmentsApi, controller.listOfDepartmentsApi)


export default doctorRouters