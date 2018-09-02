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
    Comment                         = require("./models/comments");

mongoose.connect("mongodb://localhost/social");

//serve "public" files and set view engine as "ejs"
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(flash());
app.use(expressSanitizer());
app.use(bodyparser.json());

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
    
    Post.find({}).populate("comments").exec(function(err,posts){
        if(err){
            console.log("in user route");
            res.redirect("/");
        }
        else{
            res.render("feed",{currentUser:req.user,posts:posts});      
        }  
    });
    //
});



//new posts logic
app.get("/posts/new",isLoggedIn,function(req,res){
    res.render("new");
});

//display all posts logic missing :p

app.post("/posts",isLoggedIn,function(req,res){
    
    //req.body.post.body  = req.sanitize(req.body.post.body);
    var newPost   = req.body.post;
    var author    = {
        id          : req.user._id,
        username    : req.user.username
    };
    
    newPost.author = author; 
    Post.create(newPost,function(err,post){
        if(err){
            console.log("error--posts route");
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
                            console.log("error in saving post, try again");
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

app.get("/comment/:id",isLoggedIn,function(req,res){
    res.render("comment",{id:req.params.id});
});

//comments logic
app.post("/comment/:id",isLoggedIn,function(req,res){
    //get posts and add this comment to it;
    //console.log(req.user);
    console.log("im here"+req.body.comment);
    Post.findById(req.params.id,function(err,Post){
        if(err){
            console.log(err);
            res.redirect("/user");
        }else{
            Comment.create({text:req.body.comment},function(err,comment){
                if(err){
                    //flash here
                    console.log("error in comments");
                    res.redirect("/user");
                }else{
                    //add username and id to comment
                    comment.author.id       = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                   // console.log(comment);
                    //push to Post
                    Post.comments.push(comment);
                    Post.save();

                    var data={"comment":comment.text,"username":comment.author.username};
                    res.json(data);
                    res.status(200).end();

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