const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        flash           = require("connect-flash"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        methodOverride  = require("method-override"),
        // Campground      = require("./models/campground"),
        // Comment         = require("./models/comment"),
        User            = require("./models/user");
        // seedDB          = require("./seeds");

//requiring routes        
var     commentRoute        = require("./routes/comments"),
        campgroundsRoutes   = require("./routes/campgrounds"),
        indexRoutes         = require("./routes/index");
        


//database connection
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v8";
mongoose.connect(url, { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
// seedDB();


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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoute);




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Has Started........");
});