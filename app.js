// server initialization
// Import necessary modules
import { loadAssets } from "./src/utils/load.assets.js"
import { application } from "./server.js"
import { port, apiVersion, prod } from "./src/config/config.js"
import { makeDbConnection } from "./src/mongoose/index.mongoose.js"

// Import routers
import devRouters from "./src/router/devRouters/dev.router.js"
import officeRouters from "./src/router/officeRouters/office.router.js"
import authRouters from "./src/router/authenticationRouters/authentication.router.js"

import superAdminRouters from "./src/router/superAdminRouters/super.admin.router.js"
import adminRouters from "./src/router/adminRouters/admin.routers.js"

import appointmentRouters from "./src/router/appointmentRouters/appointment.routers.js"
import doctorRouters from "./src/router/doctorRouters/doctor.routers.js"
import patientRouters from "./src/router/patientRouters/patient.routers.js"
import reportRouters from "./src/router/reportRouters/report.routers.js"
import robotRouters from './src/router/robotRouters/robot.routers.js'

// Use routers for various API endpoints
application.use(`/api/${apiVersion}/developer`, devRouters)
application.use(`/api/${apiVersion}/office`, officeRouters)
application.use(`/api/${apiVersion}/authentication`, authRouters)

application.use(`/api/${apiVersion}/superAdmin`, superAdminRouters)
application.use(`/api/${apiVersion}/admin`, adminRouters)

application.use(`/api/${apiVersion}/appointment`, appointmentRouters)
application.use(`/api/${apiVersion}/doctor`, doctorRouters)
application.use(`/api/${apiVersion}/patient`, patientRouters)
application.use(`/api/${apiVersion}/report`, reportRouters)
application.use(`/api/${apiVersion}/robot`, robotRouters)

// Load all the environment files to avoid crashing
loadAssets() ?
     // Start the server
    application.listen(port,
        async () => {
            // Determine server mode     
            const mode = prod("development") // Possible values: others | testing | production
            console.log(`Server is Running on👉 Port [ ${port} ]\n👉 Mode [ ${mode} ]`)
            // Connect to the database
            await makeDbConnection(true)
        }
    ) :
    // Export the function to initialize the server
    console.log("🔴 Cannot read env file.")