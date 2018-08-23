var mongoose                        = require("mongoose"),
    express                         = require("express"),
    app                             = express(),
    passport                        = require("passport"),
    bodyparser                      = require("body-parser"),
    Localstartegy                   = require("passport-local"),
    passportlocalmongoose           = require("passport-local-mongoose"),
    User                            = require("./models/users"),
    flash                           = require("connect-flash"),
    User                            = require("./models/users");


mongoose.connect("mongodb://localhost/social");

//serve "public" files and set view engine as "ejs"
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(flash());


app.use(require("express-session")({
    secret:"holla bolla dolla",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//login page
app.get("/login",isLogged,function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
        successRedirect:"/user",
        failureRedirect:"/login"
    }),function(req,res){
});

//register page
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",isLogged,function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var email=req.body.email;


    User.register({
        username:username,
        email:email
    },password,function(err,user){
        if(err){
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/user");
            });
        }
    });
    
});


//index page
app.get("/user",isLoggedIn,function(req,res){
    res.render("feed");
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function isLogged(req,res,next){
    
    if(!req.isAuthenticated()){
       return next();
    } 

    res.redirect("/user");
}

app.listen(5000,function(){
    console.log("server started");
});