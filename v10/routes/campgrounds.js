var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");



//INDEX - show all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author:author};
    
    Campground.create(newCampground, function (err, newlyCampground) {
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwenership,  function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
                    res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwenership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwenership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, deleteCampground) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//middleware


module.exports = router;