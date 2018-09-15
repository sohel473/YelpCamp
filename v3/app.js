const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
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
            res.render("index",{campgrounds: allCampgrounds});
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
    res.render("new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Has Started........");
});