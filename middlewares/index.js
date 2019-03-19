var middleWares ={}
var camp = require("../models/campground")
var Comment = require("../models/comment")

middleWares.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash('error', 'Please Login first')
        res.redirect('/login');
    }
};

middleWares.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated){
        camp.findById(req.params.id, function(err, resultperson){
            if(resultperson.author.id.equals(req.user._id) || req.user.admin){
                next();
            } else {
                req.flash('error', 'authorization failed')
                res.redirect("back");
            }
        });
    } else {
        req.flash('error', 'authentication failed')
        res.redirect('/login');
    }
    
}


middleWares.checkCommentOwnerhip = function(req ,res, next){
    if(req.isAuthenticated) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                req.flash('error', 'comment not exist')
                console.log('comment not exist ====')
                console.log(err)
                res.redirect('back')
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next()
                } else {
                    req.flash('error', 'authorization failed')
                    res.redirect('back')
                }
            }
        })
    } else {
        req.flash('error', 'Please Login first')
        res.redirect('/login')
    }
}


module.exports = middleWares;