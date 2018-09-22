//all required
const   express          = require("express"),
        router           = express.Router(),
        Post             = require("../models/posts"),
        User             = require("../models/users"),
        Middleware       = require("../middleware/index"),
        expressSanitizer = require("express-sanitizer");

//new posts logic
router.get("/new",Middleware.isLoggedIn,function(req,res){
    res.render("new");
});

router.post("/",Middleware.isLoggedIn,function(req,res){
    
    //req.body.post.body  = req.sanitize(req.body.post.body);
    
    let newPost   = req.body.post;
    newPost.body  = req.sanitize(newPost.body);
    newPost.title = req.sanitize(newPost.title);
    newPost.image = req.sanitize(newPost.image);
    
    let author    = {
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
                            res.redirect("/user");
                        }
                    });
                }
             });
        }
    });
});

 // db.posts.find({"created":{"$lte":new Date("Thu Sep 20 2018 19:52:14 GMT+0530")}});

 router.post("/loadpost",(req,res)=>{
    console.log("here");
    var timestamp=req.body.timestamp;
    Post.find({"created":{"$lte":new Date(timestamp)}})
        .sort('-created').limit(5)
        .populate("comments").exec((err,data)=>{
            if(err){
                console.log("error in ajax load comments");
                res.json({"error":"loading ajax"});
            }else{  
                res.json(data);    
            }
            
    });    
 });

module.exports = router; 