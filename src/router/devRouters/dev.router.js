import { prod } from "../../config/config.js"
import { router } from "../../../server.js"
import { debounceHandler } from "../../middleware/debounce/api.debounce.js"

import middleware from "./imports.js"
import controller from '../../controller/devControllers/dev.controllers.js'


const devRouters = router

if (prod() == "development" || prod() == "testing") {
    devRouters.get("/seed-data", middleware.seedDataApi, controller.seedDataApi)
    // -> #ie devRouters.get("/seed-data", debounceHandler(middleware.seedDataApi), controller.seedDataApi)
    devRouters.get("/clear-data", middleware.clearDataApi, controller.clearDataApi)
}

export default devRouters