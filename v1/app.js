const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
            {name: "Salmon Creek", image: "https://farm6.staticflickr.com/5750/24049715015_f007bf73e0.jpg"},
            {name: "Andrew Miles", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f1c579aee4b2ba_340.jpg"},
            {name: "John Reese", image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104496f1c579aee4b2ba_340.jpg"}
        ];

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds",{campgrounds: campgrounds});
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Has Started........");
});