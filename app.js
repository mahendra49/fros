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
    Post                            = require("./models/posts");


mongoose.connect("mongodb://localhost/social");

//serve "public" files and set view engine as "ejs"
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(flash());
app.use(expressSanitizer());

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
    res.render("feed",{currentUser:req.user});
});

app.get("/posts/new",isLoggedIn,function(req,res){
    res.render("new");
});

app.post("/posts",isLoggedIn,function(req,res){
    
    req.body.post.body = req.sanitize(req.body.post.body);
    
    Post.create(req.body.post,function(err,post){
        if(err){
            console.log("error in crating paper");
            res.redirect("/posts/new");
        }
        else{
             User.findOne({username:req.user.username},function(err,founduser){
                if(err){
                    console.log("error in finding user");
                    res.redirect("/login");
                }else{
                    founduser.posts.push(post);
                    founduser.save(function(err,data){
                        if(err){
                            console.log("error in sacing post, try again");
                            res.redirect("/");
                        }
                        else{
                            //console.log(data);
                            res.redirect("/user");
                        }
                    });
                }
             });
        }
    });
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

app.listen(3000,function(){
    console.log("server started");
});