import { router } from "../../../server.js"

import middleware from "./import.js"
import controller from "../../controller/patientControllers/patient.controllers.js"

const patientRouters = router

//post routers
patientRouters.post('/create-new-patient', middleware.createNewPatientsApi, controller.createNewPatientsApi)
patientRouters.post('/list-of-patients', middleware.listOfPatientsApi, controller.listOfPatientsApi)
patientRouters.post('/patient-details', middleware.patientDetailsApi, controller.patientDetailsApi)
patientRouters.post('/edit-patient-details', middleware.editPatientDetailsApi, controller.editPatientDetailsApi)
patientRouters.post('/previous-history', middleware.previousHistoryApi, controller.previousHistoryApi)

export default patientRouters