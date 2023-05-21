const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const morgan= require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
const session = require('express-session')
const passport = require('passport')
const methodOverride= require('method-override')
const MongoStore = require('connect-mongo')(session)

dotenv.config({path:'./config/config.env'})


require('./config/passport')(passport)

connectDB()

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

if (process.env.NODE_ENV==='developmant'){
    app.use(morgan('dev'))
}


const{formatDate ,stripTags, truncate, editIcon} = require ('./helpers/hbs')


app.engine('.hbs', exphbs({helpers :{editIcon,formatDate,stripTags,truncate},defaultLayout:'main', extname:'.hbs'}));
app.set('view enging', '.hbs');

app.use(session({
    secret: "Vanakkam da mapla",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
  }));
  
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.user=req.user || null
  next()
})

app.use(express.static(path.join(__dirname,'public')))

app.use('/',require('./routs/index'))
app.use('/auth',require('./routs/auth'))
app.use('/stories',require('./routs/stories'))

const port = process.env.PORT 

app.listen(port,console.log(`Running server in ${process.env.NODE_ENV} mode on port ${port}`))
