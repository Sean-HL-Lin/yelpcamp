var express = require("express");
var router = express.Router({mergeParams:true});
var camp = require("../models/campground");
var middleWares = require("../middlewares/index");
//=====================
//campgrounds
//==========================

router.get('/', function(req, res){
    res.render('landing');
});

//load all camps
router.get('/campgrounds', function(req, res){
    camp.find({}, 
    function(err, result) {
        if(err) {
            console.log('there is a err');
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', {campgrounds:result});
        }
    }
    );
});

// form for creating new camp
router.get('/campgrounds/new', middleWares.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});


//create new camp
router.post('/new', middleWares.isLoggedIn, function(req,res){
    //get data from form and creat new campground 
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {id:req.user._id, username:req.user.username};
    var newcamp = {name:name, image:image,description:description, author:author};
    // add new camp to database 
    camp.create(newcamp, function(err, result){
        if(err) {
            console.log('there is a err');
            console.log(err);
        } else {
            //redirect to right page
            req.flash('success','Campground Created')
            res.redirect('/campgrounds');
        }
    });

});


//  show -more info page 
router.get('/campgrounds/:id', function(req,res){
    camp.findById(req.params.id).populate('comments').exec(function(err, result){
        if(err) {
            console.log('there is a err');
            console.log(err);
        } else {
            res.render('campgrounds/moreInfo', {campground:result});
        }
    });
});

// load edit form
router.get('/campgrounds/:id/edit',middleWares.checkCampgroundOwnership, function(req, res) {
    camp.findById(req.params.id, function(err, resultcamp){
            res.render('campgrounds/edit', {camp: resultcamp});
    });
});

// updata campground
router.put('/campgrounds/:id/', middleWares.checkCampgroundOwnership, function(req, res){
    camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, resultcamp){
            req.flash('success','Campground Updated')
            res.redirect('/campgrounds/' + req.params.id);
    });
}
);

//delete campground
router.delete('/campgrounds/:id', middleWares.checkCampgroundOwnership, function(req, res){
        camp.findByIdAndRemove(req.params.id, function(err, resultcamp){
            req.flash('success','Campground Removed')
            res.redirect('/campgrounds');
    });
})




module.exports = router;