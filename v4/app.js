const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment"),
        seedDB      = require("./seeds");

seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp_v3', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



// Campground.create(
//     {
//             name: "Andrew Miles",
//             image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104496f1c47ba3eeb1bf_340.jpg",
//             description: "This is beautiful in night. So much stars in the clear sky!!"
//     }, function (err, campground) {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("new campground created");
//             console.log(campground);
//         }
//     });




app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
    
    // res.render("campgrounds",{campgrounds: campgrounds});
});

//CREATE - add new campground to DB
app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    
    Campground.create(newCampground, function (err, newlyCampground) {
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ===============
// COMMENTS ROUTES
// ===============

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, newComment) {
                if(err){
                    console.log(err);
                }
                else {
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Has Started........");
});