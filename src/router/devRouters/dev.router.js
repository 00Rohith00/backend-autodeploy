import express from "express"
import { prod } from "../../config/config.js"
import middleware from "./imports.js"
import controller from '../../controller/devControllers/dev.controllers.js'
import { debounceHandler } from "../../middleware/debounce/api.debounce.js"

const devRouters = express.Router()

if (prod() == "development" || prod() == "testing") {
    devRouters.get("/seed-data", middleware.seedDataApi, controller.seedDataApi)
    // -> #ie devRouters.get("/seed-data", debounceHandler(middleware.seedDataApi), controller.seedDataApi)
    devRouters.get("/clear-data", middleware.clearDataApi, controller.clearDataApi)
    // testing issue of url bug
    devRouters.get("/callFromDev", (req, res) => { console.log("callFromDev") })
}

export default devRouters