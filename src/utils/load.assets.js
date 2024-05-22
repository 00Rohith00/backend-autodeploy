/**
 * Retrieves the value of environment variable and converts it to a boolean.
 * 
 * @return {boolean} The boolean value based on the environment variable.
 */
export const loadAssets = () => {
    const loadEnvBoolean = Boolean(Number(loadData("load Assets", process.env.LOAD_ENV)))
    return loadEnvBoolean
}                                                                                   

/**
 * Retrieves the value of an environment variable, or logs an error message if the variable is not found.
 *
 * @param {string} envName - The name of the environment variable to retrieve.
 * @param {string} env - The value of the environment variable. If not provided, the function will attempt to retrieve the value from the process environment.
 * @return {string|undefined} The value of the environment variable, or undefined if the variable is not found.
 * 
 */
export const loadData = (envName, env) => {
    const isEnvHasValue = env && env !== undefined ? env : console.log(`🔴 New ${envName} env variable is not found.. \n💬  Please add to starter file...`)
    return isEnvHasValue
}
