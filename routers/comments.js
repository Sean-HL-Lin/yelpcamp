var express = require("express");
var router = express.Router({mergeParams:true});
var camp = require("../models/campground");
var Comment =require("../models/comment");
var middleWares = require("../middlewares/index")

//====================================================================
// comment routes
//====================================================================

// new form 
router.get('/campgrounds/:id/comments/new', middleWares.isLoggedIn, function(req, res) {
    //find camp by id 
     camp.findById(req.params.id, function(err, result){
         if(err){
            console.log(err);
         } else {
             res.render('comments/new', {campground:result});
         }
    });
});

// create new post 
router.post('/campgrounds/:id/comments', middleWares.isLoggedIn, function(req, res){
        //get id 
         camp.findById(req.params.id, function(err, resultcamp){
            if(err){
                console.log('there is a err');
                console.log(err);
            } else {
                // create comments
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        console.log('there is an err');
                        console.log(err);
                    } else {
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        resultcamp.comments.push(comment);
                        resultcamp.save();
                        // redirect 
                        req.flash('success','Comment Created')
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                });
            }
    });
});


// comment edit form
router.get('/campgrounds/:id/comments/:comment_id/edit', middleWares.checkCommentOwnerhip, function(req, res){
    Comment.findById(req.params.comment_id, function(err, resultcomment) {
        if(err){
            console.log('comment  err=================')
            console.log(err)
            res.redirect('/campgrounds/' + req.params.id)
        } else{
            res.render('comments/edit', {comment : resultcomment, campground_id : req.params.id})
        }
    })
    
})

// update comment

router.put('/campgrounds/:id/comments/:comment_id', middleWares.checkCommentOwnerhip , function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, resultcomment){
        if (err){
            console.log('comment update err=================')
            console.log(err)
            res.redirect('/campgrounds/' + req.params.id)
        } else {
            req.flash('success','Comment Updated')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// delete comment
router.delete('/campgrounds/:id/comments/:comment_id', middleWares.checkCommentOwnerhip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, result){
        if(err) {
            console.log('comment delete err=================')
            console.log(err)
            res.redirect('/campgrounds/' + req.params.id)
        } else {
            req.flash('success','Comment Removed')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})



module.exports= router;