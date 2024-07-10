console.clear()

import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// List of environment variables to check
const envVars = [
    'LOAD_ENV',
    'PORT',
    'API_VERSION',
    'MONGO_URL',
    'DEPLOYMENT_MODE',
    'TESTING_MODE',
    'DEVELOPMENT_MODE',
    'JWT_TOKEN_SECRET_KEY',
    'JWT_EXPIRES_IN',
    'SUPER_ADMIN',
    'ADMIN',
    'SYSTEM_ADMIN',
    'DOCTOR',
    'SUPER_ADMIN_ROLE_ID',
    'ADMIN_ROLE_ID',
    'SYSTEM_ADMIN_ROLE_ID',
    'DOCTOR_ROLE_ID',
    'EMAIL_SERVICE_API_KEY',
    'EMAIL_SERVICE_AUDIENCE_ID',
    'EMAIL_SERVICE_SERVER'
]

// Flag to track if any env var is missing
let allEnvVarsDefined = true

// Check if each environment variable has a value
envVars.forEach((envVar) => {
    if (process.env[envVar] === undefined || process.env[envVar] === '') {
        console.log(`❌ Environment variable ${envVar} is undefined or empty`)
        allEnvVarsDefined = false
    }
})

if (allEnvVarsDefined) {
    console.log('☑️  All environment variables are defined.')
    console.log('🌐 Application started.')
    import('./app.js')
} else {
    console.log('🔴 One or more environment variables are undefined or empty. Application will not start.')
    process.exit(1)  // Exit the process with an error code
}
