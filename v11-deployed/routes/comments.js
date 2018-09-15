var express = require("express");
var router = express.Router({mergeParams: true});

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwenership, function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwenership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwenership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, removedComment) {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;