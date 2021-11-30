const app = require('./app')

const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

// config file
dotenv.config({ path: 'config/config.env'})

// database
connectDatabase();



app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})