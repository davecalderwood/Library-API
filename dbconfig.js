const monk = require('monk')
require('dotenv').config()
const db = monk(process.env.DB_URL)

module.exports = db