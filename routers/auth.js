var express = require("express");
var router = express.Router({mergeParams:true});
var passport =require("passport");
var User = require("../models/user");



//=========================================================
//Auth route
//===============================================================

//register form
router.get('/register', function(req, res) {
    res.render('Auth/register');
});


//register new user 
router.post('/register', function(req, res) {
    var newUser = new User({
        username:req.body.username
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            
            console.log('there is a err');
            console.log(err);
            return res.redirect('/register');
        } else{
            passport.authenticate("local")(req, res, function(){
                req.flash('success', 'You are Registered')
                res.redirect('/campgrounds')});
        }
    });
});

//admin register form
router.get('/register_for_admin_only', function(req, res) {
    res.render('Auth/admin_register');
});
// register new admin
router.post('/register_for_admin_only', function(req, res) {
    var newUser = new User({
        username:req.body.username,
        admin: true
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log('there is a err');
            console.log(err);
            return res.redirect('/register');
        } else{
            passport.authenticate("local")(req, res, function(){
                req.flash('success', 'Welcome, Admin!')
                res.redirect('/campgrounds')});
        }
    });
});



//login form 
router.get('/login', function(req, res) {
    res.render('Auth/login');
});

//login logic 
router.post('/login',  passport.authenticate('local',{
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req, res) {
});

router.get('/logout', function(req, res) {
  req.logout()  ;
  req.flash('success', 'You are Logged Out');
  res.redirect('/campgrounds');
});


//user profile
router.get('/user/:id', function(req, res) {
    User.findById(req.params.id).populate('createdCamps').exec(
        function(err, user){
            if(err){
                console.log('user not found')
            } else {
                res.render('user/show', {user:user})
            }
        }
)
})

    


module.exports = router;