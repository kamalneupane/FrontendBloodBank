const mongoose = require('mongoose')
const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useUnifiedTopology: true
    })
    .then(con => console.log(`DB connected with host ${con.connection.host}`))
    .catch(err => console.log(err))
}
module.exports = connectDatabase