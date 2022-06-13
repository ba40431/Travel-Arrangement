const express = require('express');
const app = express();

require('dotenv').config()
const {PORT = 3000} = process.env


app.set('views','templates');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));
app.use(express.static('routes'));
app.use(express.static('model'));

// API
const userAPI = require('./routes/api/user')
const locationAPI = require('./routes/api/location')
const requireAPI = require('./routes/api/require')
const itineraryAPI = require('./routes/api/itinerary')
const myItineraryAPI = require('./routes/api/my-itinerary')
const boardAPI = require('./routes/api/board')
const authAPI = require('./routes/api/auth')
const subscribeAPI = require('./routes/api/subscribe')
const dashboardAPI = require('./routes/api/dashboard')
const shareAPI = require('./routes/api/share')
// const loaderio = require('./routes/api/loaderio')
app.use('/api', userAPI)
app.use('/api', locationAPI)
app.use('/api', requireAPI)
app.use('/api', itineraryAPI)
app.use('/api', myItineraryAPI)
app.use('/api', authAPI)
app.use('/api', boardAPI)
app.use('/api', subscribeAPI)
app.use('/api', dashboardAPI)
app.use('/api', shareAPI)
// app.use(loaderio)

// Page
const indexPage = require('./routes/page/index')
const nextPage = require('./routes/page/next')
const itineraryPage = require('./routes/page/itinerary')
const myItineraryPage = require('./routes/page/my-itinerary')
const dashboardPage = require('./routes/page/dashboard')
const boardPage = require('./routes/page/board')
const signInPage = require('./routes/page/sign-in');
app.use(indexPage)
app.use(nextPage)
app.use(itineraryPage)
app.use(myItineraryPage)
app.use(dashboardPage)
app.use(boardPage)
app.use(signInPage)

app.listen( PORT, () => {
  console.log(`server is started at http://localhost:${PORT}`)
})