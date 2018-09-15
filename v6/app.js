const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        Campground      = require("./models/campground"),
        Comment         = require("./models/comment"),
        User            = require("./models/user"),
        seedDB          = require("./seeds");

seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp_v6', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "BRAC is a private university",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

//=============
//AUTH ROUTES
//=============

//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

// sign up logic
app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//logout route
app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}





app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Has Started........");
});