var mongoose                        = require("mongoose"),
    express                         = require("express"),
    app                             = express(),
    passport                        = require("passport"),
    bodyparser                      = require("body-parser"),
    Localstartegy                   = require("passport-local"),
    expressSanitizer                = require("express-sanitizer"),
    passportlocalmongoose           = require("passport-local-mongoose"),
    User                            = require("./models/users"),
    flash                           = require("connect-flash"),
    User                            = require("./models/users"),
    Post                            = require("./models/posts"),
    Comment                         = require("./models/comments"),
    Index                           = require("./routes/index"),
    PostRoute                       = require("./routes/posts"),
    CommentRoute                    = require("./routes/comments"),
    LikeRoute                       = require("./routes/like"),
    Middleware                      = require("./middleware/index");


mongoose.connect("mongodb://localhost/social",{useNewUrlParser:true});

//serve "public" files and set view engine as "ejs"
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(flash());
app.use(expressSanitizer());
app.use(bodyparser.json());

//sessions
app.use(require("express-session")({
    secret:"holla bolla dolla",
    resave:false,
    saveUninitialized:false
}));


//passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//all routes here
app.use("/",Index);
app.use("/posts",PostRoute);
app.use("/posts/comment/:id",CommentRoute);
app.use("/posts/like/:id",LikeRoute);

app.listen(3000,function(){
    console.log("server has started");
});