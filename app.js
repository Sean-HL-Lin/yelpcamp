var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user");
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var methodOverride = require("method-override");


// routers
var authRoute = require("./routers/auth");
var campgroundsRoute = require("./routers/campgrounds");
var commentRoute = require("./routers/comments");
var flash= require("connect-flash");

var url = process.env.database || 'mongodb://localhost:27017/yelpcamp';
mongoose.connect(url , {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public') );
app.use(methodOverride('_method'));
app.use(flash());

app.use(session({
    secret:'i love cat',
    resave:false,
    saveUninitialized: false
}));


// passport configuration 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(authRoute);
app.use(campgroundsRoute);
app.use(commentRoute);


//===================================
app.listen(process.env.PORT, process.env.IP, function(req,res){
    console.log('the server has started');
});





