require('dotenv').config();
const   express     = require("express");
        app         = express();
        bodyParser  = require("body-parser");
        mongoose    = require("mongoose");
        flash       = require("connect-flash");
let     Campground      = require("./models/campground");
        Comment         = require("./models/comment");
        passport        = require("passport");
        LocalStrategy   = require("passport-local");
        methodOverride  = require("method-override");
        User            = require("./models/user");
// requiring routes
let commentRoutes       = require("./routes/comments");
const expressSanitizer = require('express-sanitizer');
    campgroundRoutes    = require("./routes/campgrounds");
    indexRoutes         = require("./routes/index");
app.locals.moment = require("moment");

mongoose.connect(process.env.DATABASEURL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.json());
app.use(expressSanitizer());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Gym training",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>
{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, () => 
{
    console.log("YelpCamp Server has started at port 3000!");
});