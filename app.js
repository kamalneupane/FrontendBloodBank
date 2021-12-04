const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')
const path = require('path')
const methodOverride = require('method-override')

app.set('view engine', 'ejs')

// load static files
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use("/uploads",express.static("uploads"))


app.get('/',(req, res) => res.render('frontend/index'))



app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())



// import all routes
const blood = require('./routes/blood')
const user = require('./routes/auth')
const request = require('./routes/request')
const donation = require('./routes/donation')


app.use(blood)
app.use(user)
app.use(request)
app.use(donation)

app.use(errorMiddleware)

app.use(function(req, res, next) {
    res.status(404).render('404'); 
});


module.exports = app