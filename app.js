const express = require('express');
const swig = require('swig');
const path = require('path')
const app = express();
const port = 3000;

// Disable Express's and Swig Cache
swig.setDefaults({
  cache: false
})
app.set('view cache', false);
app.set('views','templates');
app.set('view engine','html');

app.engine('html', swig.renderFile);

app.use(express.static(__dirname + '/static'));
app.use(express.static('routes'));
app.use(express.static('model'));

// API
const userAPI = require('./routes/api/user')
const attractionAPI = require('./routes/api/attraction')
const requireAPI = require('./routes/api/require')
const scheduleAPI = require('./routes/api/schedule')
app.use('/api', userAPI)
app.use('/api', attractionAPI)
app.use('/api', requireAPI)
app.use('/api', scheduleAPI)

// Page
const indexPage = require('./routes/page/index')
const nextPage = require('./routes/page/next')
const schedulePage = require('./routes/page/schedule')
const mySchedulePage = require('./routes/page/my-schedule')
const userCenterPage = require('./routes/page/user-center')
app.use(indexPage)
app.use(nextPage)
app.use(schedulePage)
app.use(mySchedulePage)
app.use(userCenterPage)

app.listen(port, () => {
  console.log(`server is started at http://localhost:${port}`)
})