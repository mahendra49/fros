const   express     = require("express"),
        router      = express.Router(),
        passport    = require("passport"),
        Post        = require("../models/posts"),
        User        = require("../models/users"),
        Middleware  = require("../middleware/index");


//login page
router.get("/login",Middleware.isLogged,function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
        successRedirect:"/user",
        failureRedirect:"/login"
    }),function(req,res){
});

//register page
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",Middleware.isLogged,function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;
    
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
router.get("/user",Middleware.isLoggedIn,function(req,res){
    
    Post.find({}).sort('-created').limit(5).populate("comments").exec(function(err,posts){
        if(err){
            console.log("in user route");
            res.redirect("/");
        }
        else{
            res.render("feed",{currentUser:req.user,posts:posts});      
        }  
    });
    
});



router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

module.exports = router; 